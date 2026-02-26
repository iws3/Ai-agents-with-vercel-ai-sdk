# Part 2: Classes and OOP (Intermediate)

## 🎯 Learning Objectives

After this part, you'll understand:
- How to write TypeScript classes with type safety
- Constructors and initialization patterns
- Properties and methods
- Inheritance and polymorphism
- Access modifiers and encapsulation
- Abstract classes and interfaces
- Real-world OOP patterns

---

## 📝 Key Terms

- **Class**: A blueprint for creating objects with properties and methods
- **Constructor**: Special method called when creating a new instance
- **Inheritance**: Extending a class to create specialized versions
- **Polymorphism**: Different classes implementing the same interface
- **Encapsulation**: Hiding internal details with access modifiers
- **Abstraction**: Abstract classes that define contracts  
- **Method Override**: Replacing parent method behavior in child class

> **Beginner Note** 🎓: Classes let you organize related data and behavior together. OOP principles create maintainable, reusable code.

---

## 🏗️ Basic Classes

A **class** is a blueprint for creating objects with properties (data) and methods (behavior).

### Simple Class Example

```typescript
class Dog {
  name: string;
  age: number;
  breed: string;

  constructor(name: string, age: number, breed: string) {
    this.name = name;
    this.age = age;
    this.breed = breed;
  }

  bark(): void {
    console.log(`${this.name} says Woof! Woof!`);
  }

  getInfo(): string {
    return `${this.name} is a ${this.age}-year-old ${this.breed}`;
  }
}

// Create instances
const buddy = new Dog("Buddy", 3, "Golden Retriever");
const max = new Dog("Max", 5, "German Shepherd");

buddy.bark();           // "Buddy says Woof! Woof!"
console.log(buddy.getInfo());  // "Buddy is a 3-year-old Golden Retriever"
```

**Key points:**
- Properties are declared at class level
- Constructor initializes properties
- Methods operate on the instance's data
- `new` keyword creates an instance

### Constructor Shorthand

Properties can be declared directly in the constructor:

```typescript
class User {
  // Shorthand - automatically creates and assigns!
  constructor(
    public id: number,
    public name: string,
    public email: string,
    private password: string  // Also works with access modifiers
  ) {}
}

const user = new User(1, "Alice", "alice@example.com", "secret");
console.log(user.name);     // "Alice" - accessible
// console.log(user.password); // ❌ ERROR: private
```

---

## 🔗 Inheritance: Building Hierarchies

Inheritance lets you create specialized versions of a class:

### Basic Inheritance

```typescript
// Parent class
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  move(): void {
    console.log(`${this.name} is moving`);
  }

  sleep(): void {
    console.log(`${this.name} is sleeping`);
  }
}

// Child class - inherits everything from Animal
class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age);  // Call parent constructor
    this.breed = breed;
  }

  bark(): void {
    console.log(`${this.name} says Woof!`);
  }
}

const dog = new Dog("Buddy", 3, "Golden Retriever");

// Uses inherited methods and properties
dog.move();        // "Buddy is moving"
dog.sleep();       // "Buddy is sleeping"

// Uses own methods
dog.bark();        // "Buddy says Woof!"
```

### Multiple Inheritance with Interfaces

TypeScript doesn't support multiple class inheritance, but interfaces work:

```typescript
// Can't do: class Dog extends Animal, Pet { }

// Instead, use interfaces
interface Walker {
  walk(): void;
}

interface Barker {
  bark(): void;
}

class Dog extends Animal implements Walker, Barker {
  walk(): void {
    console.log(`${this.name} is walking`);
  }

  bark(): void {
    console.log(`${this.name} says Woof!`);
  }
}
```

---

## 🎭 Method Overriding

Child classes can replace parent methods:

