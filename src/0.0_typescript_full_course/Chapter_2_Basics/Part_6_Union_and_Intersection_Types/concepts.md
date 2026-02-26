# Part 6: Union and Intersection Types (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- Union types (OR logic) and when to use them
- Intersection types (AND logic) and combining types
- Type guards and type narrowing
- Discriminated unions for safe data handling
- Real-world patterns in API responses and component props
- Common pitfalls and how to avoid them

---

## 📝 Key Terms

- **Union Type**: A type that can be one of several types (`|`)
- **Intersection Type**: A type combining multiple types (`&`)
- **Type Guard**: Code that narrows a union to a specific type
- **Type Narrowing**: Refining a union to a more specific type
- **Discriminated Union**: Union with a common "tag" property for safe switching
- **Type Predicate**: Function that narrows types (`is` keyword)

> **Beginner Note** 🎓: Union types help you express "this can be multiple things". Intersection types let you combine contracts. Together, they make your code more flexible AND type-safe.

---

## 🎯 Union Types: OR Logic

A **union type** allows a value to be one of multiple types. Use the pipe operator `|` to combine types.

### Basic Union Types

```typescript
let value: string | number;
value = "hello";   // ✅ OK
value = 42;        // ✅ OK
value = true;      // ❌ ERROR: boolean not allowed
```

**Reading this**: "value can be a string OR a number, but nothing else"

### Multiple-Type Unions

```typescript
type Status = "pending" | "success" | "error" | "loading";

let currentStatus: Status = "pending";    // ✅ OK
currentStatus = "success";                // ✅ OK
currentStatus = "completed";              // ❌ ERROR: not in union

type ID = string | number;

const userId: ID = 123;        // ✅ OK
const productId: ID = "PROD-1"; // ✅ OK
```

### Unions of Complex Types

```typescript
interface ApiError {
  code: number;
  message: string;
}

interface ApiSuccess {
  data: unknown;
  timestamp: Date;
}

type ApiResponse = ApiSuccess | ApiError;

const response: ApiResponse = {
  data: { id: 1, name: "Alice" },
  timestamp: new Date()
};
```

---

## 🚨 Type Guards: Narrowing Unions

When you have a union, you must narrow it before using type-specific methods. This is where **type guards** come in.

### typeof Guard (for primitives)

```typescript
function processValue(value: string | number): void {
  // Without narrowing, you can't call string methods
  // value.toUpperCase();  // ❌ ERROR: number doesn't have toUpperCase

  if (typeof value === "string") {
    console.log(value.toUpperCase());  // ✅ OK - we know it's a string
  } else {
    console.log(value.toFixed(2));     // ✅ OK - we know it's a number
  }
}

processValue("hello");    // Output: HELLO
processValue(3.14159);    // Output: 3.14
```

**How it works**: `typeof value === "string"` tells TypeScript to treat `value` as `string` in that block.

### instanceof Guard (for classes/objects)

```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

type Pet = Dog | Cat;

function makeSound(pet: Pet) {
  if (pet instanceof Dog) {
    pet.bark();   // ✅ Safe - pet is Dog here
  } else {
    pet.meow();   // ✅ Safe - pet is Cat here
  }
}

makeSound(new Dog());  // Output: Woof!
makeSound(new Cat());  // Output: Meow!
```

### Property Checking Guard

```typescript
interface Bird {
  fly: () => void;
}

interface Fish {
  swim: () => void;
}

type Animal = Bird | Fish;

function moveAnimal(animal: Animal) {
  if ("fly" in animal) {
    animal.fly();     // ✅ Safe - bird has fly
  } else {
    animal.swim();    // ✅ Safe - fish has swim
  }
}
```

---

## 🏷️ Discriminated Unions (BEST PRACTICE)

For complex unions, use a **discriminator** - a common property that identifies which type you have. This is the safest pattern for AI applications and APIs.

### Real-World: API Response Handling

```typescript
// WITHOUT discriminator - error-prone
type Response = 
  | { data: User; error: null }
  | { data: null; error: string };

// Reader must manually check what exists
// Error-prone: might not handle both cases properly

// WITH discriminator - safe and clear ✅
type Response = 
  | { status: "success"; data: User }
  | { status: "error"; message: string };

function handleResponse(response: Response) {
  if (response.status === "success") {
    console.log(response.data);      // ✅ data available
    // console.log(response.message); // ❌ message not here
  } else {
    console.log(response.message);   // ✅ message available
    // console.log(response.data);    // ❌ data not here
  }
}
```

### Real-World: LLM Tool Calls

```typescript
type ToolResult = 
  | { type: "text"; content: string }
  | { type: "json"; content: Record<string, unknown> }
  | { type: "error"; error: string };

function processToolResult(result: ToolResult) {
  switch (result.type) {
    case "text":
      console.log("Text:", result.content);  // ✅ content is string
      break;
    case "json":
      console.log("JSON:", result.content);  // ✅ content is Record
      break;
    case "error":
      console.error("Error:", result.error); // ✅ error is string
      break;
  }
}
```

### Real-World: Form State

