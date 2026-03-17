import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";

type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

export default function MyBookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const response = await api.get<Book[]>("/book/my");
        setBooks(response.data);
      } catch (err) {
        setError("Failed to load your books.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500 p-4">Loading your books...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 p-4">{error}</p>;
  }

  if (!books.length) {
    return (
      <div className="space-y-2 p-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          My checked out books
        </h1>
        <p className="text-sm text-slate-500">
          You don&apos;t have any books checked out right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          My checked out books
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          These are the books currently checked out under your account.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-slate-600">by {book.author}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium">
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
            <div className="mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link to={`/book/${book.id}`}>View details</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

