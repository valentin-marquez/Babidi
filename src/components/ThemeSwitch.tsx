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
    <li className="group">
      <label className="flex cursor-pointer gap-2 ">
        <Moon
          className={`transition-all ${
            theme === "darken" ? "group-hover:stroke-primary" : ""
          }`}
        />
        <input
          type="checkbox"
          className="theme-controller toggle"
          value={theme}
          id="themeToggle"
          checked={theme === "light"}
          onChange={toggleTheme}
        />
        <Sun
          className={`transition-all ${
            theme === "light" ? "group-hover:stroke-primary" : ""
          }`}
        />
      </label>
    </li>
  );
};
export default ThemeSwitch;
