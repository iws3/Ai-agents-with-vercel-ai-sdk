# Part 10: Function Overloading (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- What function overloading is and why it matters
- How to declare precise overload signatures
- How to implement functions handling multiple signatures
- Real-world patterns: API methods, utility functions
- When overloading is better than unions
- Common pitfalls and debugging overload conflicts
- Modern alternatives to overloading
- Best practices for maintainable overloaded functions

---

## 📝 Key Terms

- **Function Overloading**: Defining multiple signatures for one function
- **Overload Signature**: Declares what parameter/return types are allowed
- **Implementation Signature**: Actual function body that handles all cases
- **Polymorphism**: Ability to handle multiple type combinations
- **Type Guard**: Code that narrows union types to specific types

> **Beginner Note** 🎓: Function overloading lets a single function have different behavior depending on what arguments are passed. It's like having different instruction manuals for the same tool.

---

## 🎯 Function Overloading Basics

A **function overload** specifies multiple valid signatures for the same function.

### Simple Overload Example

```typescript
// Overload signatures (what's allowed)
function greet(name: string): string;
function greet(name: string, age: number): string;

// Implementation (handles both cases)
function greet(name: string, age?: number): string {
  if (age) {
    return `Hello, ${name}! You are ${age} years old.`;
  }
  return `Hello, ${name}!`;
}

// Usage - TypeScript knows both are valid
greet("Alice");             // ✅ OK
greet("Bob", 30);           // ✅ OK
greet("Charlie", "thirty"); // ❌ ERROR: age must be number
greet("David", 30, true);   // ❌ ERROR: too many parameters
```

**How it works**:
1. TypeScript sees two overload signatures
2. Function implementation is flexible (uses `?` for optional)
3. Callers can only use the combinations defined in signatures

---

## 🔀 Multiple Signatures with Different Types

### Different Input Types

```typescript
// Parse accepts EITHER string OR array
function parse(data: string): string[];
function parse(data: string[]): string;

// Implementation handles both
function parse(data: string | string[]): string | string[] {
  if (typeof data === "string") {
    // It's a string - split it
    return data.split(",");
  } else {
    // It's an array - join it
    return data.join(",");
  }
}

// Usage
parse("apple,banana,cherry");    // ["apple", "banana", "cherry"]
parse(["apple", "banana"]);       // "apple,banana"
parse(123);                       // ❌ ERROR: must be string or string[]
```

### Different Return Types

```typescript
// Array of values -> returns array
function getValue(key: string, multiple: true): string[];
// Single value -> returns string
function getValue(key: string, multiple: false): string;
// Default -> returns string
function getValue(key: string): string;

// Implementation
function getValue(
  key: string,
  multiple: boolean = false
): string | string[] {
  // Imagine this gets data from a store
  const data: Record<string, string | string[]> = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"]
  };

  const value = data[key];

  if (multiple && Array.isArray(value)) {
    return value;
  } else if (Array.isArray(value)) {
    return value[0];
  } else {
    return value as string;
  }
}

// Usage - type correctly inferred
getValue("name");                // string
getValue("hobbies", true);       // string[]
getValue("hobbies", false);      // string
```

---

## 🔧 Real-World Patterns

### Pattern 1: merge() Function

Common in libraries - merge objects with flexibility:

```typescript
// Merge two objects of same type
function merge<T>(obj1: T, obj2: T): T;

// Merge any two objects
function merge(obj1: unknown, obj2: unknown): unknown;

// Implementation
function merge(obj1: any, obj2: any): any {
  return { ...obj1, ...obj2 };
}

interface User {
  id: number;
  name: string;
}

const user1: User = { id: 1, name: "Alice" };
const user2: User = { id: 2, name: "Bob" };

// Type-safe merge
const merged: User = merge(user1, user2);
```

### Pattern 2: API Request with Optional Options

```typescript
// Get with no options
function get(url: string): Promise<unknown>;

// Get with options
function get(url: string, options: RequestInit): Promise<unknown>;

// Implementation
function get(
  url: string,
  options?: RequestInit
): Promise<unknown> {
  return fetch(url, options).then(r => r.json());
}

// Usage
get("https://api.example.com/users");
get("https://api.example.com/users", {
  method: "GET",
  headers: { "Authorization": "Bearer token" }
});
```

### Pattern 3: Component Props with Variants

```typescript
// Button with primary variant
interface PrimaryButtonProps {
  variant: "primary";
  onClick: () => void;
}

// Button with link variant
interface LinkButtonProps {
  variant: "link";
  href: string;
}

// Union of all variants
type ButtonProps = PrimaryButtonProps | LinkButtonProps;

// Overloads for each variant
function Button(props: PrimaryButtonProps): React.ReactNode;
function Button(props: LinkButtonProps): React.ReactNode;

// Implementation
function Button(props: ButtonProps): React.ReactNode {
  if (props.variant === "primary") {
    return <button onClick={props.onClick}>Click me</button>;
  } else {
    return <a href={props.href}>Click me</a>;
  }
}

// Usage is type-safe
<Button variant="primary" onClick={() => console.log("clicked")} />;
<Button variant="link" href="/home" />;
// <Button variant="primary" href="/home" />; // ❌ ERROR: missing onClick
```

