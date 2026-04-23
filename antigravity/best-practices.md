# Next.js Best Practices & Patterns

Welcome to the **Best Practices** guide for this Next.js application. This document outlines the architectural standards, performance optimizations, and design principles followed in this project, particularly focused on Next.js 16+ features and agent-assisted development.

---

## 🚀 Core Architecture (App Router)

### 1. React Server Components (RSC) by Default
*   **Principle**: Keep components as Server Components unless interactivity is required.
*   **Why**: Reduces client-side JavaScript, improves TTI (Time to Interactive), and simplifies data fetching.
*   **Best Practice**: Only add `'use client'` at the leaf nodes (buttons, forms, interactive sliders) to keep the "waterfall" of server components as large as possible.

### 2. Modern Caching with `use cache`
*   **Feature**: Use the `'use cache'` directive for fine-grained caching.
*   **Example**:
    ```tsx
    async function getProduct(id: string) {
      'use cache'
      return await db.product.findUnique({ where: { id } })
    }
    ```
*   **Why**: It provides a more declarative way to cache data fetching and computational work compared to traditional `fetch` options.

### 3. Instant Navigations & `unstable_instant`
*   **Principle**: Ensure the application feels "instant" by validating static shells.
*   **Best Practice**: Export `unstable_instant` from route segments to enforce validation of Suspense boundaries.
    ```tsx
    export const unstable_instant = { prefetch: 'static' }
    ```
*   **Suspense Placement**: Wrap uncached data or dynamic segments (like `params` awaiting) in `<Suspense>` to allow the static parts of the page to render immediately.

---

## 🛠️ Data Fetching & Mutations

### 1. Server Actions
*   **Principle**: Use Server Actions for all data mutations (POST, PUT, DELETE).
*   **Security**: Always validate input using libraries like **Zod** within the action.
*   **UX**: Combine with `useFormStatus` or `useOptimistic` for a snappy user experience.

### 2. Parallel Fetching
*   **Best Practice**: Avoid sequential `await` calls for independent data.
    ```tsx
    // Do this:
    const [user, posts] = await Promise.all([getUser(), getPosts()])
    ```

---

## 🎨 Design & Aesthetics (Premium Standard)

As per project requirements, all UI must feel **Premium** and **State-of-the-art**:

*   **Rich Aesthetics**: Avoid generic colors. Use curated HSL palettes, sleek dark modes, and glassmorphism.
*   **Typography**: Use modern fonts like *Inter*, *Outfit*, or *Roboto* instead of system defaults.
*   **Dynamic Design**:
    *   **Micro-animations**: Use subtle transitions for hover states and loading.
    *   **Hover Effects**: Every interactive element should feel "alive."
*   **No Placeholders**: Use real-looking assets or AI-generated images to maintain a high-end feel during development.

---

## 🔒 Security

*   **Golden Rule**: Never pass sensitive data (PII, secrets) to Client Components.
*   **Auth Verification**: Verify authentication at the **Data Access Layer** (DAL) or inside Server Actions, not just in Middleware.
*   **Input Validation**: Strict schema validation for every entry point.

---

## 📁 Project Structure

This project follows a feature-based organization:

*   `app/`: Routing and layouts.
*   `components/`: UI components (keep them modular and reusable).
*   `lib/`: Utilities, Database clients (Supabase), and shared logic.
*   `data/`: Data access logic and mock datasets.
*   `types/`: Centralized TypeScript definitions.
*   `antigravity/`: Project-specific AI agent configuration and knowledge.

---

## 🤖 Agent-Assisted Development

This repository is optimized for AI coding assistants.

*   **AGENTS.md**: Always check the root `AGENTS.md` before making changes. It points to the version-matched documentation in `node_modules/next/dist/docs/`.
*   **MCP Support**: This project supports the **Model Context Protocol**. Ensure the `next-devtools-mcp` is running to give agents real-time access to build errors and application state.

---

*Last Updated: April 2026*
