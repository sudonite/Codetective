import { useEffect } from "react";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { GetProfileAPI } from "@/API";
import { useProfile } from "./Contexts/ProfileContext";

import Landing from "@/Routes/Landing";
import Login from "@/Routes/Login";
import Register from "@/Routes/Register";
import Dashboard from "@/Routes/Dashboard";
import Settings from "@/Routes/Settings";

import AppsSection from "@/Components/Settings/AppsSection";
import GitSection from "@/Components/Settings/GitSection";
import ProfileSection from "@/Components/Settings/ProfileSection";
import SubscriptionSection from "@/Components/Settings/SubscriptionSection";

const Protector = () => {
  const { setProfile } = useProfile();
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      window.location.href = "/";
    }

    (async () => {
      const response = await GetProfileAPI();
      if (response.status === 200) {
        setProfile(response.data);
      }
    })();
  }, []);
  return <Outlet />;
};

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
    path: "/",
    element: <Protector />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
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
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={routes} />;
};

export default Router;
