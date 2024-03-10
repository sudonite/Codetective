import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "@/Routes/Landing";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
]);

const Router = () => {
  return <RouterProvider router={routes} />;
};

export default Router;
