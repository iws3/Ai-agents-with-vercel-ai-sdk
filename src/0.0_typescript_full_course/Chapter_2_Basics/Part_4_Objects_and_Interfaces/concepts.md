# Part 4: Objects and Interfaces (Beginner Deep Dive)

## 🎯 Learning Objectives

After this part, you'll understand:
- What objects are and how to type them comprehensively
- How to define interfaces and when to use them
- Optional and readonly properties and their implications
- Nested objects and complex structures with deep types
- Interface inheritance, composition, and extension patterns
- Index signatures for dynamic properties with type safety
- Difference between interface and type (preview)
- Object literal typing and structural compatibility
- When to use interfaces vs types in different scenarios

---

## 📝 Key Terms

- **Object**: Collection of key-value pairs (`{key: value}`)
- **Interface**: Contract defining what properties an object must have
- **Property**: Individual key-value pair in an object
- **Optional Property**: Property marked with `?` that doesn't need to exist
- **Readonly Property**: Property that can't be modified after creation
- **Inheritance**: One interface extending another to reuse properties
- **Index Signature**: Allows dynamic property names with type safety
- **Structural Typing**: TypeScript checking shape compatibility, not identity

---

## 🏗️ Objects and Interfaces Fundamentals

### Understanding Objects

Objects are fundamental in JavaScript and TypeScript. They group related data:

```typescript
// ❌ WARNING: Without types, anything goes
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Is user.phone allowed? Is user.age a number or string?
// TypeScript can't help without more info!

// ✅ GOOD: Define the shape with an interface
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
```

### Defining Interfaces

An interface is a blueprint for an object's structure:

```typescript
interface User {
  name: string;      // Must be a string
  age: number;       // Must be a number
  email: string;     // Must be a string
}
```

**What this means:**
- An object is a valid `User` if it has exactly these properties with the right types
- Missing any property = ERROR
- Wrong type for a property = ERROR
- Extra properties = ERROR (by default)

---

## 🔧 Optional Properties

Not everything needs to exist on every object:

```typescript
interface UserProfile {
  username: string;    // Required
  email: string;       // Required
  bio?: string;        // Optional - may or may not exist
  website?: string;    // Optional
  avatar?: string;     // Optional
}

// ✅ OK - only required properties
const user1: UserProfile = {
  username: "alice_dev",
  email: "alice@example.com"
};

// ✅ OK - some optional properties
const user2: UserProfile = {
  username: "bob_dev",
  email: "bob@example.com",
  bio: "Senior engineer",
  website: "bob.dev"
};

// ✅ OK - all properties
const user3: UserProfile = {
  username: "charlie_dev",
  email: "charlie@example.com",
  bio: "Junior developer",
  website: "charlie.dev",
  avatar: "https://..."
};

// ❌ ERROR - missing required 'email'
const user4: UserProfile = {
  username: "dave_dev"
};
```

**When to use optional:**
- User profile fields (many users skip bio, avatar, etc.)
- Configuration options (many users use defaults)
- API responses (some fields may be missing)

---

## 🔒 Readonly Properties

Some values should never change after creation:

```typescript
interface Config {
  readonly apiUrl: string;      // Can't change
  readonly version: string;     // Can't change
  timeout: number;              // Can change
  retries: number;              // Can change
}

const config: Config = {
  apiUrl: "https://api.example.com",
  version: "1.0.0",
  timeout: 5000,
  retries: 3
};

config.timeout = 10000;         // ✅ OK - not readonly
config.retries = 5;             // ✅ OK - not readonly
config.apiUrl = "https://...";  // ❌ ERROR - readonly property
config.version = "2.0.0";       // ❌ ERROR - readonly property
```

**Use readonly for:**
- Application constants
- Database IDs that shouldn't change
- Configuration that should be immutable
- Created/updated timestamps

---

## 📦 Nested Objects

Objects can contain other objects:

```typescript
interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface Person {
  name: string;
  email: string;
  address: Address;  // Address is another interface
  phone?: string;
}

const person: Person = {
  name: "Alice",
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "Portland",
    state: "OR",
    zipcode: "97201",
    country: "USA"
  },
  phone: "555-1234"
};

// Accessing nested properties
console.log(person.address.city);  // "Portland"
```

---

## 🔄 Interface Inheritance

Interfaces can extend other interfaces to reuse properties:

