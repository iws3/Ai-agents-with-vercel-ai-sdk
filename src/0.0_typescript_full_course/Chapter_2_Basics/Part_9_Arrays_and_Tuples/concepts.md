# Part 9: Arrays and Tuples (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- TypeScript typed arrays and their capabilities
- Tuples and when to use them
- Readonly arrays and mutability
- Optional and rest elements in tuples
- Array methods and type inference
- Real-world applications in data processing
- Modern array patterns and best practices

---

## 📝 Key Terms

- **Array Type**: A collection of elements of the same type (e.g., `number[]`)
- **Tuple**: Fixed-length array with specific types at each position
- **Readonly Array**: Array that can't be modified
- **Array Methods**: Type-safe map, filter, reduce, etc.
- **Rest Elements**: Variable-length tuple endings (`...T[]`) 
- **Optional Elements**: Elements that may or may not exist (`T?`)

> **Beginner Note** 🎓: Arrays hold multiple values of one type. Tuples hold fixed-length collections of potentially different types. Strings are arrays of characters!

---

## 📚 Arrays: Collections of One Type

### Basic Typed Arrays

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: string[] = ["Alice", "Bob", "Charlie"];
let booleans: boolean[] = [true, false, true];
let dates: Date[] = [new Date(), new Date()];

// Alternative syntax (less common)
let items: Array<number> = [1, 2, 3];
```

**Reading this**: "numbers is an array of numbers" - can only contain numbers, no strings!

### Array Initialization

```typescript
// Empty array - must specify type
const empty: number[] = [];
for (let i = 0; i < 5; i++) {
  empty.push(i);  // ✅ OK - push numbers
}

// Type inference with initial values
const inferred = [1, 2, 3];           // Type: number[]
const mixed = [1, "hello"];           // Type: (number | string)[]
const strings = ["a", "b"];           // Type: string[]

// Push wrong type
const nums: number[] = [1, 2];
nums.push("three");                   // ❌ ERROR: string not assignable
```

### Array Methods (Type Safe)

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// ✅ Type-safe methods
numbers.push(6);                 // Add element
numbers.pop();                   // Remove last
numbers.slice(0, 3);            // [1, 2, 3]
numbers.map(x => x * 2);        // [2, 4, 6, 8, 10]
numbers.filter(x => x > 2);     // [3, 4, 5]
numbers.some(x => x > 4);       // true
numbers.every(x => x > 0);      // true
numbers.find(x => x === 3);     // 3
numbers.indexOf(2);             // 1

// ❌ Type errors caught
numbers.push("six");            // ERROR: string not assignable
const result = numbers.map(x => x.toUpperCase());  // ERROR: numbers don't have toUpperCase
```

### Using Unknown Types in Arrays

```typescript
// When you don't know the type - use union or any (last resort)
let mixed: (number | string | boolean)[] = [1, "hello", true];

// When really unknown, use any (but avoid!)
let anything: any[] = [1, "hello", true, { id: 1 }];

// Better: use unknown with type guards
const data: unknown[] = [1, "hello", true];
data.forEach(item => {
  if (typeof item === "number") {
    console.log(item.toFixed(2));
  }
});
```

### Array of Objects

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];

// Type-safe operations
users.push({
  id: 3,
  name: "Charlie",
  email: "charlie@example.com"
});

// IDE provides autocomplete for properties
const firstUser = users[0];
console.log(firstUser.name);   // ✅ Works, name exists
// console.log(firstUser.age);  // ❌ ERROR: no age property
```

---

## 🎯 Tuples: Fixed-Length Collections

A **tuple** is an array with fixed length and specific types at each position.

### Basic Tuples

```typescript
// Tuple: exactly 2 elements [string, number]
type Coordinate = [number, number];
const point: Coordinate = [10, 20];           // ✅ OK
const point2: Coordinate = [15, 25];          // ✅ OK
const badPoint: Coordinate = [10];            // ❌ ERROR: needs 2 elements
const wrongType: Coordinate = ["10", 20];     // ❌ ERROR: first must be number

