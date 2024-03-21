import { Outlet } from "react-router-dom";

import SideNavbar from "@/Components/Settings/SideNavbar";
import { Separator } from "@/Components/UI/Separator";

const Settings = () => {
  return (
    <div className="h-screen w-screen p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and connect with external services.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-row space-x-12">
        <aside className="w-1/5">
          <SideNavbar />
        </aside>
        <main className="flex-1 max-w-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Settings;
