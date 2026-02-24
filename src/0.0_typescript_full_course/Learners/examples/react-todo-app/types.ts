/**
 * React Todo App - Type Definitions
 */

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
}

export interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  loading: boolean;
}

export type TodoFilter = TodoState["filter"];
