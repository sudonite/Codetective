import { useLocation, Link } from "react-router-dom";

import { cn } from "@/Utils";
import { buttonVariants } from "@/Components/UI/Button";

const navbarItems = [
  { section: "Profile", href: "/settings/profile" },
  { section: "Subscription", href: "/settings/subscription" },
  { section: "Git Accounts", href: "/settings/git" },
  { section: "Third Party Apps", href: "/settings/apps" },
];

const SideNavbar = () => {
  const location = useLocation();
  return (
    <nav className="flex flex-col space-y-1">
      {navbarItems.map(item => (
        <Link
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            location.pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "flex justify-start text-md font-medium leading-none cursor-pointer"
          )}
        >
          {item.section}
        </Link>
      ))}
      <Link
        to="/dashboard"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "hover:bg-transparent hover:underline flex justify-start text-md font-medium leading-none cursor-pointer"
        )}
      >
        Go Back
      </Link>
    </nav>
  );
};

export default SideNavbar;
