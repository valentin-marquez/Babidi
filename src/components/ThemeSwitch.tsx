import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useState("darken");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "darken" ? "light" : "darken";
      localStorage.setItem("theme", newTheme);
      const themeChangeEvent = new CustomEvent("themeChange", {
        detail: newTheme,
      });
      window.dispatchEvent(themeChangeEvent);
      return newTheme;
    });
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
