# Part 5: Advanced Type Inference (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- How TypeScript infers types automatically from values
- Type widening and narrowing concepts in depth
- When to rely on inference vs explicit types (trade-offs)
- Literal types and `as const` for precise typing
- Real-world inference patterns in APIs and configs
- Best practices for balancing inference with clarity
- Control flow analysis and type guards
- Advanced patterns like `typeof`, `ReturnType`, and `Parameters`

---

## 📝 Key Terms

- **Inference**: TypeScript automatically determining a type
- **Explicit Annotation**: Manually declaring a type
- **Type Widening**: Inferring a broader type than specific
- **Type Narrowing**: Refining a union to a specific type
- **Literal Type**: The exact value as a type
- **Contextual Typing**: Using context to infer a type
- **Control Flow Analysis**: Tracking type changes in code flow

> **Beginner Note** 🎓: TypeScript is smart! It can figure out types for you, but sometimes being explicit is clearer. Find the balance.

---

## 🔮 Basic Inference

Sometimes you don't need to write types out - TypeScript figures them out:

```typescript
// TypeScript infers these types automatically
const name = "Alice";              // Inferred: string
const age = 30;                    // Inferred: number
const active = true;               // Inferred: boolean
const items = [1, 2, 3];           // Inferred: number[]
const coords = { x: 10, y: 20 };   // Inferred: { x: number; y: number }

// No explicit annotations needed
// TypeScript looks at the value and deduces the type
```

**How it works**: TypeScript examines the assigned value and determines its type.

---

## 🎯 Inference from Function Returns

TypeScript can even infer return types:

```typescript
// No return type annotation - TypeScript infers it
function add(a: number, b: number) {
  return a + b;  // Returns number, so function returns number
}

// TypeScript knows: (a: number, b: number) => number
const result = add(5, 3);  // result: number (inferred!)

// Works with objects too
function createUser(name: string, age: number) {
  return { name, age };
}

// TypeScript infers: (name: string, age: number) => { name: string; age: number }
const user = createUser("Alice", 30);
// user: { name: string; age: number }
```

**Best practice**: Even though TypeScript can infer, **explicitly annotate return types** for clarity and documentation.

---

## 🎯 Type Widening vs Type Narrowing

### Type Widening: Broader = More Flexible

When TypeScript can't determine the specific type, it widens to a more general type:

```typescript
// Widening: Literal → General Type
let message = "hello";       // Type: string (not literal "hello")
message = "world";           // ✅ OK - reassignment allowed
message = "anything";        // ✅ OK

let count = 1;               // Type: number (not literal 1)
count = 2;                   // ✅ OK
count = 999;                 // ✅ OK

let active = true;           // Type: boolean (not literal true)
active = false;              // ✅ OK

// Arrays: elements widen
const nums = [1, 2, 3];      // Type: number[] (not [1, 2, 3])
nums.push(4);                // ✅ OK - can add more numbers
nums.push("five");           // ❌ ERROR: string not allowed
```

**Why widening?** Variables can be reassigned, so TypeScript uses the general type.

### Type Narrowing: Specific = More Precise

Refining a union or broader type to a specific type:

```typescript
// Narrowing with typeof
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Narrowed to: string
    console.log(value.toUpperCase());  // ✅ OK - string method
  } else {
    // Narrowed to: number
    console.log(value.toFixed(2));     // ✅ OK - number method
  }
}

// Narrowing with truthiness
function printLength(str: string | null) {
  if (str) {
    // Narrowed to: string (null narrowed out)
    console.log(str.length);           // ✅ OK
  }
}

// Narrowing with 'in' operator
function getProperty(obj: any) {
  if ("name" in obj) {
    // Narrowed: obj has name property
    console.log(obj.name);
  }
}
```

---

## 🔒 Const Prevents Widening (Literal Types)

Using `const` prevents widening to literal types:

```typescript
// let widens to string
let greeting = "hello";    // Type: string
greeting = "goodbye";      // ✅ OK

// const stays literal
const MESSAGE = "hello";   // Type: literal "hello"
MESSAGE = "goodbye";       // ❌ ERROR: can't reassign

// Useful for fixed values
const ENVIRONMENT = "production";  // Type: "production" (not string)
const API_KEY = "sk_live_abc123";  // Type: "sk_live_abc123" (not string)

// Array const
const colors = ["red", "green", "blue"];    // Type: string[]
const colorsTuple = ["red", "green"] as const;  // Type: ["red", "green"]

// Function const
const handler = (x: number) => x * 2;  // Type is fully inferred
```

---

## 📦 Type Inference with Complex Objects

### Object Inference

```typescript
// Without annotation - inferred
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
// Inferred: { id: number; name: string; email: string }

// Problem: what if you want to add fields later?
user.age = 30;  // ❌ ERROR: age not in original type

// Better: explicit type when structure will grow
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // Optional for future use
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

user.age = 30;  // ✅ OK - age can be added later
```

### Array Inference

