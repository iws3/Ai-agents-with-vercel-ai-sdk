# Part 8: Enums and Literal Types (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- What enums are and their use cases
- String enums vs numeric enums vs heterogeneous enums
- Literal types and when they're better than enums (usually!)
- Enums in real-world applications and APIs
- Common pitfalls: reverse mapping, runtime behavior
- Modern best practices: prefer literal unions over enums
- Const assertions and discriminated unions
- Performance and tree-shaking implications

---

## 📝 Key Terms

- **Enum**: A set of named constant values
- **Literal Type**: A specific exact value as a type
- **String Enum**: Enum with string values
- **Numeric Enum**: Enum with numeric values
- **Heterogeneous Enum**: Mix of string and numeric values
- **Discriminated Union**: Union with literal types for safe handling

> **Beginner Note** 🎓: Both enums and literal types constrain values to specific options. Literal types are often simpler and more modern!

---

## 🏆 Enums: Named Constants

### String Enums (Most Common)

An **enum** is a set of named constants. Use for values with meaningful names.

```typescript
enum Status {
  Pending = "pending",
  Complete = "complete",
  Failed = "failed"
}

// Using the enum
let currentStatus: Status = Status.Pending;
currentStatus = Status.Complete;  // ✅ OK
currentStatus = "complete";        // ❌ ERROR: string not assignable to Status

// You can check the value
if (currentStatus === Status.Complete) {
  console.log("Task completed!");
}
```

**Read this as**: "currentStatus must be one of these specific Status enum values"

### Numeric Enums

Enums can have numeric values. TypeScript auto-increments by default:

```typescript
enum Direction {
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4
}

const dir: Direction = Direction.Up;  // 1
console.log(Direction.Down);           // 2

// Auto-increment
enum Status {
  Pending = 1,
  Active,      // 2 (auto)
  Completed,   // 3 (auto)
  Failed       // 4 (auto)
}
```

### Heterogeneous Enums (Mixed)

Mix strings and numbers in one enum:

```typescript
enum Mixed {
  Success = "SUCCESS",
  Error = "ERROR",
  Code1 = 0,
  Code2 = 1
}

const result: Mixed = Mixed.Success;  // "SUCCESS"
const error: Mixed = Mixed.Code1;     // 0
```

> **Note**: Heterogeneous enums are rare and often a sign of poor design. Use literal types instead.

### Enum Reverse Mapping (Numeric Only)

Numeric enums have bidirectional mapping:

```typescript
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}

console.log(Color.Red);      // 0
console.log(Color[0]);       // "Red" (reverse mapping)

// String enums don't have reverse mapping
enum Status {
  Pending = "pending"
}
console.log(Status.Pending);  // "pending"
console.log(Status["pending"]); // undefined - no reverse mapping
```

---

## 🏷️ Literal Types: Specific Values as Types

A **literal type** makes a specific value part of the type system. Use `as const` or union of literals.

### String Literals

```typescript
// Single literal type
type Greeting = "hello";
const greeting: Greeting = "hello";      // ✅ OK
const wrong: Greeting = "goodbye";       // ❌ ERROR

// Union of literals (more common)
type Status = "pending" | "success" | "error";
const status: Status = "success";        // ✅ OK
const invalid: Status = "complete";      // ❌ ERROR: not in union
```

### Numeric Literals

```typescript
type MaxRetries = 3 | 5 | 10;
const retries: MaxRetries = 5;    // ✅ OK
const bad: MaxRetries = 7;        // ❌ ERROR

// HTTP Status codes
type SuccessCode = 200 | 201 | 204;
type ErrorCode = 400 | 401 | 404 | 500;
type HttpCode = SuccessCode | ErrorCode;
```

### Boolean Literals

```typescript
type Switch = true | false;  // Equivalent to boolean
type EnabledOnly = true;     // Only true allowed
```

### Using `as const`

```typescript
// Without as const - becomes broader type
const status = "pending";  // type: string

// With as const - becomes literal type
const status = "pending" as const;  // type: "pending"

// Array literals with as const
const colors = ["red", "green", "blue"] as const;
type Color = typeof colors[number];  // "red" | "green" | "blue"
```

---

## 🔀 Enums vs Literal Types: Complete Comparison

| Aspect | Enum | Literal Type |
|--------|------|--------------|
| **Syntax** | `enum X { A = "a" }` | `type X = "a" \| "b"` |
| **Namespace** | Creates namespace | No namespace |
| **Runtime** | Compiled object | No runtime code |
| **Reverse Map** | Yes (numeric) | No |
| **String-based** | ✅ Yes | ✅ Yes |
| **Number-based** | ✅ Yes | ✅ Yes |
| **Boolean-based** | ❌ No | ✅ Yes |
| **Auto-Increment** | ✅ Numeric | ❌ No |
| **Type-Safe** | ✅ Yes | ✅ Yes |
| **Tree-Shaking** | ❌ No | ✅ Yes |
| **Modern Approach** | ❌ Legacy | ✅ Modern |

---

## 🥊 Should You Use Enums or Literal Types?

### Use Literal Types (Preferred) When:

```typescript
// ✅ String status values
type OrderStatus = "pending" | "shipped" | "delivered";

// ✅ HTTP methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// ✅ User roles
type Role = "admin" | "user" | "guest";

// ✅ Environment names
type Environment = "development" | "staging" | "production";
```

