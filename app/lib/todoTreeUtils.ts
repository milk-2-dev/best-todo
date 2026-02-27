import type { Todos } from "~/types/appwrite";
import type { TodoNode } from "~/types/todo";


export function buildTodoTree(todos: Todos[]): TodoNode[] {
  const todoMap = new Map<string, TodoNode>();
  
  todos.forEach((todo) => {
    todoMap.set(todo.$id, { ...todo, subtasks: [] });
  });

  const rootTodos: TodoNode[] = [];

  todos.forEach((todo) => {
    const node = todoMap.get(todo.$id);
    if (!node) return;

    if (todo.parentId) {
      const parent = todoMap.get(todo.parentId);
      if (parent) {
        parent.subtasks.push(node);
      } else {
        rootTodos.push(node);
      }
    } else {
      rootTodos.push(node);
    }
  });

  return rootTodos;
}

export function getTodosByParent(
  todos: Todos[],
  parentId: string | null
): Todos[] {
  return todos.filter((todo) => todo.parentId === parentId);
}

export function getAllSubtasks(todos: Todos[], todoId: string): Todos[] {
  const directSubtasks = todos.filter((todo) => todo.parentId === todoId);
  const allSubtasks = [...directSubtasks];

  directSubtasks.forEach((subtask) => {
    allSubtasks.push(...getAllSubtasks(todos, subtask.$id));
  });

  return allSubtasks;
}


export function countAllSubtasks(todos: Todos[], todoId: string): number {
  return getAllSubtasks(todos, todoId).length;
}

export function countCompletedSubtasks(todos: Todos[], todoId: string): number {
  const allSubtasks = getAllSubtasks(todos, todoId);
  return allSubtasks.filter((task) => task.status === "completed").length;
}

export function isAncestor(
  todos: Todos[],
  possibleParentId: string,
  childId: string
): boolean {
  let currentId: string | null = childId;
  
  while (currentId) {
    const current = todos.find((t) => t.$id === currentId);
    if (!current) break;
    
    if (current.parentId === possibleParentId) {
      return true;
    }
    
    currentId = current.parentId;
  }
  
  return false;
}

export function getTodoBreadcrumbs(todos: Todos[], todoId: string): Todos[] {
  const breadcrumbs: Todos[] = [];
  let currentId: string | null = todoId;

  while (currentId) {
    const current = todos.find((t) => t.$id === currentId);
    if (!current) break;

    breadcrumbs.unshift(current);
    currentId = current.parentId;
  }

  return breadcrumbs;
}