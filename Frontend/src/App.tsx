import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/Router";
import "./App.css";
import { ThemeProvider } from "@/Components/Theme/ThemeProvider";
import { ProfileProvider } from "@/Contexts/ProfileContext";
import { Toaster } from "@/Components/UI/Toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProfileProvider>
      <ThemeProvider defaultTheme="blue" defaultMode="dark" defaultRadius="75">
        <Router />
        <Toaster />
      </ThemeProvider>
    </ProfileProvider>
  </React.StrictMode>
);
