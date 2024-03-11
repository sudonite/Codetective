import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "@/Routes/Landing";
import Login from "@/Routes/Login";
import Register from "@/Routes/Register";
import Dashboard from "./Routes/Dashboard";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

const Router = () => {
  return <RouterProvider router={routes} />;
};

export default Router;
