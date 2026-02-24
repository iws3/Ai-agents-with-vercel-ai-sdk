/**
 * React Todo App - Main Component
 */

import React, { useState } from "react";
import { useTodos } from "./useTodos";
import type { Todo } from "./types";

export function TodoApp() {
  const {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
  } = useTodos();

  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("medium");

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue, priority);
      setInputValue("");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Ì≥ù My Todo App</h1>

      {/* Input */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          placeholder="Add a new todo..."
          style={{ flex: 1, padding: "8px" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Todo["priority"])}
          style={{ padding: "8px" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAddTodo} style={{ padding: "8px 16px" }}>
          Add
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              fontWeight: filter === f ? "bold" : "normal",
              backgroundColor: filter === f ? "#007bff" : "#f0f0f0",
              color: filter === f ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#f9f9f9",
              marginBottom: "8px",
              borderRadius: "4px",
              gap: "12px"
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1
              }}
            >
              {todo.title}
            </span>
            <span style={{ fontSize: "12px", color: "#666" }}>
              {todo.priority === "high"
                ? "Ì¥¥ High"
                : todo.priority === "medium"
                ? "Ìø° Medium"
                : "Ìø¢ Low"}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                padding: "4px 8px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>
          {filter === "completed" ? "No completed todos yet!" : "Add a todo to get started"}
        </p>
      )}
    </div>
  );
}
