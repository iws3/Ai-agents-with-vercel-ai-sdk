# Part 4: Your First TypeScript Program — Hands-On Deep Dive

## ��� Learning Objectives

- Write your very first TypeScript program
- Understand TypeScript syntax for common patterns
- Learn how to run your code
- See type checking in action
- Understand interfaces and functions
- Build a complete working example

---

## Hello, TypeScript!

###  Simplest Program

```typescript
console.log("Hello, TypeScript!");
```

**Save as**: `src/hello.ts`

**Compile**: `npx tsc src/hello.ts`

**Run**: `node hello.js`

**Output**: `Hello, TypeScript!`

---

## Your First Real Program: Student Grade Calculator

### Real-World Scenario
A school needs a system to calculate student grades based on scores.

### Requirements
- Input: Student name, test scores
- Process: Calculate average and grade
- Output: Display results with type safety

### TypeScript Implementation

```typescript
// Step 1: Define the shape of our data with an interface
interface Student {
  name: string;
  scores: number[];
}

interface GradeResult {
  name: string;
  average: number;
  grade: string;
}

// Step 2: Create a function to calculate average
function calculateAverage(scores: number[]): number {
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

// Step 3: Create a function to determine grade
function getGrade(average: number): string {
  if (average >= 90) return "A";
  if (average >= 80) return "B";
  if (average >= 70) return "C";
  if (average >= 60) return "D";
  return "F";
}

// Step 4: Create main function
function gradeStudent(student: Student): GradeResult {
  const average = calculateAverage(student.scores);
  const grade = getGrade(average);
  
  return {
    name: student.name,
    average: Math.round(average * 100) / 100,  // Round to 2 decimals
    grade: grade
  };
}

// Step 5: Use our functions
const alice: Student = {
  name: "Alice Johnson",
  scores: [95, 87, 92, 88, 95]
};

const bob: Student = {
  name: "Bob Smith",
  scores: [78, 82, 75, 80, 79]
};

const aliceResult = gradeStudent(alice);
const bobResult = gradeStudent(bob);

console.log(`${aliceResult.name}: Average = ${aliceResult.average}, Grade = ${aliceResult.grade}`);
console.log(`${bobResult.name}: Average = ${bobResult.average}, Grade = ${bobResult.grade}`);
```

**Output**:
```
Alice Johnson: Average = 91.4, Grade = A
Bob Smith: Average = 78.8, Grade = C
```

---

## Type Safety in Action

### Without TypeScript (Fragile)

```javascript
function gradeStudent(student) {
  // What if student.scores is a string? Null? Missing?
  let sum = 0;
  for (let score of student.scores) {
    sum += score;  // What if this is "85"? Type coercion!
  }
  const average = sum / student.scores.length;
  return { average };
}

// Easy to pass wrong data
gradeStudent("Alice");  // Crashes at runtime
gradeStudent({ name: "Bob" });  // Crashes when accessing scores
gradeStudent({ name: "Charlie", scores: ["95", "87"] });  // Works but gives wrong answer
```

### With TypeScript (Safe)

```typescript
function gradeStudent(student: Student): GradeResult {
  // TypeScript ensures student has name and scores
  // TypeScript ensures scores is an array of numbers
  // ...
}

// TypeScript catches errors immediately
gradeStudent("Alice");  // ❌ Compile error
gradeStudent({ name: "Bob" });  // ❌ Compile error: missing scores
gradeStudent({ name: "Charlie", scores: ["95", "87"] });  // ❌ Compile error: strings not numbers
```

---

## Real-World: AI Engineering Example

### Scenario: Building a ChatBot Score Card

