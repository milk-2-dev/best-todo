import type { Todo, TodoNode } from "~/types/todo";


export function buildTodoTree(todos: Todo[]): TodoNode[] {
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
  todos: Todo[],
  parentId: string | null
): Todo[] {
  return todos.filter((todo) => todo.parentId === parentId);
}

export function getAllSubtasks(todos: Todo[], todoId: string): Todo[] {
  const directSubtasks = todos.filter((todo) => todo.parentId === todoId);
  const allSubtasks = [...directSubtasks];

  directSubtasks.forEach((subtask) => {
    allSubtasks.push(...getAllSubtasks(todos, subtask.$id));
  });

  return allSubtasks;
}


export function countAllSubtasks(todos: Todo[], todoId: string): number {
  return getAllSubtasks(todos, todoId).length;
}

export function countCompletedSubtasks(todos: Todo[], todoId: string): number {
  const allSubtasks = getAllSubtasks(todos, todoId);
  return allSubtasks.filter((task) => task.status === "completed").length;
}

export function isAncestor(
  todos: Todo[],
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

export function getTodoBreadcrumbs(todos: Todo[], todoId: string): Todo[] {
  const breadcrumbs: Todo[] = [];
  let currentId: string | null = todoId;

  while (currentId) {
    const current = todos.find((t) => t.$id === currentId);
    if (!current) break;

    breadcrumbs.unshift(current);
    currentId = current.parentId;
  }

  return breadcrumbs;
}