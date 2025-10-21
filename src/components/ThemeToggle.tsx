import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import inkIcon from "@/assets/ink-icon.png";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`h-7 w-7 ${theme === "light" ? "text-orange-500" : "text-muted-foreground hover:text-foreground"}`}
        title="Light mode"
      >
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("e-ink")}
        className={`h-7 w-7 ${theme === "e-ink" ? "text-orange-500" : "text-muted-foreground hover:text-foreground"}`}
        title="E-ink mode"
      >
        <img src={inkIcon} alt="E-ink" className="h-[1.1rem] w-[1.1rem]" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`h-7 w-7 ${theme === "dark" ? "text-orange-500" : "text-muted-foreground hover:text-foreground"}`}
        title="Dark mode"
      >
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      </Button>
      
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
