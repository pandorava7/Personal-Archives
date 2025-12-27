import React, { useEffect, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import SunIcon from "./icons/sun.svg?react";
import MoonIcon from "./icons/moon.svg?react";
import "./ThemeSwitcher.css";
import { useFlashMessage } from "../FlashMessageContext/FlashMessageContext";

type Theme = "light" | "dark";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const { addMessage } = useFlashMessage();

  // 初始化
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? "dark";
    setTheme(initial);

    document.documentElement.classList.toggle("theme-dark", initial === "dark");
    document.documentElement.classList.toggle("theme-light", initial === "light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);

    document.documentElement.classList.toggle("theme-dark", next === "dark");
    document.documentElement.classList.toggle("theme-light", next === "light");
  };

  return (
    <button
      className="theme-toggle-btn hover-bounce button"
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
        toggleTheme();
        addMessage({ text: "还没做这个功能嘞~", type: "warning" });
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <MoonIcon className="icon text-shadow moon" />
      ) : (
        <SunIcon className="icon text-shadow sun" />
      )}
    </button>
  );
};

export default ThemeToggle;
