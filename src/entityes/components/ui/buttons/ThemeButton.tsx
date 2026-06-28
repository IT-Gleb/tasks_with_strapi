"use client";

import { ToggleButton } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";

const ThemeButton = () => {
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();

  const callBackTheme = useCallback(() => {
    isToggle
      ? theme === "light"
        ? setTheme("dark")
        : setTheme("light")
      : theme === "dark"
        ? setTheme("light")
        : setTheme("dark");
  }, [isToggle]);

  return (
    <ToggleButton
      isIconOnly
      size="md"
      isSelected={isToggle}
      onChange={setIsToggle}
      onClick={callBackTheme}
      className="transition-colors duration-100 bg-segment dark:text-default-foreground dark:bg-black"
    >
      {isToggle ? (
        <Moon size={20} color="currentColor" />
      ) : (
        <Sun size={20} color="currentColor" />
      )}
    </ToggleButton>
  );
};

export default ThemeButton;
