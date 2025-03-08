import React, { createContext, useContext, useState, useEffect } from "react";
import * as prismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

// Определение типов для темы подсветки кода
type ThemeNames = keyof typeof prismStyles;
type AppThemeMode = "light" | "dark";

// Интерфейс контекста
type ThemeContextType = {
  // Для подсветки кода
  currentTheme: any;
  themeName: ThemeNames;
  setThemeName: (name: ThemeNames) => void;
  availableThemes: ThemeNames[];

  // Для темы приложения
  appTheme: AppThemeMode;
  toggleAppTheme: () => void;
  isDarkMode: boolean;
};

// Значения по умолчанию
const defaultCodeTheme: ThemeNames = "oneLight";
const availableThemes: ThemeNames[] = Object.keys(prismStyles) as ThemeNames[];
const defaultAppTheme: AppThemeMode = "light";

// Создаем контекст
const ThemeContext = createContext<ThemeContextType>({
  currentTheme: prismStyles[defaultCodeTheme],
  themeName: defaultCodeTheme,
  setThemeName: () => {},
  availableThemes: availableThemes,

  appTheme: defaultAppTheme,
  toggleAppTheme: () => {},
  isDarkMode: false
});

// Хук для использования контекста
export const useSyntaxTheme = () => useContext(ThemeContext);

// Провайдер контекста
export const SyntaxThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Тема подсветки кода
  const [themeName, setThemeName] = useState<ThemeNames>(() => {
    const savedTheme = localStorage.getItem("syntaxTheme");
    return savedTheme && availableThemes.includes(savedTheme as ThemeNames)
      ? (savedTheme as ThemeNames)
      : defaultCodeTheme;
  });

  // Тема приложения
  const [appTheme, setAppTheme] = useState<AppThemeMode>(() => {
    const savedAppTheme = localStorage.getItem("appTheme");
    return savedAppTheme === "dark" || savedAppTheme === "light"
      ? (savedAppTheme as AppThemeMode)
      : defaultAppTheme;
  });

  const isDarkMode = appTheme === "dark";
  const currentTheme = prismStyles[themeName];

  // Функция переключения темы приложения
  const toggleAppTheme = () => {
    setAppTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Сохраняем темы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("syntaxTheme", themeName);
    localStorage.setItem("appTheme", appTheme);
  }, [themeName, appTheme]);

  // Применяем стили к body документа при изменении темы
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#141414" : "#f0f2f5";
    document.body.style.color = isDarkMode
      ? "rgba(255, 255, 255, 0.85)"
      : "rgba(0, 0, 0, 0.85)";
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);

  // Создаем значение контекста
  const contextValue: ThemeContextType = {
    currentTheme,
    themeName,
    setThemeName,
    availableThemes,
    appTheme,
    toggleAppTheme,
    isDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
