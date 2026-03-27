import type { FC } from "react";
import { Moon, Sun } from "lucide-react";

import { cn, useThemeEffect, useThemeStore } from "@/shared/lib";
import { Button } from "@/shared/ui";

type ThemeOption = "light" | "dark";

const THEME_OPTIONS: Array<{ value: ThemeOption; label: string; Icon: FC<{ className?: string }> }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

/**
 * Compact theme switch tabs for login footer.
 *
 * @returns Two-option segmented tabs for light/dark mode.
 */
export const LoginFormThemeTabs: FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  useThemeEffect();

  return (
    <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1">
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.value;
        const { Icon } = option;

        return (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded p-0",
              isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
            )}
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            aria-label={`Use ${option.label} theme`}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </Button>
        );
      })}
    </div>
  );
};
