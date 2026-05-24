"use client";

import { ThemeProvider } from "next-themes";

export default function ThisThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
