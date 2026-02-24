# Troubleshooting Guide

Having issues? Look here first!

---

## Setup Issues

### "npm: command not found"
**Problem**: Node.js or npm not installed

**Solution**:
1. Go to https://nodejs.org/
2. Download LTS version
3. Run installer
4. Restart terminal
5. Verify: `node --version` and `npm --version`

---

### "typescript not found" during build
**Problem**: Dependencies not installed

**Solution**:
```bash
cd Learners
npm install
npm run build
```

---

### "tsconfig.json: file not found"
**Problem**: Running from wrong directory

**Solution**:
```bash
# Make sure you're in the right folder
cd src/0.0_typescript_full_course/Learners
ls tsconfig.json  # Should show the file

npm run build
```

---

## Compilation Issues

### Error: "Type 'X' is not assignable to type 'Y'"
**Cause**: Wrong type passed to function

**Example**:
```typescript
function greet(name: string) { }
greet(123);  // ERROR - 123 is not a string
```

**Solution**: Pass correct type
```typescript
greet("Alice");  // Correct
```

**Reference**: See `CHAPTER_1_DEBUGGING_GUIDE.md`

---

### Error: "Cannot find name 'X'"
**Cause**: Variable not declared or renamed

**Example**:
```typescript
const userId = 5;
console.log(userID);  // ERROR - typo! Should be userId
```

**Solution**: Check spelling

---

### Error: "Property 'X' does not exist on type 'Y'"
**Cause**: Accessing property that isn't defined

**Example**:
```typescript
interface User {
  name: string;
}

const user: User = { name: "Alice" };
console.log(user.age);  // ERROR - 'age' not in User interface
```

**Solution**: Add property to interface or access correct property

---

### Error: "Implicit any"
**Cause**: Missing type annotation with `noImplicitAny`

**Example**:
```typescript
function add(x, y) {  // ERROR - x and y have implicit 'any' type
  return x + y;
}
```

**Solution**: Add types
```typescript
function add(x: number, y: number): number {
  return x + y;
}
```

---

## Runtime Issues

### "Cannot read property 'X' of undefined"
**Cause**: Variable is undefined when accessed

**Example**:
```typescript
let user: { name: string } | undefined;
console.log(user.name);  // ERROR - user might be undefined!
```

**Solution**: Check before accessing
```typescript
if (user) {
  console.log(user.name);  // Safe
}

// Or use optional chaining
console.log(user?.name);  // Safe
```

---

### "SyntaxError: Unexpected token"
**Cause**: Running `.ts` file directly (TypeScript not compiled)

**Example**:
```bash
node src/index.ts  # ERROR!
```

**Solution**: Compile first
```bash
npm run build      # Creates dist/
npm start          # Runs compiled code
```

---

### "Module not found"
**Cause**: Incorrect import path or missing package

**Example**:
```typescript
import { User } from "./user";  // File doesn't exist at this path
```

**Solution**:
1. Check file exists
2. Check path is correct
3. If importing npm package, make sure it's installed (`npm install package-name`)

---

## Editor/IDE Issues

### Red squiggles but code compiles
**Cause**: VS Code using different TypeScript version

**Solution**:
1. Open VS Code Command Palette (Ctrl+Shift+P)
2. Type "TypeScript: Select TypeScript Version"
3. Choose "Use Workspace Version"
4. Reload window

---

### Autocomplete not working
**Cause**: tsconfig.json issue or cache issue

**Solution**:
```bash
# Clear cache
rm -rf node_modules/.cache
rm -rf .vscode

# Restart VS Code
```

---

### IntelliSense slow
**Cause**: Large project or performance settings

**Solution**:
- Enable `skipLibCheck` in tsconfig.json
- Exclude unnecessary folders
- Close other VS Code windows

---

## Testing Issues

### Jest tests not finding TypeScript
**Cause**: Missing ts-jest configuration

**Solution**:
```bash
npm install --save-dev jest @types/jest ts-jest
```

Create `jest.config.js`:
```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node"
};
```

---

### Tests timing out
**Cause**: Async test not completing

**Solution**:
```typescript
// ✅ Correct - return promise
it("should work", async () => {
  const result = await getData();
  expect(result).toBe(expected);
});

// ❌ Wrong - promise not returned/awaited
it("should work", () => {
  getData().then(result => {
    expect(result).toBe(expected);
  });
});
```

---

## Git/Contribution Issues

### "Permission denied: .git/hooks/pre-commit"
**Cause**: File permissions issue

**Solution**:
```bash
chmod +x .git/hooks/pre-commit
```

---

### Git conflict in tsconfig.json
**Cause**: Multiple people editing configuration

**Solution**:
1. Pull latest: `git pull`
2. Resolve conflicts manually
3. Keep only necessary changes
4. Test: `npm run build`
5. Commit: `git add tsconfig.json && git commit`

---

### Cannot push - "fatal: Authentication failed"
**Cause**: GitHub credentials/SSH key issue

**Solution**:
```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "your@email.com"

# Add to GitHub:
# Settings → SSH and GPG keys → New SSH key
# Paste content of ~/.ssh/id_ed25519.pub

# Test connection
ssh -T git@github.com
```

---

## Performance Issues

### Build taking too long (> 30s)
**Cause**: Large project or configuration issues

**Solution**:
```bash
# Check what's taking time
npx tsc --diagnostics

# Common fixes:
# 1. Enable skipLibCheck in tsconfig.json
# 2. Exclude node_modules
# 3. Use noEmit for checking only
```

---

### Memory issues during compilation
**Cause**: Large files or complex types

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Still Can't Fix It?

1. **Search** `CHAPTER_1_FAQ.md` for your question
2. **Check** `CHAPTER_1_DEBUGGING_GUIDE.md` for error codes
3. **Read** relevant guide (`CHAPTER_1_COMMON_PITFALLS.md`, etc.)
4. **Ask** in course discussions or community (Discord, Stack Overflow)
5. **Report** issue on GitHub if it's a course problem

---

