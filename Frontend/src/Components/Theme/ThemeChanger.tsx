import { Button } from "@/Components/UI/Button";
import { Label } from "@/Components/UI/Label";

import { cn, capitalizeFirstLetter } from "@/Utils";

import { FaArrowLeft, FaCheck, FaSun, FaMoon } from "react-icons/fa6";

import { useTheme, Radius } from "@/Components/Theme/ThemeProvider";
import { themes } from "@/Consts";

const ThemeChanger = () => {
  const { theme, setTheme, mode, setMode, radius, setRadius } = useTheme();
  return (
    <>
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Customize
          </div>
          <div className="text-xs text-muted-foreground">
            Pick a style and color for your components.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setTheme("blue");
            setMode("dark");
            setRadius("75");
          }}
        >
          <FaArrowLeft />
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Color</Label>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(t => {
            const isActive = theme === t.name;

            return (
              <Button
                variant={"outline"}
                size="sm"
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={cn(
                  "justify-start",
                  isActive && "border-2 border-primary"
                )}
                style={
                  {
                    "--theme-primary": `hsl(${
                      t?.activeColor[mode === "dark" ? "dark" : "light"]
                    })`,
                  } as React.CSSProperties
                }
              >
                <span
                  className={cn(
                    "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                  )}
                >
                  {isActive && <FaCheck className="h-4 w-4 text-white" />}
                </span>
                {capitalizeFirstLetter(t.name)}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Radius</Label>
        <div className="grid grid-cols-5 gap-2">
          {(["0", "30", "50", "75", "100"] as Radius[]).map(value => {
            return (
              <Button
                variant={"outline"}
                size="sm"
                key={value}
                onClick={() => setRadius(value)}
                className={cn(radius === value && "border-2 border-primary")}
              >
                {parseInt(value) / 100}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Mode</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setMode("light")}
            className={cn(mode === "light" && "border-2 border-primary")}
          >
            <FaSun className="mr-1 -translate-x-1" />
            Light
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => setMode("dark")}
            className={cn(mode === "dark" && "border-2 border-primary")}
          >
            <FaMoon className="mr-1 -translate-x-1" />
            Dark
          </Button>
        </div>
      </div>
    </>
  );
};

export default ThemeChanger;
