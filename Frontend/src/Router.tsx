import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Landing from "@/Routes/Landing";
import Login from "@/Routes/Login";
import Register from "@/Routes/Register";
import Dashboard from "@/Routes/Dashboard";
import Settings from "@/Routes/Settings";

import AppsSection from "@/Components/Settings/AppsSection";
import GitSection from "@/Components/Settings/GitSection";
import ProfileSection from "@/Components/Settings/ProfileSection";
import SubscriptionSection from "@/Components/Settings/SubscriptionSection";

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
  {
    path: "/settings",
    element: <Settings />,
    children: [
      {
        path: "profile",
        element: <ProfileSection />,
      },
      {
        path: "subscription",
        element: <SubscriptionSection />,
      },
      {
        path: "git",
        element: <GitSection />,
      },
      {
        path: "apps",
        element: <AppsSection />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={routes} />;
};

export default Router;
