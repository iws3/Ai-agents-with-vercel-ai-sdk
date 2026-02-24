# Day 4: Your First TypeScript Program - Exercises

## 📝 Write Real Programs!

---

## 🟢 Exercise 1: Grade Calculator (Beginner)

**Objective:** Build a simple grading system.

**Requirements:**
- Input: student name and score (0-100)
- Output: letter grade (A/B/C/D/F)
- Calculate class average

**Your Tasks:**
1. Define a `Student` interface with: `name`, `score`
2. Create `calculateGrade()` function
3. Create `processStudents()` function that takes array of students
4. Process 5-10 sample students
5. Display results
6. Calculate and show average

**Example:**
```
Student: Alice, Score: 92, Grade: A
Student: Bob, Score: 78, Grade: C
Class Average: 85.5
```

**Submit:** `exercise-1.ts`

---

## 🟡 Exercise 2: Simple Todo App (Intermediate)

**Objective:** Build a task management system.

**Requirements:**
- Todo has: `id`, `title`, `description`, `completed`, `dueDate`
- User has: `id`, `name`, `todos`
- Functions:
  - Add todo
  - Mark as complete
  - Delete todo
  - Get pending todos
  - Get overdue todos

**Example Usage:**
```typescript
const user = createUser({ name: "Alice" });
addTodo(user, { title: "Learn TypeScript", description: "Complete course" });
addTodo(user, { title: "Build project", description: "Real-world app" });
// ... more operations
listPendingTodos(user);  // Shows incomplete todos
```

**Submit:** `exercise-2.ts`

---

## 🔴 Exercise 3: E-Commerce System (Advanced)

**Objective:** Build a mini e-commerce engine.

**Requirements:**
- Product with: `id`, `name`, `price`, `category`, `stock`
- ShoppingCart with: `userId`, `items`, `createdAt`
- User with: `id`, `name`, `orders`
- Operations:
  - Add product to cart
  - Remove from cart
  - Place order (check stock)
  - Get order history
  - Apply discount codes
  - Get total with tax

**Extra Features:**
- Handle out-of-stock items
- Apply different tax rates by category
- Calculate optimal discount
- Track order status

**Sample Data:**
```typescript
const laptop: Product = { id: 1, name: "Laptop", price: 999.99, category: "Electronics", stock: 5 };
const book: Product = { id: 2, name: "TypeScript Book", price: 29.99, category: "Books", stock: 50 };
const user: User = { id: 1, name: "Alice", orders: [] };
```

**Submit:** `exercise-3.ts`

---

## 📋 Submission Checklist

- [ ] My folder: `Solutions/YOUR-GITHUB-USERNAME/`
- [ ] Files named: `exercise-1.ts`, `exercise-2.ts`, `exercise-3.ts`
- [ ] Code compiles: `npx tsc`
- [ ] Code runs: `node dist/exercise-X.js`
- [ ] All types properly annotated
- [ ] No `any` types
- [ ] Clear function signatures

---

## 💡 Tips

- **Start simple** - Exercise 1 is straightforward
- **Use interfaces** - Define structures first
- **Type everything** - Parameters, returns, variables
- **Test your code** - Run it and verify output
- **Reference Day 4 lesson** - The grades example is similar!

---

## 🎉 Build your first real programs!

Complete Exercise 1 minimum! 🚀
