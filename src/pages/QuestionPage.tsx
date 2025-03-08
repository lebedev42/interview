import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Breadcrumb, Card, Button, Spin } from "antd";
import { HomeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useSyntaxTheme } from "../contexts/ThemeContext";

import {
  getQuestion,
  getQuestionsByCategory,
  Question
} from "../utils/questionsLoader";

const { Title } = Typography;

const QuestionPage: React.FC = () => {
  const { categoryId, questionId } = useParams<{
    categoryId: string;
    questionId: string;
  }>();
  const [question, setQuestion] = React.useState<Question | null>(null);
  const [categoryQuestions, setCategoryQuestions] = React.useState<Question[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { currentTheme } = useSyntaxTheme();

  React.useEffect(() => {
    const loadQuestion = async () => {
      if (!categoryId || !questionId) {
        navigate("/");
        return;
      }

      setLoading(true);
      const questionData = await getQuestion(categoryId, questionId);
      setQuestion(questionData);

      // Загружаем все вопросы категории для навигации
      const questions = await getQuestionsByCategory(categoryId);
      setCategoryQuestions(questions);

      setLoading(false);
    };

    loadQuestion();
  }, [categoryId, questionId, navigate]);

  // Функция для перехода к следующему или предыдущему вопросу
  const navigateToQuestion = (direction: "prev" | "next") => {
    if (!categoryId || !questionId || categoryQuestions.length === 0) return;

    const currentIndex = categoryQuestions.findIndex(
      (q) => q.id === questionId
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : categoryQuestions.length - 1;
    } else {
      newIndex =
        currentIndex < categoryQuestions.length - 1 ? currentIndex + 1 : 0;
    }

    navigate(
      `/category/${categoryId}/question/${categoryQuestions[newIndex].id}`
    );
  };

  const categoryName = categoryId
    ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
    : "";

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Главная
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
        <Breadcrumb.Item>{question?.title || "Загрузка..."}</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin size="large" />
        </div>
      ) : question ? (
        <Card>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                code: ({
                  node,
                  inline,
                  className,
                  children,
                  ...props
                }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={currentTheme}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {question.content}
            </ReactMarkdown>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20
            }}
          >
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() => navigateToQuestion("prev")}
            >
              Предыдущий вопрос
            </Button>
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={() => navigateToQuestion("next")}
            >
              Следующий вопрос
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Title level={3}>Вопрос не найден</Title>
          <p>Запрашиваемый вопрос не существует или был удален.</p>
          <Button type="primary">
            <Link to="/">Вернуться на главную</Link>
          </Button>
        </Card>
      )}
    </>
  );
};

export default QuestionPage;
