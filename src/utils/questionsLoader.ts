// Этот модуль будет импортировать все MD файлы из директории questions с помощью Vite

export interface Question {
  id: string;
  title: string;
  content: string;
  path: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

// Используем Vite import.meta.glob для импорта всех .md файлов
const mdFiles = import.meta.glob("/questions/**/*.md", {
  as: "raw",
  eager: true
});

// Извлекает заголовок из содержимого markdown
function extractTitle(content: string): string {
  const titleMatch = content.match(/^# (.+)$/m);
  return titleMatch ? titleMatch[1] : "Без заголовка";
}

// Получает все категории (директории) из папки questions
export async function getCategories(): Promise<Category[]> {
  const categoriesMap = new Map<string, Category>();

  try {
    // Обрабатываем все пути к MD файлам
    for (const path in mdFiles) {
      const content = mdFiles[path] as string;

      // Извлекаем categoryId и questionId из пути
      // формат пути: /questions/categoryId/questionId.md
      const pathParts = path.split("/");
      const categoryId = pathParts[2];
      const fileName = pathParts[3];
      // Убираем расширение .md
      const questionId = fileName.replace(".md", "");

      // Создаем категорию, если ее еще нет
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          questions: []
        });
      }

      // Добавляем вопрос в категорию
      const title = extractTitle(content);
      const category = categoriesMap.get(categoryId);

      if (category) {
        category.questions.push({
          id: questionId,
          title,
          content,
          path,
          categoryId
        });
      }
    }

    // Возвращаем категории как массив
    return Array.from(categoriesMap.values());
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    return [];
  }
}

// Получает все вопросы для определенной категории
export async function getQuestionsByCategory(
  categoryId: string
): Promise<Question[]> {
  try {
    const categories = await getCategories();
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.questions : [];
  } catch (error) {
    console.error(
      `Ошибка при загрузке вопросов для категории ${categoryId}:`,
      error
    );
    return [];
  }
}

// Получает конкретный вопрос по категории и ID
export async function getQuestion(
  categoryId: string,
  questionId: string
): Promise<Question | null> {
  try {
    const questions = await getQuestionsByCategory(categoryId);
    const question = questions.find((q) => q.id === questionId);
    return question || null;
  } catch (error) {
    console.error(
      `Ошибка при загрузке вопроса ${questionId} в категории ${categoryId}:`,
      error
    );
    return null;
  }
}
