import { useEffect } from "react";
import { useThemeStore } from "./theme-store";

export const useThemeEffect = (): void => {
  const theme = useThemeStore((s) => s.theme);
  const setResolvedTheme = useThemeStore((s) => s.setResolvedTheme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const resolve = (): "light" | "dark" => {
      if (theme === "dark") return "dark";
      if (theme === "light") return "light";
      if (media.matches) {
        return "dark";
      }
      return "light";
    };

    const apply = (): void => {
      const next = resolve();
      setResolvedTheme(next);
      root.classList.remove("light", "dark");
      root.classList.add(next);
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, setResolvedTheme]);
};

