import { HashLink as Link } from "react-router-hash-link";

import {
  FaHouse,
  FaStar,
  FaCoins,
  FaQuestion,
  FaRocket,
  FaPalette,
} from "react-icons/fa6";

import { Button } from "@/Components/UI/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/Components/UI/DropdownMenu";

import ThemeChanger from "@/Components/Theme/ThemeChanger";

const Navbar = () => {
  return (
    <div className="flex h-20">
      <div className="flex items-end pl-20 w-3/12">
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Codetective
        </h3>
      </div>
      <div className="w-6/12 flex items-end justify-center gap-x-2">
        <Button variant="ghost" asChild>
          <Link smooth to="/#home">
            <FaHouse className="w-4 h-4 mr-2" />
            Home
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link smooth to="/#features">
            <FaStar className="w-4 h-4 mr-2" />
            Features
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link smooth to="/#pricing">
            <FaCoins className="w-4 h-4 mr-2" />
            Pricing
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link smooth to="/#faq">
            <FaQuestion className="w-4 h-4 mr-2" />
            FAQ
          </Link>
        </Button>
      </div>
      <div className="w-3/12 flex items-end justify-end pr-20 gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <FaPalette className="mr-2 h-4 w-4 inline-block" />
              Themes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="p-6 w-96">
            <ThemeChanger />
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" asChild>
          <Link to="/auth/login">
            <FaRocket className="w-4 h-4 mr-2" />
            Get started
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
