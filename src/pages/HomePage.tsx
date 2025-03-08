import React, { useEffect, useState, useRef } from "react";
import { Collapse, Typography, List, Spin, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, Category } from "../utils/questionsLoader";
import { QuestionCircleOutlined, ReadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface FocusableItem {
  type: "category" | "question";
  categoryId: string;
  questionId?: string;
  index: number;
}

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<string | string[]>([]);
  const [focusedItem, setFocusedItem] = useState<FocusableItem | null>(null);
  const questionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const navigate = useNavigate();

  // Загрузка категорий
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setActiveKey([data[0].id]);
        // Установка фокуса на первую категорию по умолчанию
        setFocusedItem({
          type: "category",
          categoryId: data[0].id,
          index: 0
        });
      }
      setLoading(false);
    };

    loadCategories();
  }, []);

  // Обработчик навигации с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedItem || categories.length === 0) return;

      const currentCategoryIndex = categories.findIndex(
        (c) => c.id === focusedItem.categoryId
      );
      if (currentCategoryIndex === -1) return;

      const currentCategory = categories[currentCategoryIndex];

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (focusedItem.type === "question" && focusedItem.index > 0) {
            // Перемещение к предыдущему вопросу в категории
            setFocusedItem({
              ...focusedItem,
              questionId: currentCategory.questions[focusedItem.index - 1].id,
              index: focusedItem.index - 1
            });
          } else if (
            focusedItem.type === "question" &&
            focusedItem.index === 0
          ) {
            // Перемещение от первого вопроса к предыдущей категории
            if (currentCategoryIndex > 0) {
              const prevCategoryIndex = currentCategoryIndex - 1;
              const prevCategory = categories[prevCategoryIndex];
              // Открыть предыдущую категорию и выбрать её последний вопрос
              if (prevCategory.questions.length > 0) {
                const lastQuestionIndex = prevCategory.questions.length - 1;
                setActiveKey([prevCategory.id]);
                setFocusedItem({
                  type: "question",
                  categoryId: prevCategory.id,
                  questionId: prevCategory.questions[lastQuestionIndex].id,
                  index: lastQuestionIndex
                });
              } else {
                // Если в предыдущей категории нет вопросов, выбираем её заголовок
                setActiveKey([prevCategory.id]);
                setFocusedItem({
                  type: "category",
                  categoryId: prevCategory.id,
                  index: prevCategoryIndex
                });
              }
            } else {
              // Если это первая категория, перейти к её заголовку
              setFocusedItem({
                type: "category",
                categoryId: currentCategory.id,
                index: currentCategoryIndex
              });
            }
          } else if (
            focusedItem.type === "category" &&
            currentCategoryIndex > 0
          ) {
            // Перемещение к предыдущей категории
            const prevCategoryIndex = currentCategoryIndex - 1;
            const prevCategory = categories[prevCategoryIndex];
            setFocusedItem({
              type: "category",
              categoryId: prevCategory.id,
              index: prevCategoryIndex
            });
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (focusedItem.type === "category") {
            // Если это заголовок категории
            setActiveKey([currentCategory.id]); // Раскрыть категорию

            if (currentCategory.questions.length > 0) {
              // Перейти к первому вопросу, если есть вопросы
              setFocusedItem({
                type: "question",
                categoryId: currentCategory.id,
                questionId: currentCategory.questions[0].id,
                index: 0
              });
            } else if (currentCategoryIndex < categories.length - 1) {
              // Если вопросов нет, перейти к следующей категории
              const nextCategoryIndex = currentCategoryIndex + 1;
              const nextCategory = categories[nextCategoryIndex];
              setFocusedItem({
                type: "category",
                categoryId: nextCategory.id,
                index: nextCategoryIndex
              });
            }
          } else if (focusedItem.type === "question") {
            // Если это вопрос
            if (focusedItem.index < currentCategory.questions.length - 1) {
              // Перейти к следующему вопросу в текущей категории
              setFocusedItem({
                ...focusedItem,
                questionId: currentCategory.questions[focusedItem.index + 1].id,
                index: focusedItem.index + 1
              });
            } else if (currentCategoryIndex < categories.length - 1) {
              // Если достигнут конец списка вопросов, перейти к следующей категории
              const nextCategoryIndex = currentCategoryIndex + 1;
              const nextCategory = categories[nextCategoryIndex];
              setActiveKey([nextCategory.id]); // Раскрыть следующую категорию

              if (nextCategory.questions.length > 0) {
                // Выбрать первый вопрос следующей категории
                setFocusedItem({
                  type: "question",
                  categoryId: nextCategory.id,
                  questionId: nextCategory.questions[0].id,
                  index: 0
                });
              } else {
                // Если в следующей категории нет вопросов, выбрать её заголовок
                setFocusedItem({
                  type: "category",
                  categoryId: nextCategory.id,
                  index: nextCategoryIndex
                });
              }
            }
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (focusedItem.type === "category") {
            // Открыть категорию
            setActiveKey([currentCategory.id]);

            // Если в категории есть вопросы, перейти к первому
            if (currentCategory.questions.length > 0) {
              setFocusedItem({
                type: "question",
                categoryId: currentCategory.id,
                questionId: currentCategory.questions[0].id,
                index: 0
              });
            }
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (focusedItem.type === "question") {
            // Переместиться от вопроса к категории
            setFocusedItem({
              type: "category",
              categoryId: currentCategory.id,
              index: currentCategoryIndex
            });
          } else if (focusedItem.type === "category") {
            // Закрыть категорию
            setActiveKey([]);
          }
          break;

        case "Enter":
          if (focusedItem.type === "question" && focusedItem.questionId) {
            // Открыть вопрос в новой вкладке
            e.preventDefault();
            window.open(
              `/category/${focusedItem.categoryId}/question/${focusedItem.questionId}`,
              "_blank"
            );
          } else if (focusedItem.type === "category") {
            // Открыть/закрыть категорию
            e.preventDefault();
            const isActive = Array.isArray(activeKey)
              ? activeKey.includes(currentCategory.id)
              : activeKey === currentCategory.id;

            setActiveKey(isActive ? [] : [currentCategory.id]);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedItem, activeKey, categories, navigate]);

  // Сохранение референсов на элементы вопросов для скролла
  useEffect(() => {
    if (
      focusedItem &&
      focusedItem.type === "question" &&
      focusedItem.questionId
    ) {
      const element = questionRefs.current.get(
        `${focusedItem.categoryId}-${focusedItem.questionId}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [focusedItem]);

  const onCategoryClick = (categoryId: string) => {
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);
    if (categoryIndex !== -1) {
      setFocusedItem({
        type: "category",
        categoryId,
        index: categoryIndex
      });
    }
  };

  const onQuestionClick = (
    categoryId: string,
    questionId: string,
    index: number
  ) => {
    setFocusedItem({
      type: "question",
      categoryId,
      questionId,
      index
    });
  };

  const isCategoryFocused = (categoryId: string) => {
    return (
      focusedItem?.type === "category" && focusedItem.categoryId === categoryId
    );
  };

  const isQuestionFocused = (categoryId: string, questionId: string) => {
    return (
      focusedItem?.type === "question" &&
      focusedItem.categoryId === categoryId &&
      focusedItem.questionId === questionId
    );
  };

  return (
    <div>
      <Paragraph>
        Этот справочник содержит подборку вопросов и ответов, часто
        встречающихся на собеседованиях для позиции Frontend разработчика.
        Вопросы разделены по категориям для удобства навигации.
      </Paragraph>

      <div className="keyboard-navigation-help">
        <strong>Навигация:</strong> используйте клавиши стрелок для перемещения,
        Enter для открытия вопроса в новой вкладке
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
        >
          {categories.map((category) => (
            <Panel
              key={category.id}
              header={
                <div
                  className={`category-header ${
                    isCategoryFocused(category.id) ? "focused-item" : ""
                  }`}
                  onClick={() => onCategoryClick(category.id)}
                  tabIndex={0}
                >
                  <Space>
                    <ReadOutlined />
                    <span style={{ fontWeight: "bold" }}>{category.name}</span>
                    <span>({category.questions.length} вопросов)</span>
                  </Space>
                </div>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={category.questions}
                renderItem={(question, index) => (
                  <List.Item
                    className={
                      isQuestionFocused(category.id, question.id)
                        ? "focused-item"
                        : ""
                    }
                    ref={(el) => {
                      if (el) {
                        questionRefs.current.set(
                          `${category.id}-${question.id}`,
                          el
                        );
                      }
                    }}
                    onClick={() =>
                      onQuestionClick(category.id, question.id, index)
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <QuestionCircleOutlined style={{ fontSize: "18px" }} />
                      }
                      title={
                        <Link
                          to={`/category/${category.id}/question/${question.id}`}
                        >
                          {question.title}
                        </Link>
                      }
                      description={`Вопрос ${question.id.replace("q_", "№")}`}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default HomePage;