// Another tuple
type WebResponse = [number, string];
const response: WebResponse = [200, "OK"];    // ✅ OK
const bad: WebResponse = ["200", "OK"];       // ❌ ERROR: first must be number
```

### Tuples with Named Elements

```typescript
// More readable with labels
type User = [id: number, name: string, email: string];

const user: User = [1, "Alice", "alice@example.com"];

// Labels appear in IDE
// user[0]  - id
// user[1]  - name
// user[2]  - email

// Access by position
console.log(user[0]);    // 1 (id)
console.log(user[1]);    // "Alice" (name)
```

### Tuples with Different Types

```typescript
// Success: [status, data]
type Success = [true, Record<string, unknown>];

// Error: [status, message]
type Error = [false, string];

// Now each branch is clear
function handle(response: Success | Error) {
  if (response[0] === true) {
    console.log(response[1]);  // data exists
  } else {
    console.log(response[1]);  // message exists
  }
}

handle([true, { id: 1, name: "Alice" }]);  // ✅ OK
handle([false, "Not found"]);              // ✅ OK
handle([true, "error message"]);           // ❌ ERROR: wrong data type
```

---

## 🔒 Readonly Arrays and Tuples

```typescript
// Readonly array - can't modify
type ReadonlyNumbers = readonly number[];
type ReadonlyTuple = readonly [string, number];

const nums: ReadonlyNumbers = [1, 2, 3];
nums.push(4);                    // ❌ ERROR: cannot modify
nums[0] = 10;                    // ❌ ERROR: cannot modify

// Can read but not write
console.log(nums[0]);            // ✅ OK - read is fine
console.log(nums.length);        // ✅ OK - read properties

// Methods that don't mutate work
const doubled = nums.map(x => x * 2);   // ✅ OK - map doesn't mutate
const sliced = nums.slice(0, 2);        // ✅ OK - slice doesn't mutate

// Mutation methods don't work
nums.sort();                     // ❌ ERROR: can't mutate
nums.reverse();                  // ❌ ERROR: can't mutate
```

---

## ⭐ Optional and Rest Elements

### Optional Elements in Tuples

```typescript
// Last 2 elements are optional
type Response = [status: number, data?: Record<string, unknown>, timestamp?: Date];

const r1: Response = [200];                          // ✅ OK
const r2: Response = [200, { id: 1 }];              // ✅ OK
const r3: Response = [200, { id: 1 }, new Date()];  // ✅ OK
const r4: Response = [200, new Date(), { id: 1 }];  // ❌ ERROR: wrong order

// Must come after required elements
type BadTuple = [data?: string, id: number];  // ❌ ERROR: optional before required
```

### Rest Elements (Variable Length)

```typescript
// Rest element: array continues with same type
type StringAndNumbers = [string, ...number[]];

const a: StringAndNumbers = ["count", 1, 2, 3, 4, 5];         // ✅ OK
const b: StringAndNumbers = ["values"];                       // ✅ OK
const c: StringAndNumbers = ["name", 10];                     // ✅ OK
const d: StringAndNumbers = [123, 1, 2, 3];                   // ❌ ERROR: first must be string

// Multiple rest elements (TypeScript 4.4+)
type Mixed = [id: number, ...strings: string[], count: number];
const x: Mixed = [1, "a", "b", "c", 10];      // ✅ OK
```

---

## 🔀 Array vs Tuple Comparison

| Aspect | Array | Tuple |
|--------|-------|-------|
| **Length** | Variable | Fixed |
| **Types** | All same | Can vary by position |
| **Syntax** | `T[]` | `[T1, T2, T3]` |
| **Access** | By index (same type) | By index (type varies) |
| **Use Case** | Collection of items | Return multiple values |
| **Example** | `number[]` | `[string, number]` |

---

## 📚 Real-World Patterns

### Pattern 1: API Response Tuples

```typescript
// Simple success/error pattern
type ApiResult<T> = [success: true, data: T] | [success: false, error: string];

