import { useEffect, useState } from "react";

import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/book-card";
import { Input } from "@/components/ui/input";

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
  number: number;
};

export default function BookListPage() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get<BookPage>("/book", {
          params: { page, size: 9,  search: search || undefined },
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
  }, [page, search]);

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
    return <p className="text-sm text-slate-500 p-4">Loading books...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 p-4">{error}</p>;
  }

  if (!books.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500">No books available.</p>
      </div>
    );
  }

  return (
    // Replaced m-4 on children with p-4 on the parent to avoid 100% width + margin layout breaking
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex w-full justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
          <p className="text-sm text-slate-500 mt-2">
            Browse the full catalog and open any book to manage its status.
          </p>
        </div>
        <div>
          <form onSubmit={(e) => {setSearch(e.target.value)}} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search" // Provides a native clear 'x' button in some browsers
              placeholder="Search for a book..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className="flex h-full flex-col space-y-4 w-full">
        <div className="grid flex-1 h-full w-full content-start gap-4 grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 mt-4 rounded-md">
            <Button
              size="sm"
              onClick={handlePrevious}
              disabled={page === 0}
            >
              Previous
            </Button>

            <span className="text-xl font-bold tracking-tighter text-black">
              Page {page + 1} of {totalPages}
            </span>

            <Button
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