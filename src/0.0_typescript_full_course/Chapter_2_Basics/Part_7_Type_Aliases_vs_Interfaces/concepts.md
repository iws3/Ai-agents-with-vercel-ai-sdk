# Part 7: Type Aliases vs Interfaces (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- What type aliases are and their full capabilities
- What interfaces are and their unique strengths
- Key differences between type aliases and interfaces
- Decision criteria for choosing one over the other
- Advanced features: declaration merging, extending, intersection
- Real-world patterns and team best practices
- Performance implications and tooling support
- When to use each in modern TypeScript

---

## 📝 Key Terms

- **Type Alias**: A name for any type using the `type` keyword
- **Interface**: A contract for object shapes using the `interface` keyword
- **Declaration Merging**: Combining multiple interface declarations with the same name
- **Extends**: Inheriting from another interface or type
- **Implements**: A class implementing an interface contract

> **Beginner Note** 🎓: Both type aliases and interfaces define types, but with different strengths. Most codebases need both!

---

## 🏷️ Type Aliases

A **type alias** creates a name for any type. Use the `type` keyword.

### Basic Type Aliases

```typescript
// Simple type
type ID = string | number;

// Function type
type Callback = (data: unknown) => void;

// Union type
type Status = "pending" | "success" | "error";

// Object type (similar to interface)
type Point = {
  x: number;
  y: number;
};
```

### Primitives & Literals

```typescript
// Primitive alias
type Age = number;

// Literal types
type Direction = "up" | "down" | "left" | "right";
type HttpStatus = 200 | 201 | 400 | 404 | 500;

// Tuple
type Coordinate = [number, number];

// Function signature
type Adder = (a: number, b: number) => number;
```

### Complex Unions

```typescript
type DataResponse = 
  | { status: "success"; data: unknown }
  | { status: "error"; error: string }
  | { status: "loading" };

// Usage
const response: DataResponse = {
  status: "success",
  data: { id: 1, name: "Alice" }
};
```

### Intersection of Types

```typescript
type Reader = {
  read: () => string;
};

type Writer = {
  write: (data: string) => void;
};

type ReadWriter = Reader & Writer;

const stream: ReadWriter = {
  read() { return "data"; },
  write(data) { console.log(data); }
};
```

---

## 🏗️ Interfaces

An **interface** defines the shape/contract for objects. Use the `interface` keyword.

### Basic Interface

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  age: 30
};
```

### Optional Properties

```typescript
interface UserProfile {
  username: string;
  bio?: string;
  website?: string;
  followers?: number;
}

const profile: UserProfile = {
  username: "alice_dev"
  // bio, website, followers are optional
};
```

### Readonly Properties

```typescript
interface Config {
  readonly apiUrl: string;
  readonly apiKey: string;
  timeout: number;  // Not readonly
}

const config: Config = {
  apiUrl: "https://api.example.com",
  apiKey: "secret",
  timeout: 5000
};

config.timeout = 10000;    // ✅ OK
config.apiUrl = "https://api2.example.com";  // ❌ ERROR: readonly
```

### Methods in Interfaces

```typescript
interface Rectangle {
  width: number;
  height: number;
  area(): number;
  perimeter(): number;
}

const rect: Rectangle = {
  width: 10,
  height: 20,
  area() { return this.width * this.height; },
  perimeter() { return 2 * (this.width + this.height); }
};

console.log(rect.area());      // 200
console.log(rect.perimeter()); // 60
```

### Extending Interfaces

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Pet extends Animal {
  owner: string;
  trained: boolean;
}

const dog: Pet = {
  name: "Buddy",
  age: 5,
  owner: "Alice",
  trained: true
};
```

### Multiple Inheritance

```typescript
interface Walkable {
  walk(): void;
}

interface Talkable {
  talk(): void;
}

interface Human extends Walkable, Talkable {
  think(): void;
}

const person: Human = {
  walk() { console.log("Walking..."); },
  talk() { console.log("Talking..."); },
  think() { console.log("Thinking..."); }
};
```

---

## 🔀 Type Aliases vs Interfaces: Complete Comparison