```typescript
// Homogeneous array (same types)
const numbers = [1, 2, 3];           // Type: number[]
const words = ["a", "b", "c"];       // Type: string[]

// Mixed array (different types)
const mixed = [1, "two", true];      // Type: (number | string | boolean)[]

// Array of objects
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
// Inferred: { id: number; name: string }[]

// Problem: Can't add different properties to array elements
users.push({ id: 3, name: "Charlie", role: "admin" });  // ❌ ERROR

// Better: explicit type
interface User {
  id: number;
  name: string;
  role?: string;
}

const users: User[] = [/* ... */];
users.push({ id: 3, name: "Charlie", role: "admin" });  // ✅ OK
```

---

## 🔍 Control Flow Analysis: Type Narrowing in Practice

TypeScript tracks how types change throughout your code:

```typescript
function validateData(data: unknown) {
  // data: unknown - no info

  if (typeof data === "string") {
    // Narrowed to: string
    console.log(data.length);
  } else if (typeof data === "number") {
    // Narrowed to: number
    console.log(data.toFixed(2));
  } else if (Array.isArray(data)) {
    // Narrowed to: array
    console.log(data.length);
  } else {
    // Narrowed to: everything else
  }
}

// Type guards narrow unions
function processResponse(response: string | { data: any } | null) {
  // response: string | object | null

  if (!response) {
    // response: null
    return;
  }

  if (typeof response === "string") {
    // response: string
    console.log(response.toUpperCase());
  } else {
    // response: { data: any }
    console.log(response.data);
  }
}
```

---

## 🏷️ Literal Types: Specific Values as Types

```typescript
// Without as const - widens to string
type Status1 = "success" | "error" | "pending";
let status1: Status1 = "success";
status1 = "loading";  // ❌ ERROR: not in union

// With as const - stays literal
const Status2 = "success" as const;  // Type: "success" (literal)

// Array literals with as const - preserves exact types
const Colors = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"] (not string[])

type Color = typeof Colors[number];  // "red" | "green" | "blue"

function getColor(color: Color) {
  console.log(color);  // Only accepts literal colors
}

getColor("red");    // ✅ OK
getColor("yellow"); // ❌ ERROR
```

---

## 🔄 ReturnType and typeof: Advanced Inference

Using `typeof` and `ReturnType` to infer from existing values:

```typescript
// Extract type from a value
const user = { id: 1, name: "Alice", email: "alice@example.com" };
type UserType = typeof user;
// UserType: { id: number; name: string; email: string }

// Extract return type from a function
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>;
// User: { id: number; name: string }

// Extract parameter types
type GetUserParams = Parameters<typeof getUser>;
// GetUserParams: [] (function takes no parameters)
```

---

## 📚 Real-World Inference Patterns

### Pattern 1: API Responses

```typescript
// Without explicit type - risky
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();  // data: any
  return data;
}

// With explicit type - safe
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Pattern 2: Configuration Objects

```typescript
// Inference works well for configs
const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "mydb",
  ssl: true
};
// Automatically: { host: string; port: number; database: string; ssl: boolean }

// But be careful with growth
dbConfig.timeout = 3000;  // ❌ ERROR if you later try to use as strict type

// Better: define config type explicitly
interface DbConfig {
  host: string;
  port: number;
  database: string;
  ssl: boolean;
  timeout?: number;
}

const dbConfig: DbConfig = { /* ... */ };
```

### Pattern 3: React Component Props

```typescript
// Inference from default props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  // disabled is inferred as: boolean (from default false)
  return <button disabled={disabled}>{label}</button>;
}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Over-Relying on Inference

```typescript
// ❌ UNCLEAR - What's the intent?
const config = {
  timeout: 5000,
  retries: 3,
  debug: false
};

// ✅ CLEAR - Intent is explicit
interface ApiConfig {
  timeout: number;  // milliseconds
  retries: number;
  debug: boolean;
}

const config: ApiConfig = {
  timeout: 5000,
  retries: 3,
  debug: false
};
```

### Pitfall 2: Misunderstanding Widening

```typescript
// ❌ WRONG - Thinks literal type
const ERROR_CODE = 404;
let code = ERROR_CODE;  // code is number, not 404!
code = 200;             // ✅ OK - reassignment allowed

// ✅ CORRECT - Force literal for constants
const ERROR_CODE = 404 as const;
let code = ERROR_CODE;  // code is 404 (literal)
```

### Pitfall 3: Forgetting Context in Callbacks

```typescript
// ❌ Parameter type inference too broad
[1, 2, 3].map(x => {  // x inferred as number
  return x * 2;
});

// ✅ Be explicit when needed
[1, 2, 3].map((x: number) => {
  return x * 2;
});
```

---

## 🏆 Best Practices

1. **Let TypeScript infer simple variables** - `const name = "Alice"` is fine
2. **Always annotate function parameters** - no guessing what's expected
3. **Always annotate function returns** - documents intent clearly
4. **Annotate when structure grows** - explicit type prevents errors
5. **Use `as const` for literal values** - when you need exact types
6. **Use type narrowing** - don't skip type guards
7. **Prefer explicit when unclear** - clarity > conciseness

---

## ✅ Checklist

- [ ] Understanding inference basics
- [ ] Know type widening concept
- [ ] Can narrow types with type guards
- [ ] Understand `const` prevents widening
- [ ] Know when to be explicit
- [ ] Familiar with literal types
- [ ] Can use `as const` correctly
- [ ] Comfortable with control flow analysis
- [ ] Know common pitfalls

