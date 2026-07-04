"use client";

import { useState, useEffect, useRef } from "react";

export function useElementResize<T extends HTMLElement>() {
  const elementRef = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Проверяем, что код выполняется в браузере и элемент существует
    if (typeof window === "undefined" || !elementRef.current) return;

    const currentElement = elementRef.current;

    // Создаем наблюдатель за изменением размеров
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;

      const entry = entries[0];
      // Используем borderBoxSize или fallback на contentRect
      const { width, height } = entry.contentRect;

      setSize({ width, height });
    });

    // Начинаем отслеживание
    resizeObserver.observe(currentElement);

    // Очищаем наблюдатель при размонтировании компонента
    return () => {
      resizeObserver.unobserve(currentElement);
    };
  }, []);

  return [elementRef, size] as const;
}
