import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./routes/app-layout";
import HomePage from "./routes/home";
import RegisterPage from "./routes/register";
import LoginPage from "./routes/login";
import BookListPage from "./routes/book-list";
import BookDetailPage from "./routes/book-detail";
import MyBookPage from "./routes/my-book.tsx";
import AdminBooksPage from "./routes/admin-books";
import AdminBookEditPage from "./routes/admin-book-edit";
import AdminCheckoutLogPage from "./routes/admin-checkout-log";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "book",
        Component: BookListPage,
      },
      {
        path: "book/:id",
        Component: BookDetailPage,
      },
      {
        path: "my-book",
        Component: MyBookPage,
      },
      {
        path: "admin/books",
        Component: AdminBooksPage,
      },
      {
        path: "admin/books/:id",
        Component: AdminBookEditPage,
      },
      {
        path: "admin/checkouts",
        Component: AdminCheckoutLogPage,
      },
    ],
  },
]);