```typescript
class Animal {
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  // Override parent method
  move(): void {
    console.log(`${this.name} is running on four legs`);
  }
}

class Bird extends Animal {
  // Different override
  move(): void {
    console.log(`${this.name} is flying`);
  }
}

const dog = new Dog("Buddy", 3, "Golden Retriever");
const bird = new Bird("Tweety", 1);

dog.move();    // "Buddy is running on four legs"
bird.move();   // "Tweety is flying"
```

### Using super() in Overrides

```typescript
class Animal {
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  move(): void {
    super.move();  // Call parent method first
    console.log(`${this.name} is wagging its tail`);
  }
}

const dog = new Dog("Buddy", 3);
dog.move();
// Output:
// "Buddy is moving"
// "Buddy is wagging its tail"
```

---

## 🔐 Access Modifiers: Encapsulation

Control who can access class members:

### Public (Default)

```typescript
class Counter {
  public count = 0;  // Anyone can access

  increment() {
    this.count++;
  }
}

const counter = new Counter();
counter.count = 100;  // Can change from outside
console.log(counter.count);  // 100 - anyone can see
```

### Private

Hidden from outside the class:

```typescript
class BankAccount {
  private balance: number;  // Only accessible inside the class

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= this.balance) {
      this.balance -= amount;
    }
  }

  getBalance(): number {
    return this.balance;  // Control how balance is accessed
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance());  // 1500

// account.balance = 999999;  // ❌ ERROR: balance is private
// account.withdraw(-10000);  // ❌ Can't access private directly
```

### Protected

Accessible in class and subclasses:

```typescript
class Animal {
  protected energy: number;  // Accessible in Animal and subclasses

  constructor(energy: number) {
    this.energy = energy;
  }

  move(): void {
    this.energy--;
    console.log(`Moved. Energy: ${this.energy}`);
  }
}

class Dog extends Animal {
  bark(): void {
    this.energy -= 2;  // Can access protected property
    console.log(`Barked. Energy: ${this.energy}`);
  }
}

const dog = new Dog(100);
dog.move();      // Works
dog.bark();      // Works
// dog.energy = 50;  // ❌ ERROR: protected (even for subclasses from outside)
```

---

## 🎯 Readonly Properties

Prevent modification after initialization:

```typescript
class User {
  readonly id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;    // Can set in constructor
    this.name = name;
  }

  updateName(newName: string): void {
    this.name = newName;  // ✅ OK
    // this.id = 999;        // ❌ ERROR: readonly
  }
}

const user = new User(1, "Alice");
user.name = "Bob";   // ✅ OK
// user.id = 999;    // ❌ ERROR: readonly
```

---

## 🔬 Abstract Classes

Define contracts for subclasses:

```typescript
// Abstract class - can't instantiate directly
abstract class Shape {
  abstract name: string;
  abstract area(): number;
  abstract perimeter(): number;

  describe(): void {
    console.log(`This is a ${this.name}`);
  }
}

// Concrete class - implements abstract members
class Circle extends Shape {
  name = "Circle";
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  name = "Rectangle";
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// const shape = new Shape();  // ❌ ERROR: abstract

const circle = new Circle(5);
circle.describe();           // "This is a Circle"
console.log(circle.area());  // ~78.5

const rect = new Rectangle(4, 6);
rect.describe();             // "This is a Rectangle"
console.log(rect.perimeter());  // 20
```

---

## 🎪 Static Members

Class-level members shared across all instances:

```typescript
class MathHelper {
  static PI = 3.14159;
  
  static circleArea(radius: number): number {
    return this.PI * radius * radius;
  }

  static circlePerimeter(radius: number): number {
    return 2 * this.PI * radius;
  }
}

// Use without creating instance
console.log(MathHelper.PI);                  // 3.14159
console.log(MathHelper.circleArea(5));      // ~78.5
console.log(MathHelper.circlePerimeter(5)); // ~31.4

// Can't access static from instance
// const helper = new MathHelper();
// helper.circleArea(5);  // ❌ ERROR: circleArea is static
```

