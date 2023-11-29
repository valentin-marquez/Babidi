// ThemeSwitch.tsx
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "darken";
    }
    return "darken";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.querySelector("html")?.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      // Dispatch themeChange event
      const event = new CustomEvent("themeChange", { detail: theme });
      window.dispatchEvent(event);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "darken" ? "light" : "darken"));
  };

  return (
    <label className="flex cursor-pointer gap-2">
      <Moon />
      <input
        type="checkbox"
        className="theme-controller toggle"
        value={theme}
        id="themeToggle"
        checked={theme === "light"}
        onChange={toggleTheme}
      />
      <Sun />
    </label>
  );
};

export default ThemeSwitch;
