import { create } from "zustand";
import type { TodoNode } from "~/types/todo";

interface TodoStore {
  todos: TodoNode[];
  isLoading: boolean;
  selectedTodo: TodoNode | null;
  isOpenTodoDetails: boolean;
  setTodos: (todos: TodoNode[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedTodo: (todo: TodoNode) => void;
  setTodoDetailsOpen: (isOpen: boolean) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: true,
  selectedTodo: null,
  isOpenTodoDetails: false,

  setTodos: (todos: TodoNode[]) => set({ todos }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSelectedTodo: (todo: TodoNode | null) => set({ selectedTodo: todo }),
  setTodoDetailsOpen: (isOpen: boolean) => set({ isOpenTodoDetails: isOpen }),

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