| Feature | Type Alias | Interface |
|---------|-----------|-----------|
| **Define Objects** | ✅ Yes | ✅ Yes |
| **Use Unions** | ✅ Yes | ❌ No |
| **Use Intersections** | ✅ Yes | Extends |
| **Extend** | ✅ Yes (`&`) | ✅ Yes (`extends`) |
| **Declaration Merging** | ❌ No | ✅ Yes |
| **Implement with Class** | ✅ Yes | ✅ Yes |
| **Primitives/Tuples** | ✅ Yes | ❌ No |
| **Function Types** | ✅ Yes | ✅ Yes (methods) |
| **Generic Types** | ✅ Yes | ✅ Yes |

---

## 🎯 Decision Table: Which One to Use?

### Use **Type Alias** when:

1. **Defining a union** ✅
   ```typescript
   type Result = Success | Error | Loading;
   ```

2. **Defining a tuple**
   ```typescript
   type Coordinates = [number, number];
   ```

3. **Aliasing primitives**
   ```typescript
   type Age = number;
   ```

4. **Function types**
   ```typescript
   type Callback = (data: any) => void;
   ```

5. **Combining with intersections**
   ```typescript
   type Logger = Console & { timestamp: () => string };
   ```

### Use **Interface** when:

1. **Defining object contracts** ✅
   ```typescript
   interface User {
     name: string;
     email: string;
   }
   ```

2. **Need declaration merging**
   ```typescript
   interface Window {
     myGlobalVariable: string;
   }
   ```

3. **Creating class contracts**
   ```typescript
   interface PaymentProcessor {
     process(amount: number): Promise<void>;
   }

   class StripeProcessor implements PaymentProcessor {
     process(amount: number) { /* ... */ }
   }
   ```

4. **Object inheritance expectations**
   ```typescript
   interface Animal { name: string; }
   interface Dog extends Animal { breed: string; }
   ```

5. **Clear semantic meaning for objects**
   ```typescript
   // More semantic than type
   interface Database {
     host: string;
     port: number;
     connect(): Promise<void>;
   }
   ```

---

## 📚 Advanced Patterns

### Pattern 1: Hybrid Approach

```typescript
// Interface for the main contract
interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
}

// Type for response variants
type UserResponse = 
  | { status: "found"; user: User }
  | { status: "notFound" }
  | { status: "error"; error: string };

// Type for configuration
type RepositoryConfig = {
  timeout: number;
  retries: number;
  cacheEnabled: boolean;
};
```

### Pattern 2: Declaration Merging for Extending Global Objects

```typescript
// Extend built-in global interface (interface only!)
interface Window {
  __myApp: {
    config: Record<string, unknown>;
    version: string;
  };
}

// Now you can use it
window.__myApp = {
  config: { debug: true },
  version: "1.0.0"
};
```

### Pattern 3: Conditional Composition

```typescript
// Type alias with conditional logic
type ArrayOrSingle<T> = T | T[];

// Usage
const value1: ArrayOrSingle<number> = 42;        // OK
const value2: ArrayOrSingle<number> = [1, 2, 3]; // OK

// Interface can't do this
```

### Pattern 4: API Response Handling

```typescript
// Type for union of responses
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Interface for request options
interface FetchOptions {
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

// Usage
async function fetchUser(id: string, options: FetchOptions): Promise<ApiResponse<User>> {
  // Implementation
  return { success: true, data: {} as User };
}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Trying Unions with Interfaces

```typescript
// ❌ WRONG - Interfaces can't use | operator
interface Status = "pending" | "success" | "error";  // Syntax error!

// ✅ CORRECT - Use type alias
type Status = "pending" | "success" | "error";
```

### Pitfall 2: Not Using Declaration Merging

```typescript
// ❌ INEFFICIENT - Creating separate variables
interface Validator { validate: () => boolean; }
interface Serializer { serialize: () => string; }

// Multiple types for same concern

// ✅ GOOD - Use declaration merging with interface
interface Logger {
  log: (msg: string) => void;
}

interface Logger {
  logError: (error: Error) => void;
}

// Now Logger has both methods!
```

### Pitfall 3: Over-using Interfaces

```typescript
// ❌ Interface for a union (weird)
interface Result {
  type: "success" | "error";
  data?: unknown;
  message?: string;
}

