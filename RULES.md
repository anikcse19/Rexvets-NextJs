# ESLint Rules Configuration

This document outlines the ESLint rules configured for this project, based on `eslint.config.mjs`.

## Core Configurations

The ESLint setup extends the following configurations:
- `next/core-web-vitals`: Provides essential web vitals rules for Next.js applications.
- `next/typescript`: Integrates TypeScript-specific linting rules for Next.js projects.

## Custom Rules

### TypeScript Rules

-   **`@typescript-eslint/no-explicit-any`**: This rule is **disabled (`"off"`)** globally. This means the use of `any` type in TypeScript is permitted without triggering a linting error.

### JSDoc Rules (for `.ts` files excluding specific patterns)

These rules apply to `.ts` files, with the exception of `.d.ts` files, `.tsx` files, files named `route.ts`, and any files within `models/` directories.

-   **`jsdoc/require-jsdoc`**: **Warns (`"warn"`)** if JSDoc comments are missing for:
    -   `FunctionDeclaration` (function declarations)
    -   `MethodDefinition` (method definitions within classes/objects)
    -   `ArrowFunctionExpression` (arrow function expressions)
    -   `FunctionExpression` (function expressions)
    This rule is configured to specifically check these contexts.
-   **`jsdoc/require-description`**: **Warns (`"warn"`)** if JSDoc comments are missing a description.
-   **`jsdoc/require-param`**: **Warns (`"warn"`)** if JSDoc comments are missing `@param` tags for function parameters.
-   **`jsdoc/require-returns`**: **Warns (`"warn"`)** if JSDoc comments are missing `@returns` tags for functions that return a value.

### React Hooks Rules (for `.tsx` files)

These rules apply specifically to `.tsx` files.

-   **`react-hooks/rules-of-hooks`**: **Errors (`"error"`)** if React Hooks are used incorrectly, ensuring they follow the official rules of Hooks.
-   **`react-hooks/exhaustive-deps`**: **Errors (`"error"`)** if dependencies in React Hooks (like `useEffect`, `useCallback`, `useMemo`) are not exhaustively listed. This helps prevent stale closures and ensures effects run when their dependencies change.
