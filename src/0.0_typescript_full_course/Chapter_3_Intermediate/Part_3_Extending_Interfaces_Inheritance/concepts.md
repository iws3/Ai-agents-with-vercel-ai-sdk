# Part 3: Extending Interfaces & Inheritance (Intermediate Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- How to extend interfaces for code reuse
- Interface inheritance hierarchies
- Multiple interface inheritance (mixins)
- Interface composition and type merging
- Overriding and extending properties
- Real-world patterns for extensible APIs
- When to use extends vs intersection types

---

## 📝 Key Terms

- **Interface Inheritance**: Extending one interface to create a more specific type
- **extends**: Keyword for inheriting from one or more interfaces
- **Interface Composition**: Combining multiple interfaces into one
- **Mixin Pattern**: Using multiple inheritance to combine behaviors
- **Declaration Merging**: TypeScript combining multiple interface declarations with the same name
- **Base Interface**: The parent interface being extended
- **Override**: Redefining a property with a more specific type

---

## 🔄 Basic Interface Inheritance

Interfaces extend other interfaces to reuse properties:

```typescript
// Base interface
interface Animal {
  name: string;
  age: number;
}

// Dog extends Animal - gains all Animal properties
interface Dog extends Animal {
  breed: string;
  isGoodBoy: boolean;
}

// Dog must have all Animal properties plus its own
const myDog: Dog = {
  name: "Buddy",
  age: 5,
  breed: "Golden Retriever",
  isGoodBoy: true  // ✅ All required properties
};

// ❌ Missing inherited property
const badDog: Dog = {
  breed: "Labrador",
  isGoodBoy: true
};  // ERROR: missing 'name' and 'age' from Animal interface
```