```typescript
interface Message {
  role: "user" | "assistant";  // Only these two values allowed
  content: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  model: "gpt-4" | "gpt-3.5-turbo";
}

interface ConversationMetrics {
  messageCount: number;
  userMessages: number;
  assistantMessages: number;
  averageMessageLength: number;
}

function analyzeConversation(session: ChatSession): ConversationMetrics {
  let userCount = 0;
  let assistantCount = 0;
  let totalLength = 0;
  
  for (const message of session.messages) {
    if (message.role === "user") {
      userCount++;
    } else if (message.role === "assistant") {
      assistantCount++;
    }
    totalLength += message.content.length;
  }
  
  return {
    messageCount: session.messages.length,
    userMessages: userCount,
    assistantMessages: assistantCount,
    averageMessageLength: totalLength / session.messages.length
  };
}

// Usage
const chatSession: ChatSession = {
  id: "chat-001",
  model: "gpt-4",
  messages: [
    { role: "user", content: "What is TypeScript?" },
    { role: "assistant", content: "TypeScript is a superset of JavaScript..." },
    { role: "user", content: "How do I get started?" }
  ]
};

const metrics = analyzeConversation(chatSession);
console.log(`Session ${chatSession.id}:`);
console.log(`  Total messages: ${metrics.messageCount}`);
console.log(`  User messages: ${metrics.userMessages}`);
console.log(`  Assistant responses: ${metrics.assistantMessages}`);
```

---

## Real-World: Frontend Example

### Scenario: Todo Application

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: Date;  // Optional
  priority: "low" | "medium" | "high";
}

interface TodoState {
  todos: Todo[];
  filter: "all" | "active" | "completed";
}

function addTodo(state: TodoState, title: string, priority: "low" | "medium" | "high"): TodoState {
  const newTodo: Todo = {
    id: Date.now(),
    title,
    completed: false,
    priority
  };
  
  return {
    ...state,
    todos: [...state.todos, newTodo]
  };
}

function toggleTodo(state: TodoState, id: number): TodoState {
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  };
}

function getFilteredTodos(state: TodoState): Todo[] {
  switch (state.filter) {
    case "completed":
      return state.todos.filter(todo => todo.completed);
    case "active":
      return state.todos.filter(todo => !todo.completed);
    default:
      return state.todos;
  }
}

// Initial state
const initialState: TodoState = {
  todos: [],
  filter: "all"
};

// Add a todo
let state = addTodo(initialState, "Learn TypeScript", "high");
state = addTodo(state, "Build a project", "medium");

// Toggle completion
state = toggleTodo(state, state.todos[0].id);

// See active todos
const activeTodos = getFilteredTodos({ ...state, filter: "active" });
console.log("Active todos:", activeTodos);
```

---

## Running Your Program

### Step-by-Step

```bash
# 1. Create the TypeScript file
echo "console.log('Hello, TypeScript!');" > src/hello.ts

# 2. Compile TypeScript to JavaScript
npm run build
# OR
npx tsc

# 3. Run the compiled JavaScript
npm start
# OR
node dist/hello.js

# Output: Hello, TypeScript!
```

### Watch Mode (Auto-Compile)

```bash
# Terminal 1: Watch for changes
npm run dev

# Terminal 2: Edit your files and save
# Watch automatically re-compiles

# Terminal 3: Run your code
npm start
```

---

## Common First-Program Mistakes

### Mistake 1: Forgetting to compile

```bash
node src/hello.ts  # ❌ Error: Node can't run TypeScript directly

node dist/hello.js  # ✅ Correct: Node runs compiled JavaScript
```

### Mistake 2: Type mismatches in function calls

```typescript
function add(a: number, b: number): number {
  return a + b;
}

add(5, "10");  // ❌ Error: "10" is not a number
add(5, 10);    // ✅ Correct
```

### Mistake 3: Missing interface properties

```typescript
interface User {
  name: string;
  email: string;
}

const user: User = { name: "Alice" };  // ❌ Error: missing email
const user: User = { name: "Alice", email: "alice@example.com" };  // ✅ Correct
```

---

## ✅ Checklist

- [ ] Can create a TypeScript file
- [ ] Can compile with `npm run build`
- [ ] Can run compiled JavaScript
- [ ] Understand function type annotations
- [ ] Understand interface definitions
- [ ] Can fix type errors
- [ ] Built and ran the grade calculator example
- [ ] Ready to explore more advanced topics!