async function fetchUser(id: string): Promise<ApiResult<User>> {
  try {
    const data = await fetch(`/api/users/${id}`);
    const user = await data.json();
    return [true, user];  // Success tuple
  } catch (error) {
    return [false, error.message];  // Error tuple
  }
}

// Usage
const [success, result] = await fetchUser("123");
if (success) {
  console.log(result.name);    // result is User
} else {
  console.log(result);         // result is string (error message)
}
```

### Pattern 2: Utility Functions Returning Tuples

```typescript
// Parse function returns [value, remaining]
function parseNumber(input: string): [number, string] | null {
  const match = input.match(/^(\d+)/);
  if (!match) return null;
  const num = parseInt(match[1]);
  const rest = input.slice(match[1].length);
  return [num, rest];
}

const result = parseNumber("42 days");
if (result) {
  const [number, remaining] = result;
  console.log(number, remaining);  // 42, " days"
}
```

### Pattern 3: React Hook Pattern

```typescript
// Similar to useState pattern [value, setter]
type UseStateReturn<T> = [value: T, setValue: (v: T) => void];

function useCounter(): UseStateReturn<number> {
  let count = 0;
  return [
    count,
    (newValue) => { count = newValue; }
  ];
}

const [counter, setCounter] = useCounter();
```

### Pattern 4: Entry Processing

```typescript
// Processing key-value pairs
type Entry<K, V> = [key: K, value: V];
type Entries<K, V> = Entry<K, V>[];

function processEntries<K extends string, V>(entries: Entries<K, V>) {
  entries.forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

const data: Entries<"name" | "age", string | number> = [
  ["name", "Alice"],
  ["age", 30]
];

processEntries(data);
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Confusing Array and Tuple Syntax

```typescript
// ❌ WRONG - This is an array
type WrongTuple = [number];  // Actually a single-element array!

// ✅ CORRECT - This is a tuple with 3 elements
type CorrectTuple = [number, string, boolean];
```

### Pitfall 2: Wrong Element Order

```typescript
type Person = [name: string, age: number, email: string];

const person: Person = [
  30,              // ❌ ERROR: should be string (name)
  "Alice",
  "alice@example.com"
];

// ✅ CORRECT
const person: Person = [
  "Alice",
  30,
  "alice@example.com"
];
```

### Pitfall 3: Forgetting Type Guards with Unknown Arrays

```typescript
// ❌ UNSAFE - Assumes all elements are numbers
const data: unknown[] = [1, 2, "3", 4];
const doubled = data.map(x => x * 2);  // ❌ ERROR: might be string

// ✅ SAFE - Check types first
const doubled = data
  .filter(x => typeof x === "number")
  .map(x => x * 2);
```

### Pitfall 4: Mutation in Readonly Arrays

```typescript
// ❌ WRONG - Can't mutate readonly
const nums: readonly number[] = [1, 2, 3];
nums.push(4);      // ERROR
nums[0] = 10;      // ERROR

// ✅ CORRECT - Create new array
const newNums = [...nums, 4];  // [1, 2, 3, 4]
```

---

## 🏆 Best Practices

1. **Type all arrays** - don't use implicit `any[]`
2. **Use tuples** for fixed-length data (return values, coordinates)
3. **Use readonly** when data shouldn't change
4. **Check lengths** if tuple might be incomplete
5. **Prefer named tuple elements** for clarity
6. **Use type guards** with unknown arrays

---

## ✅ Checklist

- [ ] Can create typed arrays
- [ ] Understand array methods are type-safe
- [ ] Know the difference between arrays and tuples
- [ ] Can create fixed-length tuples
- [ ] Know when to use optional elements
- [ ] Understand readonly arrays
- [ ] Comfortable with tuple patterns
- [ ] Know real-world applications
