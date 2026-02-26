# Part 1: Advanced Patterns (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- Builder pattern with fluent interfaces
- Singleton and factory patterns
- Repository pattern for data abstraction
- Observer pattern for event systems
- Strategy pattern for polymorphic behavior
- Type-safe pattern implementations

---

## Key Terms

- **Fluent Interface**: Method chaining for readable APIs
- **Repository Pattern**: Data abstraction layer
- **Factory Pattern**: Object creation abstraction
- **Observer Pattern**: Event subscriptions
- **Strategy Pattern**: Swappable behavior

---

## Builder Pattern with Fluent Interface

Create complex objects step-by-step with type safety:

```typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private limit?: number;
  private offset?: number;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  take(n: number): this {
    this.limit = n;
    return this;
  }

  skip(n: number): this {
    this.offset = n;
    return this;
  }

  build(): (items: T[]) => T[] {
    return (items: T[]) => {
      let result = items.filter(item =>
        this.filters.every(filter => filter(item))
      );

      if (this.offset) result = result.slice(this.offset);
      if (this.limit) result = result.slice(0, this.limit);

      return result;
    };
  }
}

// Usage with method chaining
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const query = new QueryBuilder<User>()
  .where(u => u.active)
  .where(u => u.age >= 18)
  .skip(10)
  .take(5)
  .build();

const users: User[] = [/* ... */];
const results = query(users);
```

---

## Repository Pattern

Abstract data access with a clean interface:

```typescript
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
}

class UserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");

    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

// Usage
class UserService {
  constructor(private repo: Repository<User>) {}

  async getActiveUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.repo.findAll();
    return users.find(u => u.email === email) ?? null;
  }
}
```

---

## Factory Pattern

Create objects with type-safe factory functions:

```typescript
interface Animal {
  speak(): string;
}

class Dog implements Animal {
  constructor(private name: string) {}
  speak(): string {
    return `${this.name} barks!`;
  }
}

class Cat implements Animal {
  constructor(private name: string) {}
  speak(): string {
    return `${this.name} meows!`;
  }
}

type AnimalType = "dog" | "cat";

class AnimalFactory {
  static create(type: AnimalType, name: string): Animal {
    switch (type) {
      case "dog":
        return new Dog(name);
      case "cat":
        return new Cat(name);
      default:
        throw new Error(`Unknown animal type: ${type}`);
    }
  }
}

// Type-safe usage
const dog = AnimalFactory.create("dog", "Rex");
const cat = AnimalFactory.create("cat", "Whiskers");

console.log(dog.speak()); // "Rex barks!"
console.log(cat.speak()); // "Whiskers meows!"
```

---

## Observer Pattern

Subscribe to state changes with type safety:

```typescript
interface Observer<T> {
  update(data: T): void;
}

class Subject<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    // Return unsubscribe function
    return () => this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

interface UserEvent {
  type: "created" | "updated" | "deleted";
  userId: string;
  timestamp: Date;
}

class Logger implements Observer<UserEvent> {
  update(event: UserEvent): void {
    console.log(`[${event.timestamp}] User ${event.type}: ${event.userId}`);
  }
}

class NotificationService implements Observer<UserEvent> {
  update(event: UserEvent): void {
    if (event.type === "created") {
      console.log(`Sending welcome email to user ${event.userId}`);
    }
  }
}

// Usage
const userEvents = new Subject<UserEvent>();

const logger = new Logger();
const notifier = new NotificationService();

userEvents.subscribe(logger);
userEvents.subscribe(notifier);

// Trigger event
userEvents.notify({
  type: "created",
  userId: "user-123",
  timestamp: new Date()
});
```

---

## Strategy Pattern

Swap behavior at runtime:

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<boolean>;
}

class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  async pay(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via credit card ${this.cardNumber}`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  async pay(amount: number): Promise<boolean> {
    console.log(`Processing ${amount} via PayPal ${this.email}`);
    return true;
  }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async process(amount: number): Promise<boolean> {
    return this.strategy.pay(amount);
  }
}

// Usage
const processor = new PaymentProcessor(
  new CreditCardPayment("1234-5678-9012-3456")
);

await processor.process(100);

// Switch strategy at runtime
processor.setStrategy(new PayPalPayment("user@example.com"));
await processor.process(50);
```

---

## Dependency Injection

Inject dependencies for testability:

```typescript
// Without DI (tightly coupled)
class UserService {
  private repo = new UserRepository(); // Hard to test
  private email = new EmailService();   // Hard to test
}

// With DI (loosely coupled)
interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class UserService {
  constructor(
    private repo: IUserRepository,
    private email: IEmailService
  ) {}

  async registerUser(email: string, name: string): Promise<User> {
    const user = await this.repo.create({ id: "123", email, name });
    await this.email.send(email, "Welcome!", "Thanks for joining!");
    return user;
  }
}

// Testing (with mocks)
class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return { id, email: "test@example.com", name: "Test" };
  }
}

class MockEmailService implements IEmailService {
  async send(): Promise<void> {
    // Do nothing in test
  }
}

const service = new UserService(
  new MockUserRepository(),
  new MockEmailService()
);
```

---

## Common Pitfalls

BAD: Over-engineering simple cases
```typescript
// Too complex for a simple task
class SingletonFactory implements IFactory { }
class RepositoryBuilder { }
```

GOOD: Use patterns when they solve real problems
```typescript
// Simple code is better when patterns don't add value
const data = await fetch("/api/users").then(r => r.json());
```

---

## Best Practices

- **Use patterns strategically**: Only when they reduce complexity
- **Prefer composition**: Over inheritance for flexibility
- **Type-driven design**: Leverage TypeScript's type system
- **Test-first**: Patterns should make testing easier

---

## Resources

- [Design Patterns in TypeScript](https://refactoring.guru/design-patterns/typescript)
- [Clean Code in TypeScript](https://github.com/labs42io/clean-code-typescript)

---

## Checklist

- [ ] Understand builder pattern
- [ ] Implement repository pattern
- [ ] Use factory pattern effectively
- [ ] Implement observer for events
- [ ] Apply strategy pattern
- [ ] Use dependency injection
