import { create } from "zustand";
import type { TodoNode } from "~/types/todo";

interface TodoStore {
  todos: TodoNode[];
  isLoading: boolean;
  selectedTodo: TodoNode | null;
  formData: TodoNode | null;
  isOpenTodoDetails: boolean;
  isOpenTodoForm: boolean;
  setTodos: (todos: TodoNode[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedTodo: (todo: TodoNode | null) => void;
  setFormData: (todo: TodoNode | null) => void;
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
  formData: null,
  isOpenTodoDetails: false,
  isOpenTodoForm: false,

  setTodos: (todos: TodoNode[]) => set({ todos }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSelectedTodo: (todo: TodoNode | null) => set({ selectedTodo: todo }),
  setFormData: (todo: TodoNode | null) => set({ formData: todo }),
  setTodoDetailsOpen: (isOpen: boolean) => set({ isOpenTodoDetails: isOpen }),

  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.$id !== id),
    })),

  toggleTodo: (id) => {
    const toggleRecursive = (todos, depth = 0) => {
      if (depth > 4) return todos;

      return todos.map((t) => {
        if (t.$id === id) {
          return {
            ...t,
            completed: !t.completed,
          };
        }

        if (t.subtasks && t.subtasks.length > 0) {
          return {
            ...t,
            subtasks: toggleRecursive(t.subtasks, depth + 1),
          };
        }

        return t;
      });
    };

    set((state) => ({
      todos: toggleRecursive(state.todos),
    }));
  },

  updateTodo: (id, title) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  clearCompleted: () =>
    set((state) => ({
      todos: state.todos.filter((t) => !t.completed),
    })),
}));
