import { create } from "zustand";
import type { TodoNode } from "~/types/todo";

interface TodoStore {
  todos: TodoNode[];
  isLoading: boolean;
  setTodos: (todos: TodoNode[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: true,

  setTodos: (todos: TodoNode[]) => set({ todos }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),

  updateTodo: (id, title) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  clearCompleted: () =>
    set((state) => ({
      todos: state.todos.filter((t) => !t.completed),
    })),
}));
