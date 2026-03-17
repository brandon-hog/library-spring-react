import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

export default function AdminBookEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [available, setAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idNum = useMemo(() => Number(id), [id]);

  useEffect(() => {
    const run = async () => {
      if (!Number.isFinite(idNum)) {
        setError("Invalid book id.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<Book>(`/book/${idNum}`);
        setBook(res.data);
        setTitle(res.data.title);
        setAuthor(res.data.author);
        setAvailable(res.data.available);
      } catch {
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [idNum]);

  const canSave = title.trim().length > 0 && author.trim().length > 0 && Number.isFinite(idNum);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await api.put(`/book/${idNum}`, { id: idNum, title: title.trim(), author: author.trim(), available });
      navigate("/admin/books");
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500 p-4">Loading...</p>;
  if (error) return <p className="text-sm text-red-500 p-4">{error}</p>;
  if (!book) return <p className="text-sm text-slate-500 p-4">Book not found.</p>;

  return (
    <div className="p-4 space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
          <p className="text-sm text-slate-500 mt-2">Update the book details.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700">Author</div>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Available
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/books")} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

