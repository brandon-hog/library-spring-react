import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/book-card";

export type Book = {
  id: number;
  title: string;
  author: string;
  available: boolean;
};

type BookPage = {
  content: Book[];
  totalPages: number;
  totalElements: number;
  number: number; // current page index (0-based)
};

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get<BookPage>("/book", {
          params: { page, size: 10 },
        });
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
        setPage(response.data.number);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  const handlePrevious = () => {
    if (page > 0) {
      setLoading(true);
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      setLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading books...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!books.length) {
    return <p className="text-sm text-slate-500">No books available.</p>;
  }

  return (
    <div className="space-y-4">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
        <p className="text-sm text-slate-500 m-2">
          Browse the full catalog and open any book to manage its status.
        </p>
      </div>

      <div className="space-y-4 h-full">
        <div className="m-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-600">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}

