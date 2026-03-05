import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./routes/landing-page";
import Register from "./routes/register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/register",
    Component: Register
  }
]);