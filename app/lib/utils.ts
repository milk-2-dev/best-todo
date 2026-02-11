// app/lib/utils.ts

import { format, isToday, isFuture, isPast, parseISO } from "date-fns";
import type { Status, Priority, Todo } from "~/types/todo";

/**
 * Определяет статус задачи на основе dueDate
 */
export function determineStatus(dueDate?: string): Status {
  if (!dueDate) return "backlog";

  const date = parseISO(dueDate);

  if (isToday(date)) return "today";
  if (isFuture(date)) return "upcoming";
  if (isPast(date)) return "backlog";

  return "backlog";
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "MMM dd, yyyy");
}

/**
 * Возвращает цвет для приоритета
 */
export function getPriorityColor(priority: Priority): string {
  const colors = {
    low: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };
  return colors[priority];
}

/**
 * Возвращает лейбл для приоритета
 */
export function getPriorityLabel(priority: Priority): string {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return labels[priority];
}

/**
 * Рекурсивно рассчитывает прогресс выполнения задачи
 */
export function calculateProgress(todo: Todo): number {
  if (!todo.subtasks || todo.subtasks.length === 0) {
    return todo.status === "completed" ? 100 : 0;
  }

  const totalSubtasks = todo.subtasks.length;
  const completedSubtasks = todo.subtasks.filter(
    (subtask) => subtask.status === "completed"
  ).length;

  return Math.round((completedSubtasks / totalSubtasks) * 100);
}

/**
 * Проверяет, просрочена ли задача
 */
export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  const date = parseISO(dueDate);
  return isPast(date) && !isToday(date);
}

/**
 * Сортирует задачи по order
 */
export function sortTodosByOrder(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => a.order - b.order);
}

/**
 * Классы для анимации drag and drop
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