---

## 💪 Getters and Setters

Control property access:

```typescript
class User {
  private _age: number;  // Private with underscore convention

  constructor(age: number) {
    this._age = age;
  }

  // Getter - read property like normal
  get age(): number {
    return this._age;
  }

  // Setter - write property like normal
  set age(value: number) {
    if (value < 0) {
      console.log("Age can't be negative");
      return;
    }
    this._age = value;
  }
}

const user = new User(30);
console.log(user.age);   // 30 (uses getter)
user.age = 31;           // Uses setter
user.age = -5;           // "Age can't be negative"
```

---

## 📚 Real-World Patterns

### Pattern 1: AI Assistant Hierarchy

```typescript
abstract class AIAssistant {
  modelName: string;
  maxTokens: number;

  constructor(modelName: string, maxTokens: number = 2000) {
    this.modelName = modelName;
    this.maxTokens = maxTokens;
  }

  abstract generateResponse(prompt: string): Promise<string>;

  logInteraction(prompt: string, response: string): void {
    console.log(`[${this.modelName}] Q: ${prompt}`);
    console.log(`[${this.modelName}] A: ${response}`);
  }
}

class ChatGPT extends AIAssistant {
  async generateResponse(prompt: string): Promise<string> {
    // Implementation
    return `ChatGPT response to: ${prompt}`;
  }
}

class Claude extends AIAssistant {
  async generateResponse(prompt: string): Promise<string> {
    // Implementation
    return `Claude response to: ${prompt}`;
  }
}
```

### Pattern 2: Repository Pattern

```typescript
abstract class Repository<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findAll(): T[] {
    return this.items;
  }

  abstract findById(id: any): T | undefined;
}

interface User {
  id: number;
  name: string;
}

class UserRepository extends Repository<User> {
  findById(id: number): User | undefined {
    return this.items.find(user => user.id === id);
  }
}

const repo = new UserRepository();
repo.add({ id: 1, name: "Alice" });
repo.add({ id: 2, name: "Bob" });
console.log(repo.findById(1));  // { id: 1, name: "Alice" }
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Forgetting super() in Constructor

```typescript
// ❌ WRONG - parent constructor not called
class Dog extends Animal {
  constructor(name: string, age: number) {
    // Missing super(name, age);
    this.breed = "unknown";
  }
}

// ✅ CORRECT - call super first
class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age);
    this.breed = "Golden Retriever";
  }
}
```

### Pitfall 2: Treating Private as Truly Private

```typescript
// ❌ Private is compile-time only
class Secret {
  private password = "secret123";
}

const obj = new Secret();
// TypeScript: can't access
// JavaScript: obj.password works! (at runtime)

// Private is for type safety, not security
```

### Pitfall 3: Over-Using Inheritance

```typescript
// ❌ Over-complex hierarchy
class Vehicle { }
class Car extends Vehicle { }
class SportsCar extends Car { }
class RacingCar extends SportsCar { }

// ✅ Sometimes composition is better
class Car {
  engine: Engine;
  wheels: Wheel[];
  transmission: Transmission;
}
```

---

## 🏆 Best Practices

1. **Use private by default** - expose what's necessary
2. **Keep inheritance shallow** - avoid deeply nested class hierarchies
3. **Prefer composition over inheritance** - more flexible
4. **Use abstract classes for contracts** - enforce implementation
5. **Document with comments** - explain why, not what
6. **Make readonly what shouldn't change** - prevent errors
7. **Use static for utility functions** - math operations, constants
8. **Keep classes focused** - single responsibility

---

## ✅ Checklist

- [ ] Can create basic classes
- [ ] Understand constructors
- [ ] Can use inheritance with extends
- [ ] Understand method overriding
- [ ] Know all access modifiers
- [ ] Can use abstract classes
- [ ] Understand static members
- [ ] Comfortable with getters/setters
- [ ] Familiar with real-world patterns
