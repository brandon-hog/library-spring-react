import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
  description?: string;
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const response = await api.get<Book>(`/book/${id}`);
        setBook(response.data);
      } catch (err) {
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!book) return;

    setUpdating(true);
    setError(null);
    try {
      if (book.available) {
        // Check out book - POST /api/book/{id}/checkout
        await api.post(`/book/${book.id}/checkout`);
        setBook({ ...book, available: false });
      } else {
        // Check in book - DELETE /api/book/{id}/checkout
        await api.delete(`/book/${book.id}/checkout`);
        setBook({ ...book, available: true });
      }
    } catch (err) {
      setError("Failed to update book status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading book...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!book) {
    return <p className="text-sm text-slate-500">Book not found.</p>;
  }

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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {book.title}
            </h1>
            <p className="text-sm text-slate-600">by {book.author}</p>

            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              {book.available ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600">Available</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <span className="text-rose-600">Checked out</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={handleToggleStatus}
              disabled={updating}
              variant={book.available ? "default" : "outline"}
            >
              {updating
                ? "Updating..."
                : book.available
                ? "Check out book"
                : "Check in book"}
            </Button>
          </div>
        </div>

        {book.description && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">
              Description
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {book.description}
            </p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

