import type { Book } from "@/routes/book-list";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function BookCard({ book }: { book: Book }) {
    return (
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
                <Button asChild className="w-full">
                    <Link to={`/book/${book.id}`}>View details</Link>
                </Button>
            </div>
        </div>
    )
}