# 18. Code Quality, Standards & Engineering Governance

## 1. Governance & Code Style Philosophy

NEXORA adheres to strict software engineering governance principles across both frontend and backend repositories:
- **Clean Architecture & Single Responsibility:** Components focus purely on presentation; custom hooks manage state and caching; backend controllers handle HTTP orchestration; services encapsulate database transactions and domain invariants.
- **Strict Error Handling:** Zero unhandled promise rejections. All async controllers wrap execution in `try...catch` blocks or pass errors to global middleware (`errorHandler.middleware.js`).
- **Standardized Response Contracts:** All API endpoints return uniform JSON envelopes (`{ success, message, data, requestId }`).

---

## 2. Static Code Analysis & ESLint Configuration (`client/eslint.config.js`)

NEXORA employs ESLint 9 flat configuration (`eslint.config.js`):

```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^(motion|[A-Z_].*)$" }],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
```

### Enforced Rules:
1. **`react-hooks/rules-of-hooks`:** Enforces hook execution only at top-level component scope.
2. **`react-hooks/exhaustive-deps`:** Guarantees all reactive variables referenced inside `useMemo` or `useEffect` are declared in the dependency array.
3. **`no-unused-vars`:** Rejects unused variable declarations while preserving Framer Motion primitives (`motion`) and React components (`[A-Z_].*`).

---

## 3. Modular Architecture Standards & Code Smells Prevention

1. **No Ad-Hoc Styling:** Components consume CSS variables defined in [tokens.css](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/styles/tokens.css) or Tailwind utility classes merged via `cn()`, preventing inline style proliferation.
2. **No Hardcoded API Endpoints:** All API requests route through [apiClient.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/apiClient.js) using `import.meta.env.VITE_API_BASE_URL`.
3. **No Direct DOM Mutations:** UI updates rely entirely on React state and React Query cache invalidation.
4. **Decoupled Business Logic:** Backend controllers contain zero SQL statements; all database logic resides inside service functions (`booking.service.js`, `availability.service.js`).
