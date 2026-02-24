# React Todo App - TypeScript Example

A fully typed React Todo application demonstrating best practices.

## Files

- **types.ts** - TypeScript interfaces for all data shapes
- **useTodos.ts** - Custom hook with type-safe todo management
- **App.tsx** - Main React component with full typing

## Key TypeScript Features Used

### 1. Discriminated Union Types
```typescript
type TodoFilter = "all" | "active" | "completed";
```
Each filter has a specific meaning, reducing errors.

### 2. Generic State Management
```typescript
const [state, setState] = useState<TodoState>({...});
```
State shape is defined and enforced.

### 3. Type-Safe Callbacks
```typescript
const toggleTodo = useCallback((id: number) => {
  // Only accepts a number
}, []);
```

### 4. React FC with Props
```typescript
export function TodoApp() {
  // Full type checking for component
}
```

## Running

```bash
# Install React
npm install react react-dom

# Add React types
npm install --save-dev @types/react @types/react-dom

# Run with your bundler (Vite, Create React App, etc.)
```

## Features

✅ Add todos with priority levels
✅ Mark todos as complete
✅ Delete todos
✅ Filter by status (all, active, completed)
✅ Fully type-safe with zero runtime errors possible from types

## Benefits of TypeScript Here

- Props are documented by types
- Hook return types are clear
- State updates are type-checked
- Event handlers have correct signatures
- IDE autocomplete works perfectly
- Refactoring updates all usages automatically
