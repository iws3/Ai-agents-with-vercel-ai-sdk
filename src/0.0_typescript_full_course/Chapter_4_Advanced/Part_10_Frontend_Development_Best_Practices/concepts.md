# Part 10: Frontend Development Best Practices (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- React with TypeScript
- Type-safe state management
- Component patterns
- Form handling with types
- Custom hooks and generics
- Performance optimization

---

## React Component Types

```typescript
import { FC, ReactNode, CSSProperties } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
```

---

## Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}

const List = <T,>({
  items,
  renderItem,
  keyExtractor
}: ListProps<T>): JSX.Element => {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

// Usage
<List<User>
  items={users}
  renderItem={user => user.name}
  keyExtractor={user => user.id}
/>
```

---

## Custom Hooks with Generics

```typescript
function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>
): { data: T | null; loading: boolean; error: E | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<E | null>(null);

  useEffect(() => {
    asyncFunction()
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(err => {
        setError(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [asyncFunction]);

  return { data, loading, error };
}

// Usage
const { data: users, loading, error } = useAsync(() =>
  fetch("/api/users").then(r => r.json())
);
```

---

## Form Handling

```typescript
interface FormState {
  name: string;
  email: string;
  age: number;
}

function useForm<T extends Record<string, any>>(
  initialState: T,
  onSubmit: (data: T) => Promise<void>
) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setErrors({ [Object.keys(values)[0]]: "Error occurred" } as Partial<T>);
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, loading, handleChange, handleSubmit };
}

// Usage
const form = useForm<FormState>(
  { name: "", email: "", age: 0 },
  async (data) => {
    await fetch("/api/submit", { method: "POST", body: JSON.stringify(data) });
  }
);
```

---

## State Management (Redux)

```typescript
// Redux with TypeScript
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface RootState {
  todos: Todo[];
  loading: boolean;
}

type Action =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: RootState = {
  todos: [],
  loading: false
};

function reducer(state = initialState, action: Action): RootState {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        )
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}

// Dispatch with type safety
dispatch({ type: "ADD_TODO", payload: { id: 1, text: "Learn", done: false } });
// Error on wrong type or payload!
dispatch({ type: "ADD_TODO" }); // Error: missing payload
```

---

## Context with Types

```typescript
interface Theme {
  mode: "light" | "dark";
  primary: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    mode: "light",
    primary: "#000"
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

---

## Performance Optimization

```typescript
// Memoization
const MemoButton = memo(
  ({ label, onClick }: ButtonProps) => (
    <button onClick={onClick}>{label}</button>
  ),
  (prev, next) => prev.label === next.label
);

// useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return computation(data);
}, [data]);

// useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## Code Splitting

```typescript
const LazyComponent = lazy(() =>
  import("./HeavyComponent").then(m => ({ default: m.HeavyComponent }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

---

## Checklist

- [ ] Type React components properly
- [ ] Use generics in components
- [ ] Create reusable custom hooks
- [ ] Handle forms with types
- [ ] Manage state with Redux/Context
- [ ] Optimize with memo and callbacks
- [ ] Implement code splitting
