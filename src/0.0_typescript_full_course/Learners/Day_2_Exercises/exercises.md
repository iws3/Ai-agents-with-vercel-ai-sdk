# Day 2: Setup Development Environment - Exercises

## 📝 Hands-On Setup Challenges!

Complete these practical exercises to master your development environment.

---

## 🟢 Exercise 1: Verify Your Installation (Beginner)

**Objective:** Confirm all tools are properly installed.

**Tasks:**
1. Run in your terminal:
   ```bash
   node --version
   npm --version
   npx tsc --version
   ```

2. Record the output
3. Create a file `Learners/Day_2_Exercises/Solutions/YOUR-GITHUB-USERNAME/exercise-1.md` with:
   - The three version numbers
   - Your operating system
   - Your code editor

**Example Output:**
```
Node.js: v18.17.0
npm: 9.6.7
TypeScript: Version 5.2.2
OS: Windows 11
Editor: VS Code 1.85.0
```

---

## 🟡 Exercise 2: Create a Project from Scratch (Intermediate)

**Objective:** Set up a complete TypeScript project without instructions.

**Tasks:**
1. Create a new directory: `typescript-setup-exercise`
2. Initialize Node project
3. Install TypeScript
4. Configure TypeScript
5. Create `src/hello.ts` with:
   ```typescript
   const message: string = "Setup complete!";
   const number: number = 42;
   
   function greet(name: string): void {
     console.log(`Hello, ${name}!`);
   }
   
   console.log(message);
   console.log(number);
   greet("TypeScript");
   ```

6. Compile and run
7. Verify output
8. Submit:
   - `tsconfig.json` file
   - `package.json` file
   - Generated `hello.js` file

**Submit:** Create `exercise-2/` folder with all three files

---

## 🔴 Exercise 3: Configure for a Real Project (Advanced)

**Objective:** Create production-ready TypeScript configuration.

**Requirements:**
- Project name: `ai-chat-app` (hypothetical)
- Target: Node.js backend + browser frontend
- Must use strict mode
- Must generate source maps
- Must generate type declarations
- Must exclude test files

**Tasks:**
1. Create directory structure:
   ```
   ai-chat-app/
   ├── src/
   ├── dist/
   ├── dist-browser/
   └── tests/
   ```

2. Create `tsconfig.json` configured properly
3. Create `tsconfig.browser.json` for browser version
4. Create sample files in `src/` that compile
5. Compile and verify both configurations work
6. Document your configuration choices

**What to submit:**
- `tsconfig.json` (main config)
- `tsconfig.browser.json` (browser config)
- Brief explanation of your choices (comment in the file)

---

## 📋 Submission Checklist

- [ ] My folder is: `Solutions/YOUR-GITHUB-USERNAME/`
- [ ] Files are named appropriately: `exercise-1.md`, `exercise-2/`, `exercise-3/`
- [ ] All code compiles without errors
- [ ] My explanation is clear
- [ ] I tested everything works!

---

## 💡 Tips

- **Exercise 1:** Easy wins! Get your versions recorded
- **Exercise 2:** Reference Day 2 lesson if stuck
- **Exercise 3:** Think about real-world needs
- **Check examples/** folder for guidance

---

## 🎉 Ready to contribute your setup!

Complete at least Exercise 1, submit your PR! 🚀