**Benefits:**
- DRY (Don't Repeat Yourself) - avoid duplicating properties
- Build hierarchies from specific to general
- Easier maintenance - change base once, affects all children

---

## 🌳 Multi-Level Inheritance

Create hierarchies with multiple levels:

```typescript
// Level 1: Most general
interface LivingThing {
  alive: boolean;
}

// Level 2: More specific
interface Animal extends LivingThing {
  name: string;
  age: number;
}

// Level 3: Even more specific
interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// Level 4: Very specific
interface ServiceDog extends Dog {
  certification: string;
  handler: string;
}

const serviceDog: ServiceDog = {
  // From LivingThing
  alive: true,
  // From Animal
  name: "Max",
  age: 3,
  // From Dog
  breed: "Golden Retriever",
  bark() { console.log("Woof!"); },
  // From ServiceDog
  certification: "ADA",
  handler: "John"
};
```

---

## 🔗 Multiple Interface Inheritance

Inherit from multiple interfaces (mixin pattern):

```typescript
// Two separate behaviors
interface Swimmer {
  swim(): void;
}

interface Flyer {
  fly(): void;
}

// Combine both behaviors
interface Duck extends Swimmer, Flyer {
  quack(): void;
}

const mallard: Duck = {
  swim() {
    console.log("Swimming in the pond");
  },
  fly() {
    console.log("Flying south for winter");
  },
  quack() {
    console.log("Quack!");
  }
};

mallard.swim();   // ✅ Swimmer behavior
mallard.fly();    // ✅ Flyer behavior
mallard.quack();  // ✅ Duck-specific behavior
```

**Pattern use cases:**
- Combine unrelated behaviors
- Large feature sets split into modules
- Mixin-based architecture

---

## ✏️ Overriding Properties

Extend an interface while making properties more specific:

```typescript
// Base interface with general type
interface Vehicle {
  wheels: number | string;
  color: string;
}

// Override wheels to be more specific (only numbers for cars)
interface Car extends Vehicle {
  wheels: 4;  // ✅ Overrides to more specific type
  doors: number;
}

const car: Car = {
  wheels: 4,    // ✅ Must be exactly 4 (not 3 or 5)
  color: "red",
  doors: 4
};

const badCar: Car = {
  wheels: 3,    // ❌ ERROR: Type '3' is not assignable to type '4'
  color: "blue",
  doors: 4
};

// More advanced: override with union
interface Animal {
  sound: string;
}

interface Dog extends Animal {
  sound: "bark" | "growl" | "whine";  // ✅ More specific than string
}

const dog: Dog = {
  sound: "bark"  // ✅ Must be one of the allowed sounds
};
```

---

## 🔀 Interface Composition with Intersection Types

Combine types using intersection (`&`):

```typescript
// Define separate concerns
type Named = {
  name: string;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Active = {
  isActive: boolean;
};

// Compose them
type User = Named & Timestamped & Active;

const user: User = {
  name: "Alice",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true
};

// Or create new types from compositions
type Entity = Named & Timestamped;
type Document = Entity & {
  content: string;
  authorId: string;
};

const doc: Document = {
  name: "My Article",
  createdAt: new Date(),
  updatedAt: new Date(),
  content: "Hello world",
  authorId: "user_123"
};
```

**extends vs Intersection:**
- `extends`: For interfaces, clearer intent
- `&`: For types, more flexible composition

---

## 🔭 Declaration Merging

TypeScript merges multiple interface declarations with the same name:

```typescript
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number;
}

interface Config {
  retries: number;
}

// All three merge into one Config
const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};
```

**Use cases:**
- Extending global types (Window, Express Request, etc.)
- Plugin systems
- Adding properties from different modules

### Real Example: Extending Express

```typescript
// Original Express Request (simplified)
interface Request {
  method: string;
  path: string;
}

// Your app extends it
declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId: string;
    }
  }
}

// Now all requests have user and requestId
const handler = (req: Request) => {
  console.log(req.requestId);  // Available on all requests
};
```

---

## 🎨 Real-World Patterns

### Pattern 1: Plugin Architecture

```typescript
// Core interface
interface Plugin {
  name: string;
  version: string;
  init(): void;
}

// Plugin categories extend core
interface ThemePlugin extends Plugin {
  applyTheme(name: string): void;
}

interface TranslationPlugin extends Plugin {
  translate(key: string, lang: string): string;
}

// Concrete implementations
const darkTheme: ThemePlugin = {
  name: "Dark Theme",
  version: "1.0.0",
  init() {
    console.log("Initializing dark theme");
  },
  applyTheme(name: string) {
    document.body.classList.add(`theme-${name}`);
  }
};
```

### Pattern 2: API Response Hierarchy

```typescript
// Base response
interface ApiResponse {
  status: number;
  timestamp: Date;
}

// Success response
interface SuccessResponse<T> extends ApiResponse {
  success: true;
  data: T;
}

// Error response
interface ErrorResponse extends ApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Combined type
type ApiResult<T> = SuccessResponse<T> | ErrorResponse;

async function fetchUser(id: string): Promise<ApiResult<User>> {
  try {
    // Return success
    return {
      status: 200,
      timestamp: new Date(),
      success: true,
      data: { id, name: "Alice" }
    };
  } catch (error) {
    // Return error
    return {
      status: 500,
      timestamp: new Date(),
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message
      }
    };
  }
}

// Type-safe usage
const result = await fetchUser("123");
if (result.success) {
  console.log(result.data.name);  // ✅ data exists
} else {
  console.log(result.error.message);  // ✅ error exists
}
```

### Pattern 3: Entity Timestamp Inheritance

```typescript
// All database entities have these fields
interface Entity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Specific entity types
interface User extends Entity {
  username: string;
  email: string;
}

interface BlogPost extends Entity {
  title: string;
  content: string;
  authorId: string;
}

interface Comment extends Entity {
  text: string;
  authorId: string;
  postId: string;
}

// Generic repository pattern
class Repository<T extends Entity> {
  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    // Implementation
    return {} as T;
  }

  getById(id: string): T | null {
    // Implementation
    return null;
  }

  update(id: string, changes: Partial<T>): T {
    // Implementation
    return {} as T;
  }
}

// Repositories for specific types
const userRepo = new Repository<User>();
const postRepo = new Repository<BlogPost>();
```

### Pattern 4: Middleware Chain

```typescript
// Base middleware contract
interface Middleware {
  name: string;
  execute(request: Request, response: Response): Promise<void>;
}

// Authentication middleware extends base
interface AuthMiddleware extends Middleware {
  authenticate(token: string): Promise<User>;
}

// Rate limiting middleware extends base
interface RateLimitMiddleware extends Middleware {
  checkLimit(userId: string): boolean;
}

// Router uses any middleware
class Router {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  async execute(request: Request, response: Response) {
    for (const middleware of this.middlewares) {
      await middleware.execute(request, response);
    }
  }
}
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Conflicting Properties

```typescript
interface A {
  value: string;
}

interface B {
  value: number;  // Different type!
}

// ❌ ERROR: Conflicting property types
interface C extends A, B {
  // ERROR: value is both string and number
}

// ✅ SOLUTION: Override with union
interface C extends A {
  value: string | number;
}
```

### Pitfall 2: Over-Inheritance

```typescript
// ❌ BAD: Too many levels, hard to understand
interface A { a: string; }
interface B extends A { b: string; }
interface C extends B { c: string; }
interface D extends C { d: string; }
interface E extends D { e: string; }

// ✅ GOOD: Use composition
type Entity = { id: string };
type Named = { name: string };
type Timestamped = { createdAt: Date };

type User = Entity & Named & Timestamped & { email: string };
```

### Pitfall 3: Forgetting Optional When Extending

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

interface AdvancedConfig extends Config {
  // If you make these optional, Config users might miss them
  retries?: number;  // ❌ Inconsistent with base
  cacheSize?: number;
}

// Better: If optional, indicate in base
interface Config {
  apiUrl: string;
  timeout: number;
  retries?: number;  // Optional for everyone
}

interface AdvancedConfig extends Config {
  cacheSize?: number;
}
```

---

## 🌟 Best Practices

```typescript
// ✅ GOOD: Clear inheritance hierarchy
interface Entity {
  readonly id: string;
  readonly createdAt: Date;
}

interface Named {
  name: string;
}

interface User extends Entity, Named {
  email: string;
}

// ✅ GOOD: Use composition for unrelated concerns
type Logger = {
  log: (message: string) => void;
};

type Parser = {
  parse: (input: string) => unknown;
};

type Service = Logger & Parser & { name: string };

// ❌ BAD: Unclear hierarchy
interface A { x: string; }
interface B extends A { y: string; }
interface C extends B { z: string; }
// What does this hierarchy mean?

// ✅ GOOD: Meaningful hierarchy
interface Component {
  render(): JSX.Element;
}

interface InteractiveComponent extends Component {
  onClick: (e: Event) => void;
}

interface FormComponent extends InteractiveComponent {
  submit: (data: unknown) => void;
}
```

---

## 📚 Resources

- [TypeScript Handbook: Interface Inheritance](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html#interfaces)
- [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [Intersection Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html#union-types)

---

## ✅ Checklist

- [ ] Understand basic interface inheritance
- [ ] Create multi-level inheritance hierarchies
- [ ] Use multiple interface inheritance
- [ ] Override properties with more specific types
- [ ] Use intersection types for composition
- [ ] Understand declaration merging
- [ ] Know real-world patterns (plugins, API responses, etc.)
- [ ] Able to choose between extends and intersection
