import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./routes/landing-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    children: [

    ]
  },
]);