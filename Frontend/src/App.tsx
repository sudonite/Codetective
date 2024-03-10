import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/Router";
import "./App.css";
import { ThemeProvider } from "@/Components/Theme/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="blue" defaultMode="dark" defaultRadius="75">
      <Router />
    </ThemeProvider>
  </React.StrictMode>
);