### Use Enums When:

```typescript
// Enum provides namespace (avoids naming conflicts)
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500
}

// Usage: HttpStatus.OK (clearer context)
```

### Practical Decision

**For new code, prefer literal types**:
- Simpler syntax
- No runtime overhead
- Better tree-shaking
- More flexibility

```typescript
// ✅ MODERN - Prefer this
type OrderState = "pending" | "processing" | "completed" | "cancelled";

// ❌ LEGACY - Avoid for new projects
enum OrderState {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Cancelled = "cancelled"
}
```

---

## 📚 Real-World Patterns

### Pattern 1: Safe API Responses with Discriminated Unions

```typescript
// Using literal types for discriminators
type SuccessResponse = {
  status: "success";     // Literal type
  data: Record<string, unknown>;
  timestamp: Date;
};

type ErrorResponse = {
  status: "error";       // Literal type
  error: string;
  code: number;
  timestamp: Date;
};

type ApiResponse = SuccessResponse | ErrorResponse;

// Type-safe handling
function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);      // ✅ data available
    // console.log(response.error);   // ❌ ERROR: doesn't exist
  } else {
    console.log(response.error);     // ✅ error available
    // console.log(response.data);    // ❌ ERROR: doesn't exist
  }
}
```

### Pattern 2: Event Types with Literal Discriminators

```typescript
type Event = 
  | { type: "click" | "dblclick"; x: number; y: number }
  | { type: "submit"; formId: string; errors?: string[] }
  | { type: "focus" | "blur"; elementId: string };

function handleEvent(event: Event) {
  switch (event.type) {
    case "click":
    case "dblclick":
      console.log(`${event.type} at ${event.x}, ${event.y}`);
      break;
    case "submit":
      console.log(`Form ${event.formId} submitted`);
      break;
    case "focus":
    case "blur":
      console.log(`Element ${event.elementId} ${event.type}`);
      break;
  }
}
```

### Pattern 3: Size/Scale Constants

```typescript
// Literal types for UI sizes
type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";
type Spacing = 0 | 4 | 8 | 12 | 16 | 24 | 32 | 48;

interface ButtonProps {
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary" | "outline";
  disabled?: boolean;
}
```

### Pattern 4: Permission System

```typescript
// Using literal types for permissions
type Permission = 
  | "read"
  | "write"
  | "delete"
  | "admin";

interface User {
  id: string;
  role: "admin" | "moderator" | "user";
  permissions: Permission[];
}

function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission);
}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Over-Using Enums

```typescript
// ❌ BAD - Enum not needed here
enum Colors {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

// ✅ GOOD - Simple literal types
type Color = "red" | "green" | "blue";
```

### Pitfall 2: Mixing Enums and Strings Unsafely

```typescript
// ❌ BAD - No type safety
enum Status {
  Active = "active",
  Inactive = "inactive"
}

function setStatus(status: string) {  // Too broad!
  // Could be any string, defeats enum purpose
}

// ✅ GOOD - Type safe
function setStatus(status: Status) {
  // Only valid Status values accepted
}
```

### Pitfall 3: Using `const` Enum Incorrectly

```typescript
// const enums have limitations
const enum Direction {
  Up = "up",
  Down = "down"
}

// Can't use reverse mapping or Object.keys()
const keys = Object.keys(Direction);  // ❌ Empty array!

// Prefer regular enum or literal types
```

### Pitfall 4: Not Validating External Data

```typescript
// ❌ UNSAFE - API could send invalid status
async function updateOrder(orderId: string, status: Status) {
  const response = await fetch(`/api/orders/${orderId}`, {
    body: JSON.stringify({ status })
  });
}

// ✅ SAFE - Validate input
const validStatuses = ["pending", "shipped", "delivered"] as const;
type Status = typeof validStatuses[number];  // "pending" | "shipped" | "delivered"

function isValidStatus(value: unknown): value is Status {
  return typeof value === "string" && validStatuses.includes(value as any);
}
```

---

## 🔄 When to Use const vs const enum

```typescript
// Regular enum - becomes object at runtime
enum Status {
  New = "NEW",
  Active = "ACTIVE"
}
// Transpiles to: exports.Status = { New: "NEW", Active: "ACTIVE" }

// const enum - inlined, no object at runtime
const enum Status {
  New = "NEW",
  Active = "ACTIVE"
}
// Transpiles directly to string literals, no runtime object

// Problem with const enum:
// const enum Color { Red = "red" }
// const color = Color.Red;
// const color = "red";  // No way to access enum object at runtime!
```

---

## 🏆 Best Practices

1. **Prefer literal types** for new projects - simpler and more modern
2. **Use enums** for larger sets of related values or when namespace is needed
3. **Use `as const`** with arrays for immutable literal types
4. **Always validate** data from external sources
5. **Use discriminated unions** for safe data handling
6. **Avoid `const enum`** unless you need them for performance

---

## ✅ Checklist

- [ ] Understand what enums are
- [ ] Know string, numeric, and heterogeneous enums
- [ ] Understand literal types
- [ ] Know when to use each
- [ ] Familiar with `as const` syntax
- [ ] Can build discriminated unions
- [ ] Comfortable with real-world patterns
- [ ] Know the modern best practices
