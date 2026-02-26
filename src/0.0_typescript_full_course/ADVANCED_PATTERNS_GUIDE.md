# Advanced TypeScript Patterns & Real-World Applications

This comprehensive guide covers advanced patterns and real-world applications that complement the main course.

## Learning Objectives

- Master advanced type patterns
- Understand protocol-oriented design
- Learn when to use advanced features
- Apply patterns to real projects
- Avoid common anti-patterns

---

## Part 1: Type-Level Programming

### Recursive Types

```typescript
// Tree structure with recursive types
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};

const binaryTree: Tree<number> = {
  value: 1,
  left: { value: 2 },
  right: { value: 3, left: { value: 4 } }
};

// Recursive type computation
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type A = Flatten<[[[[string]]]]; // string
```

### Branded Types

```typescript
// Create unique types at compile-time only
type UserId = string & { readonly brand: "UserId" };
type ProductId = string & { readonly brand: "ProductId" };

function userId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): void {
  // Can only pass UserId, not string or ProductId
}

const uid = userId("123");
const pid = "456" as ProductId;

getUser(uid);  // OK
getUser(pid);  // Error
```

### Phantom Types

```typescript
// Types that don't affect runtime
type Sealed<T> = T & { readonly __sealed: true };
type Validated<T> = T & { readonly __validated: true };

function validate<T>(data: T): Validated<T> {
  // Validation logic
  return data as Validated<T>;
}

function process<T>(data: Validated<T>): void {
  // Type system ensures validation happened
}

const raw = { email: "a@b.com" };
// process(raw);  // Error: not validated

const validated = validate(raw);
process(validated);  // OK
```

---

## Part 2: Protocol Design

### Type-Safe APIs

```typescript
// Specify exact protocol contract
interface HttpHandler {
  handle(request: HttpRequest): Promise<HttpResponse>;
}

interface HttpRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
}

interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

// Implementation must match exactly
class UserHandler implements HttpHandler {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    if (request.method !== "POST") {
      return { status: 405, headers: {}, body: "Not Allowed" };
    }
    return { status: 200, headers: {}, body: {} };
  }
}
```

### Builder Protocol

```typescript
// Type-safe builder with protocol
interface Builder<T> {
  build(): T;
}

interface ConfigBuilder extends Builder<Config> {
  withHost(host: string): ConfigBuilder;
  withPort(port: number): ConfigBuilder;
  withAuth(enabled: boolean): ConfigBuilder;
}

class ConfigBuilderImpl implements ConfigBuilder {
  private settings: Partial<Config> = {};

  withHost(host: string): ConfigBuilder {
    this.settings.host = host;
    return this;
  }

  withPort(port: number): ConfigBuilder {
    this.settings.port = port;
    return this;
  }

  withAuth(enabled: boolean): ConfigBuilder {
    this.settings.authEnabled = enabled;
    return this;
  }

  build(): Config {
    return this.settings as Config;
  }
}
```

---

## Part 3: Advanced Generic Patterns

### Higher-Ranked Types

```typescript
// Function that works with any type
type ForAll<F> = {
  apply<T>(value: T): F;
};

const identity: ForAll<unknown> = {
  apply: <T,>(value: T) => value
};

// Practical: Type-safe map
function mapValues<T, U>(
  obj: Record<string, T>,
  transform: (value: T) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key in obj) {
    result[key] = transform(obj[key]);
  }
  return result;
}
```

### Constraint-Based Polymorphism

```typescript
// Constraints enable type-safe polymorphism
type NumericValue = number | bigint | { valueOf(): number };

function add<T extends NumericValue>(a: T, b: T): T {
  return ((a as any).valueOf() + (b as any).valueOf()) as T;
}

add(5, 10);           // OK
add(5n, 10n);         // OK
add({ valueOf: () => 5 }, { valueOf: () => 10 });  // OK
// add("5", "10");    // Error
```

---

## Part 4: Avoiding Anti-Patterns

### Anti-Pattern: Overusing `any`

