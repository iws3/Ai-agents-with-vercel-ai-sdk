# Day 1: Why TypeScript Matters - Exercises

## 📝 Challenge Yourself!

Complete one, two, or all three exercises. Choose your difficulty level!

---

## 🟢 Exercise 1: Identify Bugs in JavaScript (Beginner)

Below are JavaScript snippets. Each has a potential bug that TypeScript would catch. **Identify the bug and explain why TypeScript would prevent it.**

### Code Snippet 1:
```javascript
function getUserName(userId) {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];
  
  return users[userId].name;
}

// Called with:
console.log(getUserName("1"));  // What happens?
```

### Code Snippet 2:
```javascript
function calculateDiscount(price, discountPercent) {
  const discountAmount = (discountPercent / 100) * price;
  return price - discountAmount;  // Is this correct?
}

// Called with:
console.log(calculateDiscount(100, "20"));  // What happens?
```

### Code Snippet 3:
```javascript
const user = {
  userId: 123,
  userName: "Alice",
  userEmail: "alice@example.com"
};

console.log(user.username);    // What do we get?
console.log(user.email);       // What do we get?
console.log(user.userId);      // What do we get?
```

**Submit:** Create a markdown file `Day_1_Exercises/Solutions/YOUR-GITHUB-USERNAME/exercise-1.md` with your answers.

---

## 🟡 Exercise 2: Translate JavaScript to TypeScript (Intermediate)

Here's JavaScript code. **Add proper TypeScript types to make it type-safe.**

```javascript
function processOrder(order) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1;
  const finalTotal = total + tax;
  
  return {
    items: order.items,
    subtotal: total,
    tax: tax,
    total: finalTotal,
    status: "completed"
  };
}

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

// Usage:
const order = {
  items: [
    { name: "Book", price: 15.99, quantity: 2 },
    { name: "Pen", price: 1.50, quantity: 5 }
  ],
  customerId: 123
};

const result = processOrder(order);
console.log("Subtotal: " + formatPrice(result.subtotal));
console.log("Tax: " + formatPrice(result.tax));
console.log("Total: " + formatPrice(result.total));
```

**Your Task:**
1. Define interfaces for `Order`, `OrderItem`, and `OrderResult`
2. Add type annotations to all parameters and return types
3. Make sure your code runs without errors
4. Test with the provided usage example

**Submit:** Create `Day_1_Exercises/Solutions/YOUR-GITHUB-USERNAME/exercise-2.ts`

---

## 🔴 Exercise 3: Design a Type System (Advanced)

Create a TypeScript system for a simple **Library Management System** with the following requirements:

**Requirements:**
- Books have: `id`, `title`, `author`, `isbn`, `year`, `genre`
- Genres are restricted to: "Science Fiction", "Mystery", "Romance", "Non-Fiction"
- Users have: `id`, `name`, `email`, `membershipDate`, `borrowedBooks`
- Borrowed books track: `bookId`, `borrowDate`, `dueDate`, `returned` (boolean)
- You need functions to:
  - Add a book to the library
  - Register a new user
  - Borrow a book (add to user's borrowed list)
  - Return a book
  - Find overdue books

**Your Task:**
1. Create TypeScript interfaces for all entities
2. Create functions with proper type signatures
3. Include error handling (what if a book doesn't exist?)
4. Test your system with sample data
5. Make sure everything compiles without errors

**Bonus:** Make it fun! Add realistic data:
```typescript
const books = [
  { id: 1, title: "Dune", author: "Frank Herbert", isbn: "978-0-441-17271-3", year: 1965, genre: "Science Fiction" },
  // ... more books
];

const users = [
  { id: 1, name: "Alice", email: "alice@library.com", membershipDate: new Date("2024-01-15"), borrowedBooks: [] },
  // ... more users
];
```

**Submit:** Create `Day_1_Exercises/Solutions/YOUR-GITHUB-USERNAME/exercise-3.ts`

---

## 📋 Submission Checklist

Before submitting your PR:

- [ ] I created my solution folder: `Solutions/YOUR-GITHUB-USERNAME/`
- [ ] My files are named: `exercise-1.ts`, `exercise-2.ts`, `exercise-3.ts` (as applicable)
- [ ] Code compiles without errors: `npx tsc`
- [ ] Code runs without errors: `node dist/...` or `npx ts-node ...`
- [ ] I added comments explaining my solution
- [ ] I didn't copy from others (but can compare after solving!)

---

## 📚 How to Submit

1. Solve the exercise(s)
2. Create your solution folder:
   ```bash
   mkdir -p Learners/Day_1_Exercises/Solutions/YOUR-GITHUB-USERNAME
   ```

3. Copy your files there
4. Create a branch and commit:
   ```bash
   git checkout -b add/day-1-YOUR-USERNAME-solutions
   git add Learners/Day_1_Exercises/Solutions/YOUR-GITHUB-USERNAME/
   git commit -m "Add Day 1 Solutions - [YourGitHubUsername]"
   git push origin add/day-1-YOUR-USERNAME-solutions
   ```

5. Create a Pull Request on GitHub

---

## 💡 Tips

- **Start with Exercise 1** - Understand the problems first
- **Reference Day 1 lesson** - All concepts explained there
- **Use TypeScript Playground** - Test code online without setup
- **Look at examples/** folder - See official solutions (after you try!)
- **Ask for help** - Open an issue if stuck!

---

## 🎉 You've Got This!

Choose one or more exercises, solve them, and show the community your work!

**Ready?** Start with Exercise 1! 🚀
