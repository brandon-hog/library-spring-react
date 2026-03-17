import { useEffect, useMemo, useState } from "react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminCheckoutLogItem = {
  checkoutId: number;
  bookId: number | null;
  bookTitle: string | null;
  userId: number | null;
  userName: string | null;
  checkoutDate: string | null;
  returnDate: string | null;
};

type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function AdminCheckoutLogPage() {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [active, setActive] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rows, setRows] = useState<AdminCheckoutLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userIdNum = useMemo(() => {
    const n = Number(userId);
    return Number.isFinite(n) && userId.trim() !== "" ? n : null;
  }, [userId]);

  const bookIdNum = useMemo(() => {
    const n = Number(bookId);
    return Number.isFinite(n) && bookId.trim() !== "" ? n : null;
  }, [bookId]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<Page<AdminCheckoutLogItem>>("/admin/checkouts", {
          params: {
            page,
            size: 25,
            userId: userIdNum ?? undefined,
            bookId: bookIdNum ?? undefined,
            active: active ? true : undefined,
          },
        });
        setRows(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(res.data.number);
      } catch {
        setError("Failed to load checkout log.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page, userIdNum, bookIdNum, active]);

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout Log</h1>
        <p className="text-sm text-slate-500">Search all checkouts and returns.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700">User ID</div>
            <Input
              inputMode="numeric"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setPage(0);
              }}
              placeholder="(optional)"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700">Book ID</div>
            <Input
              inputMode="numeric"
              value={bookId}
              onChange={(e) => {
                setBookId(e.target.value);
                setPage(0);
              }}
              placeholder="(optional)"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700">Status</div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 pt-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={active}
                onChange={(e) => {
                  setActive(e.target.checked);
                  setPage(0);
                }}
              />
              Active only (not returned)
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Entries</div>
          <div className="text-xs text-slate-500">{rows.length} shown</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-slate-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">No entries.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((r) => (
              <div key={r.checkoutId} className="px-4 py-3 grid gap-1 sm:grid-cols-6">
                <div className="text-sm">
                  <div className="text-xs text-slate-500">Checkout</div>
                  <div className="font-medium text-slate-900">#{r.checkoutId}</div>
                </div>
                <div className="text-sm sm:col-span-2">
                  <div className="text-xs text-slate-500">Book</div>
                  <div className="font-medium text-slate-900 truncate">
                    {r.bookTitle ?? "-"}{" "}
                    <span className="text-slate-500 font-normal">
                      {r.bookId != null ? `(id: ${r.bookId})` : ""}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-slate-500">User</div>
                  <div className="font-medium text-slate-900 truncate">
                    {r.userName ?? "-"}{" "}
                    <span className="text-slate-500 font-normal">
                      {r.userId != null ? `(id: ${r.userId})` : ""}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-slate-500">Checked out</div>
                  <div className="text-slate-800">{formatDate(r.checkoutDate)}</div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-slate-500">Returned</div>
                  <div className={r.returnDate ? "text-slate-800" : "text-rose-600"}>
                    {r.returnDate ? formatDate(r.returnDate) : "Active"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between p-3 border-t border-slate-100">
          <Button size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={loading || page === 0}>
            Previous
          </Button>
          <span className="text-sm text-slate-700">
            Page {rows.length > 0 ? page + 1 : 0} of {totalPages}
          </span>
          <Button
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={loading || page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

