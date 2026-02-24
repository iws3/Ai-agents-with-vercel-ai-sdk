# Chapter 1: Key Concepts Compared

## TypeScript vs Any

```typescript
// Using 'any' - No type safety
let data: any = getDataFromAPI();
console.log(data.name);        // ✗ What if name doesn't exist?
console.log(data.email);       // ✗ Unknown property
const result = data + 5;       // ✗ Could be string + number!

// Using TypeScript - Type Safe
interface ApiData {
  name: string;
  email: string;
  id: number;
}

let data: ApiData = getDataFromAPI();
console.log(data.name);        // ✓ Known property
console.log(data.email);       // ✓ Known property
const result = data.id + 5;    // ✓ Adding numbers, not string + number
```

## Type Annotation Comparison

```typescript
// Implicit (no annotation, TypeScript infers)
const name = "Alice";           // Inferred as: string
const age = 30;                 // Inferred as: number

// Explicit (you specify the type)
const name: string = "Alice";   // You declare it's string
const age: number = 30;         // You declare it's number

// When to use:
// - Use implicit for obvious types (literals)
// - Use explicit for function parameters, complex objects, return types
```

## Dynamic vs Static Typing

```typescript
// JavaScript (Dynamic) - Type checked at runtime
function add(a, b) {
  return a + b;
}

add(5, 10);        // 15 ✓
add("5", "10");    // "510" ✓ Allowed, unexpected result
add("5", 10);      // "510" ✓ Allowed, confusing

// TypeScript (Static) - Type checked before running
function add(a: number, b: number): number {
  return a + b;
}

add(5, 10);        // 15 ✓
add("5", "10");    // ✗ Error - strings not numbers
add("5", 10);      // ✗ Error - first parameter not number

// Result: TypeScript errors caught before anyone runs the code
```

## Compilation Approaches

```typescript
// Approach 1: Compile then Run
// File: src/hello.ts
console.log("Hello");

// Command: npm run build        // Creates dist/hello.js
// Command: npm start            // Runs dist/hello.js

// Approach 2: Direct with ts-node
// Command: npx ts-node src/hello.ts
// (Compiles and runs immediately, no dist/ folder)

// Approach 3: Watch + Run
// Terminal 1: npm run dev       // Watches for changes, auto-compiles
// Terminal 2: npm start         // Runs the code
```

## Type Checking Levels

```typescript
// Loose (many bugs slip through)
function process(data) {
  return data.value + 10;
}

// Better (some safety)
function process(data: any): number {
  return data.value + 10;
}

// Good (type-safe)
interface Data {
  value: number;
}

function process(data: Data): number {
  return data.value + 10;
}

// Excellent (with strict mode)
// All of the above PLUS:
// - Must handle null/undefined explicitly
// - Catch unused variables
// - All function return types specified
// - All parameters typed
```

## Project Size Suitability

```
Lines of Code │ Recommendation
──────────────┼────────────────────────────────────
< 100         │ Plain JavaScript OK
100 - 1000    │ TypeScript Nice-to-have
1000 - 10k    │ TypeScript Recommended
10k - 100k    │ TypeScript Essential
> 100k        │ TypeScript Mandatory

Type Safety Value = Project Size × Team Size
```