### Pattern 4: Event Handler Dispatch

```typescript
// Emit string-based event
function emit(event: "change", value: string): void;
function emit(event: "click", x: number, y: number): void;
function emit(event: "submit"): void;

// Implementation
function emit(
  event: string,
  ...args: any[]
): void {
  switch (event) {
    case "change":
      console.log("Changed to:", args[0]);
      break;
    case "click":
      console.log("Clicked at:", args[0], args[1]);
      break;
    case "submit":
      console.log("Submitted");
      break;
  }
}

// Usage is type-safe
emit("change", "new value");
emit("click", 100, 200);
emit("submit");
// emit("change", 42);  // ❌ ERROR: expects string
```

### Pattern 5: Retry Logic

```typescript
// Sync function
function retry<T>(fn: () => T): T;

// Async function
function retry<T>(fn: () => Promise<T>): Promise<T>;

// Implementation
function retry<T>(fn: any): any {
  let lastError: Error | null = null;

  for (let i = 0; i < 3; i++) {
    try {
      return fn();
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError;
}

// Usage
const result = retry(() => syncOperation());           // T
const asyncResult = retry(() => asyncOperation());    // Promise<T>
```

---

## 🔀 Overloading vs Union Types vs Optional Parameters

| Approach | Use When | Example |
|----------|----------|---------|
| **Overloading** | Multiple distinct signatures | `(name: string)` or `(name: string, age: number)` |
| **Union Types** | Similar behavior, different types | `(value: string \| number)` |
| **Optional Params** | Similar behavior, fewer params | `(name: string, age?: number)` |
| **Generics** | Type-preserving flexibility | `<T>(value: T): T` |

---

## 📚 Real-World Decision Table

### Use Overloading When:

✅ **Different signatures have different semantics**
```typescript
function getElementById(id: string): HTMLElement;
function getElementById(id: string, container: HTMLElement): HTMLElement;
```

✅ **Return types differ significantly**
```typescript
function getData(): Promise<User>;
function getData(id: string): Promise<User>;
function getData(id: string, includeDetails: true): Promise<UserWithDetails>;
```

✅ **Different number of required parameters**
```typescript
function log(message: string): void;
function log(message: string, context: any): void;
```

### Use Union Types When:

✅ **Similar behavior with different types**
```typescript
function process(value: string | number) {
  console.log(typeof value);
}
```

✅ **Type intersection matters more**
```typescript
type Handler = ((data: string) => void) | ((data: number) => void);
```

### Use Optional Parameters When:

✅ **Simple optional trailing arguments**
```typescript
function query(sql: string, timeout?: number) {}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Incompatible Implementation Signature

```typescript
// ❌ WRONG - Implementation doesn't satisfy overloads
function greet(name: string): string;
function greet(name: string, age: number): string;

function greet(name: string): string {  // ❌ Missing age parameter!
  return `Hello, ${name}!`;
}

// ✅ CORRECT - Implementation handles both cases
function greet(name: string, age?: number): string {
  if (age) {
    return `Hello, ${name}! Age: ${age}`;
  }
  return `Hello, ${name}!`;
}
```

### Pitfall 2: Over-Using Overloading

```typescript
// ❌ EXCESSIVE - Union type is simpler
function process(value: string | number): void;
function process(value: string | string[]): void;
function process(value: any): void {
  // Complex logic...
}

// ✅ SIMPLER - Just use union
function process(value: string | number | string[]): void {
  // Complex logic...
}
```

### Pitfall 3: Forgetting Implementation Header

```typescript
// ❌ ERROR - Overloads must be followed by implementation
function add(a: number, b: number): number;
function add(a: string, b: string): string;
// Missing implementation!

// ✅ CORRECT
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number | string, b: number | string): number | string {
  return a + b;
}
```

### Pitfall 4: Wrong Return Type in Implementation

```typescript
// ❌ WRONG - Function returns wrong type for some cases
function getValue(key: string, multiple: true): string[];
function getValue(key: string): string;

function getValue(key: string, multiple?: boolean): any {
  // ❌ Doesn't return array when multiple is true
  return "single value";
}

// ✅ CORRECT
function getValue(key: string, multiple?: boolean): string | string[] {
  if (multiple) {
    return ["value1", "value2"];
  }
  return "single";
}
```

---

## 🏆 Best Practices

1. **Keep overloads simple** - if you need 5+ overloads, reconsider
2. **Use Union types first** - overloading is for when unions won't work
3. **Document overloads** - use JSDoc to explain each case
4. **Order overloads** - specific cases first, general last
5. **Implementation is private** - users only see the overload signatures
6. **Test all paths** - ensure implementation handles all overloads
7. **Consider generics** - often cleaner than overloading

---

## ✅ Checklist

- [ ] Understand what function overloading allows
- [ ] Know how to write overload signatures
- [ ] Can create implementation signatures
- [ ] Know when to use vs alternatives
- [ ] Familiar with real-world patterns
- [ ] Can identify overloading pitfalls
- [ ] Comfortable with modern TypeScript approaches
- [ ] Know when overloading improves vs complicates code
