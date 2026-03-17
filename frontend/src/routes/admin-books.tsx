import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

type BookPage = {
  content: Book[];
  totalPages: number;
  totalElements: number;
  number: number;
};

export default function AdminBooksPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const canCreate = useMemo(() => title.trim().length > 0 && author.trim().length > 0, [title, author]);

  const fetchBooks = async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<BookPage>("/book", {
        params: { page: p, size: 12, search: s || undefined },
      });
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleCreate = async () => {
    if (!canCreate) return;
    setSaving(true);
    setError(null);
    try {
      await api.post("/book", { title: title.trim(), author: author.trim(), available: true });
      setTitle("");
      setAuthor("");
      await fetchBooks(0, search);
    } catch {
      setError("Failed to create book.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bookId: number) => {
    const ok = window.confirm("Delete this book? This cannot be undone.");
    if (!ok) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/book/${bookId}`);
      await fetchBooks(page, search);
    } catch {
      setError("Failed to delete book.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Books</h1>
          <p className="text-sm text-slate-500 mt-2">Create, edit, and delete books.</p>
        </div>

        <form
          className="flex w-full max-w-sm items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const q = (formData.get("search")?.valueOf() as string) || "";
            setSearch(q);
            setPage(0);
          }}
        >
          <Input name="search" type="search" placeholder="Search..." defaultValue={search} />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm font-semibold text-slate-700">Create a book</div>
            <div className="text-xs text-slate-500">Title and author are required.</div>
          </div>
          <Button onClick={handleCreate} disabled={!canCreate || saving}>
            {saving ? "Saving..." : "Create"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Books</div>
          <div className="text-xs text-slate-500">{books.length} shown</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-slate-500">Loading...</div>
        ) : books.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">No books found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {books.map((b) => (
              <div key={b.id} className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{b.title}</div>
                  <div className="text-sm text-slate-600 truncate">by {b.author}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Status:{" "}
                    <span className={b.available ? "text-emerald-600" : "text-rose-600"}>
                      {b.available ? "Available" : "Checked out"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" disabled={saving}>
                    <Link to={`/admin/books/${b.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm" disabled={saving} onClick={() => handleDelete(b.id)}>
                    Delete
                  </Button>
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
            Page {books.length > 0 ? page + 1 : 0} of {totalPages}
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

