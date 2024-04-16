import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/Router";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/Components/UI/ContextMenu";

import "./App.css";
import { ThemeProvider } from "@/Components/Theme/ThemeProvider";
import { ProfileProvider } from "@/Contexts/ProfileContext";
import { Toaster } from "@/Components/UI/Toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProfileProvider>
      <ThemeProvider defaultTheme="blue" defaultMode="dark" defaultRadius="75">
        <ContextMenu>
          <ContextMenuTrigger>
            <Router />
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>No options available</ContextMenuLabel>
          </ContextMenuContent>
        </ContextMenu>
        <Toaster />
      </ThemeProvider>
    </ProfileProvider>
  </React.StrictMode>
);