```typescript
type FormState = 
  | { state: "idle" }
  | { state: "loading"; progress: number }
  | { state: "success"; data: Record<string, unknown> }
  | { state: "error"; message: string };

function renderForm(state: FormState) {
  switch (state.state) {
    case "idle":
      return "<form>...</form>";
    case "loading":
      return `<progress value="${state.progress}"/>`;
    case "success":
      return `<p>Saved: ${JSON.stringify(state.data)}</p>`;
    case "error":
      return `<p class="error">${state.message}</p>`;
  }
}
```

---

## 🤝 Intersection Types: AND Logic

An **intersection type** requires implementing BOTH (or all) types. Use `&` to combine.

### Basic Intersection

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Pet {
  owner: string;
  trained: boolean;
}

type MyPet = Animal & Pet;  // Must have ALL properties

const dog: MyPet = {
  name: "Buddy",
  age: 5,
  owner: "Alice",
  trained: true
};
```

**Reading this**: "MyPet must have everything from Animal AND everything from Pet"

### Combining Functions

```typescript
// Common pattern: extending middleware

type Logger = (msg: string) => void;
type Formatter = (text: string) => string;

type FormattedLogger = Logger & Formatter;

// Must satisfy both contracts
const logger: FormattedLogger = (input: string) => {
  console.log(input);
  return input.toUpperCase();
};

logger("hello");  // Logs: hello, Returns: HELLO
```

### Practical: Component Composition

```typescript
interface BaseComponent {
  id: string;
  className?: string;
}

interface Interactive {
  onClick: (event: React.MouseEvent) => void;
  disabled?: boolean;
}

interface Themed {
  theme: "light" | "dark";
  color: string;
}

type Button = BaseComponent & Interactive & Themed;

const button: Button = {
  id: "btn-1",
  onClick: (e) => console.log(e),
  theme: "dark",
  color: "#FF0000"
};
```

---

## 🔀 Union vs Intersection: Quick Reference

| Aspect | Union (`\|`) | Intersection (`&`) |
|--------|----------|----|
| Logic | OR | AND |
| Use When | Value can be one of several types | Need to combine multiple contracts |
| Example | `string \| number` | `Reader & Writer` |
| Checking | Must narrow/guard | Must provide all properties |
| Common Case | API responses, status states | Combining interfaces, traits |

---

## ⚠️ Common Pitfalls

### Pitfall 1: Over-Using `any` Instead of Unions

```typescript
// ❌ BAD - no type safety
function process(value: any) {
  return value.toUpperCase();  // Might crash!
}

// ✅ GOOD - clear types
function process(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}
```

### Pitfall 2: Forgetting to Narrow Before Using

```typescript
// ❌ BAD - compiler error
function getId(value: string | number): string {
  return value.toString();  // ❌ number doesn't have toString directly
}

// ✅ GOOD - proper narrowing
function getId(value: string | number): string {
  if (typeof value === "string") {
    return value;
  } else {
    return value.toString();
  }
}
```

### Pitfall 3: Intersection Conflicts

```typescript
// ❌ BAD - conflicting types
interface A { x: string; }
interface B { x: number; }
type Conflict = A & B;  // ❌ x can't be both string AND number

// ✅ GOOD - compatible properties
interface A { x: string; }
interface B { y: number; }
type Compatible = A & B;  // ✅ Both x and y exist
```

---

## 🎯 Real-World Patterns

### Pattern 1: API Error Handling

```typescript
type ApiCall<T> = 
  | { status: "success"; data: T }
  | { status: "pending" }
  | { status: "error"; error: Error };

async function fetchUser(id: string): Promise<ApiCall<User>> {
  try {
    const data = await fetch(`/api/users/${id}`);
    return { status: "success", data };
  } catch (error) {
    return { status: "error", error: error as Error };
  }
}
```

### Pattern 2: Event Handlers

```typescript
type Event = 
  | { type: "click"; x: number; y: number }
  | { type: "scroll"; direction: "up" | "down" }
  | { type: "resize"; width: number; height: number };

function handleEvent(event: Event) {
  switch (event.type) {
    case "click":
      console.log(`Clicked at ${event.x}, ${event.y}`);
      break;
    case "scroll":
      console.log(`Scrolled ${event.direction}`);
      break;
    case "resize":
      console.log(`Resized to ${event.width}x${event.height}`);
      break;
  }
}
```

### Pattern 3: Trait-Based Composition

```typescript
// Define traits as interfaces
interface Loggable { log: () => void; }
interface Serializable { serialize: () => string; }
interface Comparable { compare: (other: unknown) => number; }

// Service that has all traits
type FullService = Loggable & Serializable & Comparable;

// Implementation
const service: FullService = {
  log() { console.log("Logging..."); },
  serialize() { return JSON.stringify({}); },
  compare() { return 0; }
};
```

---

## 📚 Resources

- [Union Types Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Intersection Types Handbook](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
- [Type Guards Documentation](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Discriminated Unions Guide](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

---

## ✅ Checklist

- [ ] Understand union types `A | B`
- [ ] Know when to use union types
- [ ] Can narrow unions with type guards
- [ ] Understand discriminated unions
- [ ] Understand intersection types `A & B`
- [ ] Know when to use intersections  
- [ ] Can identify and use both patterns
- [ ] Comfortable with real-world examples
