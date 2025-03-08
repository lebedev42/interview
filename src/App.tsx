import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import QuestionPage from "./pages/QuestionPage";
import NotFoundPage from "./pages/NotFoundPage";
import { SyntaxThemeProvider, useSyntaxTheme } from "./contexts/ThemeContext";
import "antd/dist/reset.css";
import "./styles/global.css";

// Компонент обертка для применения темы
const ThemedApp: React.FC = () => {
  const { isDarkMode } = useSyntaxTheme();
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm
      }}
    >
      <Layout className="site-layout">
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/category/:categoryId/question/:questionId"
              element={<QuestionPage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </Layout>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <SyntaxThemeProvider>
      <ThemedApp />
    </SyntaxThemeProvider>
  );
};

export default App;
