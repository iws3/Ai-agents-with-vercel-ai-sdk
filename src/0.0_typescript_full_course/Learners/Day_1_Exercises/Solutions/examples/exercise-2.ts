// Day 1 Exercise 2 - Example Solution
// Translate JavaScript to TypeScript

// ===== INTERFACES =====

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  customerId: number;
}

interface OrderResult {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "completed" | "pending" | "cancelled";
}

// ===== FUNCTIONS =====

function processOrder(order: Order): OrderResult {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  return {
    items: order.items,
    subtotal: subtotal,
    tax: tax,
    total: total,
    status: "completed"
  };
}

function formatPrice(amount: number): string {
  return "$" + amount.toFixed(2);
}

// ===== USAGE EXAMPLE =====

const order: Order = {
  items: [
    { name: "Book", price: 15.99, quantity: 2 },
    { name: "Pen", price: 1.50, quantity: 5 }
  ],
  customerId: 123
};

const result: OrderResult = processOrder(order);
console.log("Subtotal: " + formatPrice(result.subtotal));
console.log("Tax: " + formatPrice(result.tax));
console.log("Total: " + formatPrice(result.total));

// ===== EXPLANATION =====
/*
 * WHAT I ADDED:
 * 1. OrderItem interface - describes what each item looks like
 * 2. Order interface - describes the order structure
 * 3. OrderResult interface - describes what the function returns
 * 4. Type annotations on all function parameters and return types
 * 5. Status field with restricted values (literal type)
 * 
 * WHY THIS MATTERS:
 * - If someone passes wrong types, TypeScript catches it immediately
 * - IDE autocomplete works perfectly
 * - Self-documenting: anyone can see what data is expected
 * - Refactoring is safe: if you change Order, errors show where it's used
 */