```typescript
// Base interface
interface Animal {
  name: string;
  age: number;
}

// Dog interface extends Animal - gets name and age automatically
interface Dog extends Animal {
  breed: string;
  weight: number;
}

// Using Dog requires all properties from both Animal and Dog
const buddy: Dog = {
  name: "Buddy",           // Required by Animal
  age: 5,                  // Required by Animal
  breed: "Golden Retriever",  // Required by Dog
  weight: 65               // Required by Dog
};
```

**Inheritance helps:**
- Avoid repeating common properties
- Create related types
- Build hierarchies

### Multiple Inheritance

An interface can extend multiple interfaces:

```typescript
interface Named {
  name: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Post extends Named, Timestamped {
  content: string;
  likes: number;
}

const post: Post = {
  name: "My First Blog Post",
  createdAt: new Date(),
  updatedAt: new Date(),
  content: "Hello world!",
  likes: 42
};
```

---

## 🔑 Index Signatures

When properties are dynamic or unknown upfront:

```typescript
// ❌ BAD - Can't use interface with unknown properties
interface Scores {
  alice: number;
  bob: number;
  charlie: number;
  // What about david? elena? new users?
}

// ✅ GOOD - Use index signature for dynamic properties
interface ScoreMap {
  [username: string]: number;  // Any string key can be a property
}

const scores: ScoreMap = {
  alice: 95,
  bob: 87,
  charlie: 92,
  david: 88,     // ✅ OK - username is a string
  elena: 99      // ✅ OK - username is a string
};

// Access with dynamic keys
console.log(scores["alice"]);    // 95
console.log(scores["david"]);    // 88
const user = "elena";
console.log(scores[user]);       // 99
```

**When to use index signatures:**
- HashMap/dictionary patterns
- Dynamic property names
- Configuration objects
- User-defined fields

---

## 🌐 Extra Properties

By default, TypeScript allows extra properties:

```typescript
interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  phone: "555-1234",   // ✅ OK - Extra property (allowed!)
  address: "..."       // ✅ OK - Extra property (allowed!)
};
```

But if you want strict checking:

```typescript
// ❌ When assigning inline, excess properties are caught
const user1: User = {
  name: "Alice",
  email: "alice@example.com",
  phone: "555-1234"  // ❌ ERROR: Object literal type has extra property 'phone'
};

// ✅ But if you already have an object...
const userData = {
  name: "Alice",
  email: "alice@example.com",
  phone: "555-1234"
};
const user2: User = userData;  // ✅ OK - Already an object
```

---

## 🎨 Real-World Examples

### E-Commerce: Product Interface

```typescript
interface Product {
  readonly id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  inStock: boolean;
  tags: string[];
  images: string[];
  specs?: {  // Optional nested object
    weight?: string;
    dimensions?: string;
    material?: string;
  };
  reviews?: {
    rating: number;
    count: number;
  };
}

const laptop: Product = {
  id: 101,
  name: "TypeScript Pro Laptop",
  description: "Perfect for coding",
  price: 1299.99,
  currency: "USD",
  inStock: true,
  tags: ["electronics", "computers", "laptops"],
  images: ["laptop1.jpg", "laptop2.jpg"],
  specs: {
    weight: "1.8kg",
    material: "Aluminum",
    dimensions: "13 inch"
  },
  reviews: {
    rating: 4.8,
    count: 247
  }
};
```

### Chat API: Message Types

```typescript
interface ChatMessage {
  readonly id: string;
  author: string;
  content: string;
  timestamp: Date;
  readonly createdAt: Date;
  editedAt?: Date;
  reactions?: {
    [emoji: string]: number;  // e.g., "👍": 5, "❤️": 3
  };
}

interface ChatRoom {
  readonly id: string;
  name: string;
  description?: string;
  members: string[];
  messages: ChatMessage[];
  readonly createdBy: string;
  readonly createdAt: Date;
}

const room: ChatRoom = {
  id: "room_123",
  name: "TypeScript Tutorials",
  description: "Learn TypeScript together",
  members: ["alice", "bob", "charlie"],
  messages: [
    {
      id: "msg_1",
      author: "alice",
      content: "What's the difference between type and interface?",
      timestamp: new Date(),
      createdAt: new Date(),
      reactions: {
        "👍": 3,
        "❤️": 1
      }
    }
  ],
  createdBy: "alice",
  createdAt: new Date()
};
```

---

## ⚠️ Common Mistakes

### Mistake 1: Typos in Property Names