```typescript
// BAD: Type information lost
function process(data: any): any {
  return data.property.nested.value;
}

// GOOD: Progressive typing
function process<T extends Record<string, any>>(data: T): T["property"] {
  return data.property;
}
```

### Anti-Pattern: Excessive Union Types

```typescript
// BAD: Hard to use
type Response = 
  | { type: "success"; data: unknown }
  | { type: "error"; message: string }
  | { type: "timeout"; retryAfter: number };

// GOOD: Discriminated unions
type Response = 
  | { type: "success"; data: unknown }
  | { type: "error"; message: string }
  | { type: "timeout"; retryAfter: number };

function handle(response: Response): void {
  if (response.type === "success") {
    console.log(response.data);
  } else if (response.type === "error") {
    console.log(response.message);
  } else {
    console.log(response.retryAfter);
  }
}
```

---

## Part 5: Performance Patterns

### Lazy Evaluation

```typescript
// Defer computation until needed
class LazyValue<T> {
  private _value: T | undefined;
  private computed = false;

  constructor(private compute: () => T) {}

  get value(): T {
    if (!this.computed) {
      this._value = this.compute();
      this.computed = true;
    }
    return this._value!;
  }
}

// Usage
const expensive = new LazyValue(() => {
  console.log("Computing...");
  return 42;
});

// Nothing computed yet
console.log(expensive.value);  // "Computing..." then 42
console.log(expensive.value);  // 42 (cached)
```

### Memoization Type

```typescript
interface Memoized<T> {
  (arg: string): T;
  clear(): void;
}

function memoize<T>(fn: (arg: string) => T): Memoized<T> {
  const cache = new Map<string, T>();

  const memoized = (arg: string): T => {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };

  memoized.clear = () => cache.clear();
  return memoized;
}
```

---

## Part 6: Testing Advanced Patterns

```typescript
// Type-safe test builder
class TestBuilder<T> {
  private value: T;

  constructor(initial: T) {
    this.value = initial;
  }

  setup(fn: (val: T) => T): TestBuilder<T> {
    this.value = fn(this.value);
    return this;
  }

  assert(predicate: (val: T) => boolean, message: string): void {
    if (!predicate(this.value)) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
}

// Usage
new TestBuilder({ count: 0 })
  .setup(obj => ({ ...obj, count: 5 }))
  .setup(obj => ({ ...obj, count: obj.count * 2 }))
  .assert(obj => obj.count === 10, "Count should be 10");
```

---

## Part 7: Real-World Patterns in Practice

### Configuration Management

```typescript
interface ConfigSpec {
  database: {
    host: string;
    port: number;
    ssl: boolean;
  };
  api: {
    timeout: number;
    retries: number;
  };
}

const defaultConfig: ConfigSpec = {
  database: { host: "localhost", port: 5432, ssl: false },
  api: { timeout: 5000, retries: 3 }
};

function mergeConfig(
  base: ConfigSpec,
  overrides: Partial<ConfigSpec>
): ConfigSpec {
  return {
    database: { ...base.database, ...overrides.database },
    api: { ...base.api, ...overrides.api }
  };
}
```

### Event Bus

```typescript
type EventMap = {
  "user:created": { userId: string };
  "user:deleted": { userId: string };
  "order:placed": { orderId: string; total: number };
};

class EventBus {
  private listeners = new Map<string, Function[]>();

  on<K extends keyof EventMap>(
    event: K,
    listener: (data: EventMap[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }
}

// Type-safe usage
const bus = new EventBus();

bus.on("user:created", (data) => {
  console.log(`User created: ${data.userId}`);
});

bus.emit("user:created", { userId: "123" });
// bus.emit("user:created", { orderId: "456" });  // Error!
```

---

## Checklist

- [ ] Understand recursive and branded types
- [ ] Know phantom types
- [ ] Implement protocol-based design
- [ ] Use constraint-based polymorphism
- [ ] Avoid common anti-patterns
- [ ] Apply performance patterns
- [ ] Implement event buses and configuration
