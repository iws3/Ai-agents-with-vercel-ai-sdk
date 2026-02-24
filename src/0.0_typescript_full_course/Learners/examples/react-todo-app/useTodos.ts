/**
 * Custom React Hook for Todo Management
 */

import { useState, useCallback } from "react";
import type { Todo, TodoState, TodoFilter } from "./types";

export function useTodos() {
  const [state, setState] = useState<TodoState>({
    todos: [],
    filter: "all",
    loading: false
  });

  // Add todo
  const addTodo = useCallback((title: string, priority: Todo["priority"] = "medium") => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      priority
    };
    setState((prev) => ({
      ...prev,
      todos: [...prev.todos, newTodo]
    }));
  }, []);

  // Toggle todo
  const toggleTodo = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  }, []);

  // Delete todo
  const deleteTodo = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      todos: prev.todos.filter((todo) => todo.id !== id)
    }));
  }, []);

  // Set filter
  const setFilter = useCallback((filter: TodoFilter) => {
    setState((prev) => ({ ...prev, filter }));
  }, []);

  // Get filtered todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  return {
    todos: filteredTodos,
    allTodos: state.todos,
    filter: state.filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
  };
}