```typescript
interface User {
  name: string;
  email: string;
}

// ❌ Wrong property name
const user: User = {
  name: "Alice",
  emial: "alice@example.com"  // Typo: 'emial' not 'email'
};  // ERROR: missing 'email'

// ✅ Correct
const user: User = {
  name: "Alice",
  email: "alice@example.com"
};
```

### Mistake 2: Wrong Property Type

```typescript
interface User {
  name: string;
  age: number;
}

// ❌ String instead of number
const user: User = {
  name: "Alice",
  age: "30"  // ERROR: string is not assignable to type number
};

// ✅ Correct type
const user: User = {
  name: "Alice",
  age: 30
};
```

### Mistake 3: Forgetting Optional Properties Are Optional!

```typescript
interface User {
  name: string;
  email?: string;
}

const user: User = {
  name: "Alice"
  // Email not provided - that's OK because it's optional!
};

// ✅ But we must check before using
if (user.email) {
  console.log(user.email.toLowerCase());  // Safe - checked first
}

console.log(user.email.toLowerCase());    // ❌ ERROR: email might be undefined
```

### Mistake 4: Mutating When Readonly

```typescript
interface Settings {
  readonly apiKey: string;
  timeout: number;
}

const settings: Settings = {
  apiKey: "secret-key",
  timeout: 5000
};

settings.timeout = 10000;      // ✅ OK
settings.apiKey = "new-key";   // ❌ ERROR: Cannot assign to readonly property
```

---

## 🌟 Best Practices

```typescript
// ✅ GOOD: Descriptive, focused interface
interface BlogPost {
  readonly id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  readonly createdAt: Date;
  updatedAt?: Date;
}

// ❌ BAD: Too generic, unclear
interface Data {
  value: any;
  info: any;
}

// ✅ GOOD: Use optional carefully
interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications?: boolean;
  emailFrequency?: "daily" | "weekly" | "never";
}

// ❌ BAD: Too many optionals makes contract unclear
interface WeirdInterface {
  a?: string;
  b?: number;
  c?: boolean;
  d?: string[];
  // What's actually required?
}
```

---

## 🏛️ Structural Typing Explained

TypeScript uses **structural typing** - types are compatible if they have matching shapes, not just names.

### Structural vs Nominal Typing

```typescript
// Two different interfaces with the same shape
interface User {
  id: number;
  name: string;
}

interface Person {
  id: number;
  name: string;
}

// Nominally: User and Person are different types
// Structurally: They're compatible!

const user: User = { id: 1, name: "Alice" };
const person: Person = user;  // ✅ OK! Shapes match

// This is the TypeScript way - no explicit declaration needed
```

### Duck Typing Example

```typescript
// Functions using structural typing
function printUser(user: { id: number; name: string }) {
  console.log(`User: ${user.name}`);
}

const user = { id: 1, name: "Alice", email: "alice@example.com" };
printUser(user);  // ✅ OK - user has required properties (extra is fine!)

// This is "duck typing": "If it walks like a duck, quacks like a duck..."
```

### Extra Properties Are OK

```typescript
interface Car {
  make: string;
  model: string;
}

const myCar: Car = {
  make: "Toyota",
  model: "Camry",
  year: 2024  // ❌ ERROR: Car doesn't have year property!
};

// BUT:
const carData = { make: "Toyota", model: "Camry", year: 2024 };
const car: Car = carData;  // ✅ OK! Extra properties ignored

// This "excess property checking" prevents typos in literals
```

### Preventing Unintended Compatibility

Sometimes you want stricter type checking. Use a "discriminator":

```typescript
// Without discriminator - might accidentally mix!
interface Admin {
  name: string;
  permissions: string[];
}

interface User {
  name: string;
  email: string;
}

// With discriminator - TypeScript catches mistake
interface AdminTyped {
  role: "admin";  // ← Discriminator
  name: string;
  permissions: string[];
}

interface UserTyped {
  role: "user";   // ← Different discriminator
  name: string;
  email: string;
}

// Now they're not compatible - much safer!
```

---

## 📚 Resources

- [TypeScript Handbook: Objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Objects in JavaScript (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

---

## ✅ Checklist

- [ ] Understand what an interface is
- [ ] Can define basic interfaces
- [ ] Know when properties are required vs optional
- [ ] Use readonly for immutable properties
- [ ] Work with nested objects
- [ ] Extend interfaces for reusability
- [ ] Use index signatures for dynamic properties
- [ ] Aware of literal vs dynamic property assignment
- [ ] Able to model real-world objects (products, users, etc.)

