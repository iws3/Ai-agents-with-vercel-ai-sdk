# TypeScript Common Patterns

Essential patterns for professional TypeScript development.

---

## 1. Factory Pattern

### Problem
Creating objects with complex initialization or multiple variants.

### Solution
```typescript
// Define shape
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// Multiple implementations
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private filename: string) {}
  
  log(message: string): void {
    // Write to file
  }
  error(message: string): void {
    // Write to file
  }
}

// Factory
function createLogger(type: 'console' | 'file', filename?: string): Logger {
  if (type === 'console') {
    return new ConsoleLogger();
  } else {
    return new FileLogger(filename || 'app.log');
  }
}

// Usage
const logger = createLogger('console');
logger.log('Application started');
```

---

## 2. Singleton Pattern

### Problem
Need single instance across application.

### Solution
```typescript
class Database {
  private static instance: Database;
  
  private constructor() {}
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  query(sql: string): Promise<any[]> {
    // Execute query
    return Promise.resolve([]);
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true - same instance
```

---

## 3. Observer Pattern

### Problem
Need multiple objects to react to state changes.

### Solution
```typescript
interface Observer {
  update(data: any): void;
}

class Observable {
  private observers: Set<Observer> = new Set();
  
  subscribe(observer: Observer): void {
    this.observers.add(observer);
  }
  
  unsubscribe(observer: Observer): void {
    this.observers.delete(observer);
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Concrete observer
class UserComponent implements Observer {
  update(data: any): void {
    console.log('User updated:', data);
  }
}

// Usage
const userStore = new Observable();
const component = new UserComponent();
userStore.subscribe(component);
userStore.notify({ id: 1, name: 'John' });
```

---

## 4. Dependency Injection

### Problem
High coupling between classes makes testing difficult.

### Solution
```typescript
interface UserRepository {
  getUser(id: number): Promise<User>;
}

// Implementation
class DatabaseUserRepository implements UserRepository {
  async getUser(id: number): Promise<User> {
    // Query database
    return { id, name: 'John' };
  }
}

// Service receives dependency
class UserService {
  constructor(private repo: UserRepository) {}
  
  async getUser(id: number): Promise<User> {
    return this.repo.getUser(id);
  }
}

// Testable with mock
class MockUserRepository implements UserRepository {
  async getUser(id: number): Promise<User> {
    return { id, name: 'Mock User' };
  }
}

// Usage - injectable
const mockRepo = new MockUserRepository();
const service = new UserService(mockRepo);
```

---

## 5. Type Guards

### Problem
Narrowing union types safely.

### Solution
```typescript
interface Dog {
  breed: string;
}

interface Cat {
  color: string;
}

type Pet = Dog | Cat;

// Type guard function
function isDog(pet: Pet): pet is Dog {
  return 'breed' in pet;
}

function describePet(pet: Pet): string {
  if (isDog(pet)) {
    return `Dog breed: ${pet.breed}`; // pet is Dog here
  } else {
    return `Cat color: ${pet.color}`; // pet is Cat here
  }
}
```

---

## 6. Generic Utilities

### Problem
Writing reusable code across multiple types.

### Solution
```typescript
// Generic function
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic class
class Container<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  get(index: number): T | undefined {
    return this.items[index];
  }
  
  getAll(): T[] {
    return [...this.items];
  }
}

// Usage
const numbers = new Container<number>();
numbers.add(42);
const value = numbers.get(0); // Type: number | undefined
```

---

## 7. Discriminated Unions

### Problem
Complex types with many possibilities.

### Solution
```typescript
// Discriminated union
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

// Function with discriminator
function handleResult<T>(result: Result<T>): void {
  switch (result.status) {
    case 'success':
      console.log(result.data); // Known to have data
      break;
    case 'error':
      console.log(result.error); // Known to have error
      break;
    case 'loading':
      console.log('Loading...'); // No data or error
      break;
  }
}
```

---

## 8. Async Error Handling

### Problem
Handling errors in async operations.

### Solution
```typescript
// Wrapper for error handling
async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}

// Usage
const [data, error] = await tryCatch(() =>
  fetch('/api/users').then(r => r.json())
);

if (error) {
  console.log('Failed:', error.message);
} else {
  console.log('Success:', data);
}
```

---

## 9. Higher-Order Functions

### Problem
Creating flexible, reusable functions.

### Solution
```typescript
// HOF: Logger
function withLogging<T extends (...args: any[]) => any>(
  fn: T
): T {
  return ((...args: any[]) => {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  }) as T;
}

// HOF: Retry
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const fetch WithRetry = withRetry(() => fetch('/api/data'));
```

---

## 10. Utility Types

### Problem
Transforming types for specific use cases.

### Solution
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Remove sensitive field
type PublicUser = Omit<User, 'password'>;

// Make all fields optional
type PartialUser = Partial<User>;

// Make all fields required
type RequiredUser = Required<User>;

// Make all fields readonly
type ReadonlyUser = Readonly<User>;

// Get values as union
type UserValues = User[keyof User];

// Create new type from keys
type UserKeys = keyof User; // 'id' | 'name' | 'email' | 'password'

// Usage
const publicUser: PublicUser = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
  // password intentionally missing
};
```

---

## 11. Conditional Types

### Problem
Type varies based on condition.

### Solution
```typescript
// Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;

type NumArray = Flatten<number[]>; // number
type Str = Flatten<string>; // string

// Extract promise value
type Awaited<T> = T extends Promise<infer U> ? U : T;

type PromiseNum = Awaited<Promise<number>>; // number
type Str2 = Awaited<string>; // string

// Useful utility
type FunctionReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : never;

const getNum = (): number => 42;
type ReturnType = FunctionReturnType<typeof getNum>; // number
```

---

## 12. Partial Application

### Problem
Creating specialized versions of functions.

### Solution
```typescript
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

// Partial application
function partial<T extends (...args: any[]) => any>(
  fn: T,
  ...args: any[]
) {
  return (...moreArgs: any[]) => fn(...args, ...moreArgs);
}

const multiplyBy2 = partial(multiply, 2);
const result = multiplyBy2(3, 4); // 2 * 3 * 4 = 24
```

---

## 13. Memoization

### Problem
Caching function results for performance.

### Solution
```typescript
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Usage
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Fast due to memoization
```

---

## 14. Event Emitter

### Problem
Custom event system for decoupled communication.

### Solution
```typescript
class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, Function[]> = new Map();
  
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// Usage
interface Events {
  userCreated: { id: number; name: string };
  userDeleted: { id: number };
}

const emitter = new EventEmitter<Events>();
emitter.on('userCreated', (data) => {
  console.log(`User created:`, data.name);
});
emitter.emit('userCreated', { id: 1, name: 'John' });
```

---

## Summary Table

| Pattern | Use Case | Benefit |
|---------|----------|---------|
| Factory | Creating complex objects | Decoupling creation |
| Singleton | Single instance needed | Memory efficiency |
| Observer | State change notifications | Loose coupling |
| DI | Testability | Easier mocking |
| Type Guards | Narrowing types | Type safety |
| Generics | Reusable code | Code reuse |
| Discriminated Union | Complex types | Type narrowing |
| HOF | Function composition | Flexibility |
| Utility Types | Type transformation | Less boilerplate |
| Conditional Types | Dynamic types | Advanced patterns |

---

