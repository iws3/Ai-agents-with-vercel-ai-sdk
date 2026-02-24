# Publishing TypeScript Libraries

Guide to creating and publishing TypeScript packages to npm.

---

## Setup

### package.json
\`\`\`json
{
  "name": "@myorg/my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build && npm test"
  }
}
\`\`\`

### tsconfig.json
\`\`\`json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  }
}
\`\`\`

---

## Publishing

\`\`\`bash
# Build
npm run build

# Test
npm test

# Publish
npm publish --access public
\`\`\`

---

## Versioning

Follow Semantic Versioning:
- MAJOR.MINOR.PATCH
- 1.2.3: Major=1, Minor=2, Patch=3
- Breaking changes = Major version bump

---

