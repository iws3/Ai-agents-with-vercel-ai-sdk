# VS Code TypeScript Tips & Tricks

Advanced features for productive TypeScript development.

---

## Essential Shortcuts

- `Ctrl+.` : Quick fixes and autocomplete
- `F2` : Rename symbol across project
- `Ctrl+Shift+O` : Find symbol in document
- `Ctrl+T` : Find symbol workspace-wide
- `Ctrl+G` : Go to line
- `Ctrl+]` : Go to definition
- `Ctrl+Shift+]` : Go to type definition

---

## TypeScript-Specific Features

### Type Hover
Hover over variable to see inferred type.

### Error Messages
Detailed error messages guide fixing issues.

### Refactoring
- Extract method
- Extract interface
- Inline variable
- Convert to async function

---

## Settings

\`\`\`json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
\`\`\`

---

