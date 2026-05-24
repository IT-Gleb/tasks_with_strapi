"use client";

import { ToggleButton } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";

const ThemeButton = () => {
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const { setTheme } = useTheme();

  const callBackTheme = useCallback(() => {
    isToggle ? setTheme("dark") : setTheme("light");
  }, [isToggle]);

  return (
    <ToggleButton
      isIconOnly
      size="md"
      isSelected={isToggle}
      onChange={setIsToggle}
      onClick={callBackTheme}
      className="transition-colors duration-100 bg-segment dark:text-default-foreground dark:bg-default-hover"
    >
      {isToggle ? (
        <Sun size={20} color="currentColor" />
      ) : (
        <Moon size={20} color="currentColor" />
      )}
    </ToggleButton>
  );
};

export default ThemeButton;
