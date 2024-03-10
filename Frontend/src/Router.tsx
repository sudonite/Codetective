import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "@/Routes/Landing";
import Login from "@/Routes/Login";
import Register from "@/Routes/Register";

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
]);

const Router = () => {
  return <RouterProvider router={routes} />;
};

export default Router;