const result: Result = {
  type: "success",
  data: { id: 1 }
};

// ✅ Type alias is clearer
type Result = 
  | { type: "success"; data: unknown }
  | { type: "error"; message: string };
```

---

## 🔄 Converting Between Type Aliases and Interfaces

### Type Alias to Interface

```typescript
// Type Alias
type User = {
  name: string;
  email: string;
  getFullProfile(): Promise<UserProfile>;
};

// Convert to Interface
interface User {
  name: string;
  email: string;
  getFullProfile(): Promise<UserProfile>;
}
```

### Interface to Type Alias

```typescript
// Interface
interface Product {
  id: string;
  title: string;
  price: number;
}

// Convert to Type Alias
type Product = {
  id: string;
  title: string;
  price: number;
};
```

---

## 📚 Real-World Examples

### Example 1: E-Commerce Application

```typescript
// Union for product types - must use type
type Product = 
  | { kind: "physical"; weight: number; dimensions: [number, number, number] }
  | { kind: "digital"; fileSize: number; format: string }
  | { kind: "service"; duration: number; unit: "hours" | "days" };

// Order interface - clear contract
interface Order {
  id: string;
  products: Product[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}

// Payment processor interface - class will implement
interface PaymentProcessor {
  process(amount: number): Promise<boolean>;
  refund(transactionId: string): Promise<void>;
}
```

### Example 2: React Component Props

```typescript
// Props interface for component contract
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

// Click handler type alias
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

// Status type alias (union)
type ButtonState = "idle" | "loading" | "success" | "error";
```

### Example 3: LLM Integration

```typescript
// Message interface - clear structure
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// Chat response - union type
type ChatResponse = 
  | { type: "text"; content: string }
  | { type: "function_call"; name: string; arguments: Record<string, unknown> }
  | { type: "error"; error: string };

// Configuration interface
interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}
```

---

## � Decision Matrix: Type vs Interface

| Need | Type | Interface |
|------|------|-----------|
| **Object shape contract** | Possible | ✓ Better |
| **Union of types** | ✓ Perfect | Not directly |
| **Function signature** | ✓ Better | Possible but verbose |
| **Extend other types** | Intersection ✓ | Inheritance ✓ |
| **Declare merging** | Never | ✓ Only option |
| **Primitive aliases** | ✓ Only option | Never |
| **Conditional types** | ✓ Only option | Never |
| **Mapped types** | ✓ Only option | Never |

### Examples for Each Scenario

```typescript
// Scenario 1: Simple object contract
// ✓ Interface better
interface User {
  id: number;
  name: string;
  email: string;
}

// Scenario 2: Function type
// ✓ Type better
type Validator = (value: unknown) => boolean;

// Scenario 3: Extending an object
// Both work equally well
interface Admin extends User {
  permissions: string[];
}

type AdminType = User & { permissions: string[] };

// Scenario 4: Complex union
// ✓ Type better (Interface can't do this directly)
type ApiResponse = 
  | { status: "success"; data: unknown }
  | { status: "error"; message: string }
  | { status: "pending" };

// Scenario 5: Primitive alias
// ✓ Type only option
type Email = string;
type UserId = number;

// Scenario 6: Conditional type
// ✓ Type only option
type IsString<T> = T extends string ? true : false;

// Scenario 7: Declaration merging (extend globals)
// ✓ Interface only option
interface Window {
  myCustomProperty: string;
}

// Scenario 8: Mapped types
// ✓ Type only option
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

---

## �🏆 Best Practices

1. **Default to Interface** for object contracts - it's more semantic
2. **Use Type Aliases** for unions, function types, and complex mappings
3. **Use Declaration Merging** when extending global objects (interfaces only)
4. **Be Consistent** - stick to one style in your file/project when possible
5. **Document Complex Types** - add JSDoc comments for clarity

---

## ✅ Checklist

- [ ] Understand what type aliases are
- [ ] Understand what interfaces are
- [ ] Know the key differences between them
- [ ] Can choose appropriate tool for each situation
- [ ] Familiar with declaration merging
- [ ] Can extend/inherit properly
- [ ] Comfortable mixing both in real projects
- [ ] Know when to use unions (type) vs inheritance (interface)
