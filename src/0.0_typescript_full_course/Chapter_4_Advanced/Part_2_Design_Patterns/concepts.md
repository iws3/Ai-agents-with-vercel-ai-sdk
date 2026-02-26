# Part 2: Design Patterns (Advanced Deep Dive)

## Learning Objectives

After this part you'll understand:
- SOLID principles
- Creational, structural, and behavioral patterns  
- MVC and MVVM architectures
- Type-safe pattern implementations

---

## SOLID Principles

### Single Responsibility

```typescript
// BAD: Multiple responsibilities
class User {
  save(): void { }
  validateEmail(): boolean { }
  sendEmail(): void { }
}

// GOOD: Single concern
class User {
  constructor(public name: string, public email: string) {}
}

class UserValidator {
  validate(user: User): boolean {
    return /^.+@.+$/.test(user.email);
  }
}
```

### Open/Closed

```typescript
// GOOD: Open for extension
interface ReportFormatter {
  format(data: any[]): string;
}

class PDFFormatter implements ReportFormatter {
  format(data: any[]): string { return "PDF"; }
}

class ReportGenerator {
  constructor(private formatter: ReportFormatter) {}
  generate(data: any[]): string {
    return this.formatter.format(data);
  }
}
```

### Liskov Substitution

```typescript
// GOOD: Base class contract honored
interface Bird {
  move(): void;
}

class Sparrow implements Bird {
  move(): void { console.log("Flying"); }
}

class Penguin implements Bird {
  move(): void { console.log("Swimming"); }
}
```

### Interface Segregation

```typescript
// GOOD: Segregated interfaces
interface Eatable {
  eat(): void;
}

interface Flyable {
  fly(): void;
}

class Dog implements Eatable {
  eat(): void { }
}
```

### Dependency Inversion

```typescript
// GOOD: Depend on abstractions
interface MessageSender {
  send(to: string, message: string): Promise<void>;
}

class Service {
  constructor(private sender: MessageSender) {}
}
```

---

## Creational Patterns

### Singleton

```typescript
class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
```

### Factory

```typescript
class AnimalFactory {
  static create(type: "dog" | "cat"): Animal {
    switch (type) {
      case "dog": return new Dog();
      case "cat": return new Cat();
    }
  }
}
```

---

## Structural Patterns

### Adapter

```typescript
interface NewAPI {
  method(): string;
}

class OldAPI {
  oldMethod(): string { return "old"; }
}

class Adapter implements NewAPI {
  constructor(private old: OldAPI) {}
  method(): string { return this.old.oldMethod(); }
}
```

### Decorator

```typescript
class Component {
  operation(): string { return "Component"; }
}

class Decorator {
  constructor(private component: Component) {}
  operation(): string {
    return `Decorated(${this.component.operation()})`;
  }
}
```

---

## Behavioral Patterns

### Observer

```typescript
class EventEmitter<T> {
  private listeners: Array<(data: T) => void> = [];

  on(listener: (data: T) => void): void {
    this.listeners.push(listener);
  }

  emit(data: T): void {
    this.listeners.forEach(l => l(data));
  }
}
```

### Strategy

```typescript
interface Strategy {
  execute(data: number): number;
}

class Context {
  constructor(private strategy: Strategy) {}

  performOperation(data: number): number {
    return this.strategy.execute(data);
  }
}
```

---

## MVC Architecture

```typescript
// Model
interface Task {
  id: number;
  title: string;
  done: boolean;
}

class TaskModel {
  private tasks: Task[] = [];

  addTask(title: string): void {
    this.tasks.push({ id: Date.now(), title, done: false });
  }

  getTasks(): Task[] {
    return this.tasks;
  }
}

// View
class TaskView {
  render(tasks: Task[]): string {
    return tasks.map(t => `<li>${t.title}</li>`).join("");
  }
}

// Controller
class TaskController {
  constructor(private model: TaskModel, private view: TaskView) {}

  addTask(title: string): void {
    this.model.addTask(title);
  }

  display(): void {
    console.log(this.view.render(this.model.getTasks()));
  }
}
```

---

## Checklist

- [ ] Understand all SOLID principles
- [ ] Know creational, structural, behavioral patterns
- [ ] Can implement MVC
- [ ] Use patterns strategically, not blindly
