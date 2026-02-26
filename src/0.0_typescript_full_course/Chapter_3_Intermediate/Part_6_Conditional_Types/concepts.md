# Part 6: Conditional Types (Intermediate Deep Dive)

## ÌæØ Learning Objectives

- Understand conditional type syntax (ternary for types)
- Distributive conditional types
- infer keyword for type extraction
- Real-world conditional patterns
- Type-safe function overloading with conditionals

---

## Ì≥ù Key Terms

- **Conditional Type**: Ternary operator for types (`T extends U ? X : Y`)
- **Distributive**: How unions distribute across conditionals
- **infer**: Extract types from complex structures
- **Type Guard**: Using conditionals to narrow types

---

## Ì¥Ñ Basic Conditional Types

Conditional types are ternary operators for types:

```typescript
// Simple conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;        // true
type B = IsString<42>;              // false

// Conditional with type manipulation
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;       // string
type Num = Flatten<number>;         // number

// Nested conditionals
type GetReturnType<T> = T extends (...args: any[]) => infer R 
  ? R 
  : T extends Promise<infer U>
  ? U
  : T;

type A = GetReturnType<() => string>;              // string
type B = GetReturnType<Promise<number>>;           // number
type C = GetReturnType<() => Promise<boolean>>;    // boolean
```

---

## Ì¥Ä Distributive Conditional Types

When conditionals apply to unions, they distribute:

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

// Distributes over union
type Result = Flatten<string[] | number[]>;
// = Flatten<string[]> | Flatten<number[]>
// = string | number

// Extract from union
type StringOrNumber = string | number;
type OnlyString<T> = T extends string ? T : never;

type Result2 = OnlyString<StringOrNumber>;  // string (number becomes never)
type Result3 = OnlyString<string | boolean>;  // string
```

---

## ÌæØ The infer Keyword

Extract types from complex structures:

```typescript
// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type A = ArrayElement<string[]>;    // string
type B = ArrayElement<number[]>;    // number

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = ReturnType<() => string>;              // string
type B = ReturnType<(x: number) => boolean>;    // boolean

// Extract promise value
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>;   // string
type B = Unwrap<number>;             // number

// Extract from object
type GetId<T> = T extends { id: infer Id } ? Id : never;

type A = GetId<{ id: string; name: string }>;    // string
type B = GetId<{ id: number; data: any }>;       //  number
```

---

## Ì≤° Real-World Patterns

### Pattern 1: API Response Handler

```typescript
// Handle different response types
type ApiResponse<T> = 
  T extends Promise<infer U> ? U :
  T extends () => infer R ? R :
  T;

// Usage
type UserPromise = ApiResponse<Promise<{ id: number; name: string }>>;
// { id: number; name: string }

type UserFunc = ApiResponse<() => User>;
// User
```

### Pattern 2: Type-Safe Event Emitter

```typescript
type EventMap = {
  'user-created': { id: string; name: string };
  'user-deleted': { id: string };
  'post-published': { title: string; content: string };
};

// Extract event type
type EventPayload<K extends keyof EventMap> = EventMap[K];

class EventEmitter {
  on<K extends keyof EventMap>(
    event: K,
    callback: (payload: EventPayload<K>) => void
  ) {
    // ...
  }
}

const emitter = new EventEmitter();

emitter.on('user-created', (payload) => {
  // payload: { id: string; name: string }
});

emitter.on('user-deleted', (payload) => {
  // payload: { id: string }
});
```

---

## Ì≥ö Resources

- [TypeScript Handbook: Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

---

## ‚úÖ Checklist

- [ ] Understand conditional type syntax
- [ ] Know how distributive works
- [ ] Can use infer to extract types
- [ ] Apply to real-world patterns
