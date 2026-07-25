# AGENTS.md

## Project Overview

React + TypeScript application using:

- React Router v8 (Component prop, not element)
- Redux Toolkit (global slices only for auth & user prefs)
- Tanstack Query (server state via wrappers)
- Axios (interceptors with auto‑refresh on 401)
- TailwindCSS + shadcn/ui (raw components in components/ui/, lowercased)
- Custom wrappers (in components/custom/, lowercased)

**Golden rule:** Redux is **never** for server data – that is Tanstack's job. Redux holds auth state, user preferences, and the occasional ephemeral UI flag.

---

## Directory Structure (Canonical)

````src/
├── app/
│   └── routes/
│       └── router.ts
├── components/
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   ├── MainLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   └── sonner.tsx
│   └── custom/
│       ├── button.tsx
│       ├── custom-table.tsx
│       └── select.tsx
├── features/
│   └── auth/
│       ├── pages/
│       │   ├── login.page.tsx
│       │   └── register.page.tsx
│       ├── components/
│       │   ├── auth-card.component.tsx
│       │   └── login-tabs.component.tsx
│       ├── forms/
│       │   └── login.form.tsx
│       ├── api/
│       │   └── auth.api.ts
│       ├── schemas/
│       │   └── login.schema.ts
│       ├── helpers.ts
│       └── types/
│           └── user.types.ts
├── utils/
│   └── date.helpers.ts
├── lib/
│   ├── api/
│   │   ├── http.ts
│   │   ├── query.ts
│   │   └── api.constants.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── auth.slice.ts
│   │       └── prefs.slice.ts
│   └── utils.ts
├── assets/
├── Index.tsx
├── main.tsx
├── App.tsx
└── ...

---

## File Naming Rules (Strict)

| Item                         | Pattern                         | Example                                   |
|------------------------------|---------------------------------|-------------------------------------------|
| Layouts & Guards (exceptions)| PascalCase.tsx                  | MainLayout.tsx, ProtectedRoute.tsx        |
| Feature components           | kebab‑case.component.tsx        | auth-card.component.tsx                   |
| Pages                        | kebab‑case.page.tsx             | login.page.tsx, product-list.page.tsx     |
| Simple forms                 | kebab‑case.form.tsx             | edit-user.form.tsx                        |
| Complex form folders         | kebab‑case.form/ with index.tsx | product-form/                             |
| Feature API files            | kebab‑case.api.ts               | auth.api.ts, users.api.ts                 |
| Schemas                      | kebab‑case.schema.ts            | login.schema.ts (exports schema + type)   |
| Types                        | kebab‑case.types.ts             | user.types.ts                             |
| Redux slices                 | kebab‑case.slice.ts             | auth.slice.ts                             |
| shadcn/ui raw                | lowercase.tsx                   | button.tsx, dialog.tsx                    |
| Custom wrappers              | lowercase.tsx (in custom/)      | button.tsx, select.tsx                    |
| Feature helpers              | helpers.ts                      | helpers.ts                                |
| Global helpers               | <domain>.helpers.ts             | date.helpers.ts, string.helpers.ts        |
| Feature folders              | kebab‑case                      | auth, product-management                  |

**Suffix list:** page, form, component, api, schema, types, slice, helpers.
No other suffixes are allowed. Layouts are the sole exception to the PascalCase rule.

---

## Import Conventions

All intra‑codebase imports must use the `@/` path alias (e.g., `@/lib/api/http`).

**Exception:** Files in the **same directory** that belong to the **same context/layer** may use relative imports (`./`).

Same context = same abstraction layer, same concern, co‑dependent plumbing files.

- **Same dir + same layer → relative:** `src/lib/store/hooks.ts` imports `./store` because both are Redux store plumbing.
- **Same dir + different layer → `@/`:** `src/lib/api/query.ts` imports `@/lib/api/http` because query wrappers and the HTTP client are different abstraction layers.
- **Different dir (always `@/`):** `src/lib/api/http.ts` imports `@/lib/store` — cross‑directory, always use the alias.

```ts
// Same dir, same layer → relative
import type { AppDispatch, RootState } from "./store";

// Same dir, different layer → @/
import { api } from "@/lib/api/http";

// Different dir → always @/
import { store } from "@/lib/store";
```

When in doubt, use `@/`.

### Import Grouping: Values Before Types

Imports must be split into separate statements: **values first, types last**. Never mix values and types in a single import.

```ts
// ✅ Correct — values first, then types
import { useNavigate } from "react-router";
import { useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { School } from "../types/school.types";
import type { DashboardStats } from "../types/dashboard.types";

// ✅ Correct — inline type-only import is fine for single type
import { useFetchQuery } from "@/lib/api/query";
import type { Product } from "../types/product.types";

// ❌ Wrong — mixed value + type in one statement
import { Button, type School } from "@/components/ui/button";

// ❌ Wrong — types mixed in with values
import { useNavigate } from "react-router";
import type { School } from "../types/school.types";
import { useAppSelector } from "@/lib/store";
```

- Value imports (`import { X }`) go first.
- Type-only imports (`import type { X }`) go last.
- Each import statement is either all values or all types, never both.

---

## Export & Declaration Conventions

All feature files (pages, components, forms, API hooks) use **named exports** with **traditional `function` declarations**. No arrow function components.

| Item | Pattern | Example |
|------|---------|---------|
| Layouts | `export default function Name()` | `export default function MainLayout()` |
| Pages | `export function Name()` | `export function DashboardPage()` |
| Feature components | `export function Name()` | `export function SchoolsTable()` |
| Feature forms | `export function Name()` | `export function LoginForm()` |
| API hooks | `export function useXxx()` | `export function useFetchSchools()` |
| Query keys | `export const xxxKeys = {}` | `export const schoolKeys = {}` |
| Schemas | `export const schema = z...` | `export const loginSchema = z.object(...)` |
| Types | `export type Name = ...` | `export type User = {...}` |
| UI components | Private `function` + barrel `export { Name }` | `function Button() {...}; export { Button }` |

- Layouts are the **only** files that use `export default`. Everything else is a named export.
- All React components use `function` declarations, never arrow functions (`const X = () => {}`).
- Query key objects use `export const` (not `export function`).
- Schema/type files export the Zod schema as `export const` and the inferred type as `export type`.

---

## Helpers

Plain exported functions — no React, no hooks, no side effects. Two tiers:

### Feature helpers (`features/<name>/helpers.ts`)

Domain‑specific conversions scoped to one feature. Named `helpers.ts` (the feature folder provides context).

```ts
// features/schools/helpers.ts
import type { DetailEntry } from "./types/school.types";

export function recordToEntries(
  record: Record<string, string | number | boolean> | null | undefined,
): DetailEntry[] { ... }

export function entriesToRecord(
  entries: DetailEntry[] | undefined,
): Record<string, string | number | boolean> { ... }
```

Import with `../helpers` (same feature) or `@/features/<name>/helpers` (cross‑feature, rare).

### Global helpers (`src/utils/<domain>.helpers.ts`)

Reusable, domain‑labelled utilities shared across features. Named `<domain>.helpers.ts` to avoid conflicts.

```
src/utils/
├── date.helpers.ts
├── string.helpers.ts
└── ...
```

Import with `@/utils/date.helpers`.

---

## Redux (Auth & Prefs Only)

- Store lives in src/lib/store/.
- Always import useAppDispatch and useAppSelector from `@/lib/store` (barrel export).
- Never import directly from `@/lib/store/hooks` or use raw useDispatch/useSelector.

Auth slice shape (from auth.slice.ts):

```ts
type User = { name: string; phoneNumber: string };
type AuthState =
  | { accessToken: string; user: User }
  | { accessToken: null; user: null };
````

- Check authentication: state.auth.user !== null.
- Actions: setCredentials, updateAccessToken, updateUser, logout.

---

## API Layer

### Axios Interceptors (http.ts)

- Automatic refresh on first 401.
- If refresh succeeds, retry original request.
- If refresh fails, redirect to login.

### Generic Query Wrappers (query.ts) – Do Not Modify

These are the **global** wrappers used by feature API files. **Do not call them directly** in pages or forms – always use feature‑specific hooks.

**useFetchQuery<TData>(url, key, params?, options?)**

- GET requests only.
- key is a string array (e.g., ['products']).
- If params exist, query key becomes [...key, { params }].

**useApiMutation<TData, TVariables>(url, method, options)**

- Supports post, put, patch, delete.
- options accepts:
  - successMessage?: string
  - errorMessage?: string
  - queryParams?: Record<string, any>
  - invalidateQueries?: { key: string[]; params?: Record<string, any> }[]
  - onSuccess?: (data, variables) => void (runs after toast & invalidation)
  - onError?: (error, variables) => void (runs after error toast)
  - mutationOptions: Omit<UseMutationOptions, 'mutationFn'> – **required**

Important: if you pass onSuccess inside mutationOptions, it will override the internal one – toasts and invalidation will not fire unless you reimplement them. Prefer top‑level callbacks for standard behaviour.

### Feature API Files (api/\*.api.ts)

Each feature can have an `api/` folder containing typed, endpoint‑specific hooks.

**Pattern:**

- Exports typed hooks that wrap `useFetchQuery` and `useApiMutation`.
- Exports a `{feature}Keys` object for query key management.
- Encapsulates API endpoints (using `API` constants) and mutation options.

**Example: `features/products/api/products.api.ts`**

```ts
import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../types/product.types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useFetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useFetchQuery<Product[]>(
    API.PRODUCTS,
    productKeys.list(params || {}),
    params,
  );
}

export function useFetchProductDetail(id: string) {
  return useFetchQuery<Product>(
    `${API.PRODUCTS}/${id}`,
    productKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateProduct() {
  return useApiMutation<Product, CreateProductInput>(API.PRODUCTS, "post", {
    successMessage: "Product created!",
    invalidateQueries: [{ key: productKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateProduct(id: string) {
  return useApiMutation<Product, UpdateProductInput>(
    `${API.PRODUCTS}/${id}`,
    "put",
    {
      successMessage: "Product updated!",
      invalidateQueries: [
        { key: productKeys.lists() },
        { key: productKeys.detail(id) },
      ],
      mutationOptions: {},
    },
  );
}

export function useDeleteProduct() {
  return useApiMutation<void, string>(API.PRODUCTS, "delete", {
    successMessage: "Product deleted!",
    invalidateQueries: [{ key: productKeys.lists() }],
    mutationOptions: {},
  });
}
```

**Rules for feature API files:**

- Always define and export `{feature}Keys` for query invalidation.
- Use `useFetchQuery` for GET, `useApiMutation` for POST/PUT/PATCH/DELETE.
- Lock `TData` and `TVariables` to the feature’s types.
- Never use generic `useFetchQuery` or `useApiMutation` directly in pages or forms – always import from the feature’s `api/` file.

---

## Routing (React Router v8)

- Config file: src/app/routes/router.ts
- Use the Component prop (not element).
- ProtectedRoute lives in components/layouts/ProtectedRoute.tsx.

**ProtectedRoute implementation:**

```tsx
import { Outlet, Navigate, useLocation } from "react-router";
import { useAppSelector } from "@/lib/store";

export function ProtectedRoute() {
  const { user } = useAppSelector((state) => state.auth);  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};
```

- replace prevents back‑button traps.
- state.from lets the login page redirect back after authentication.

**Router structure example:**

```ts
{
  path: '/',
  Component: ProtectedRoute,
  children: [
    { path: '', Component: MainLayout, children: [ /* protected pages */ ] },
  ],
},
{
  path: '/auth',
  Component: AuthLayout,
  children: [
    { path: 'login', Component: LoginPage },
    { path: 'register', Component: RegisterPage },
  ],
}
```

---

## Feature Module Blueprint

Every feature in src/features/ follows this structure:

```
feature-name/
├── pages/
│   └── feature-name.page.tsx       # (or multiple pages)
├── components/
│   ├── feature-name-card.component.tsx
│   └── feature-name-tabs.component.tsx
├── forms/
│   ├── simple.form.tsx             # file for <8 fields
│   └── complex.form/               # folder for >=8 fields, multi‑step, or 2+ schemas
│       ├── index.tsx
│       ├── components/
│       │   ├── step-one.component.tsx
│       │   └── step-two.component.tsx
│       ├── schema.ts
│       └── types.ts
├── api/
│   └── feature-name.api.ts         # typed hooks and query keys
├── schemas/
│   └── feature-name.schema.ts      # exports schema + inferred type
├── helpers.ts                       # optional: domain-specific helper functions
└── types/
    └── feature-name.types.ts
```

### Form: file vs folder threshold

- File if: < 8 fields, one schema, single step.
- Folder if: ≥ 8 fields, or 2+ schemas, or multi‑step wizard.

### Schema exports

Always export both the Zod schema and the inferred type:

```ts
export const productSchema = z.object({ name: z.string(), price: z.number() });
export type ProductFormValues = z.infer<typeof productSchema>;
```

Then import as: import { productSchema, type ProductFormValues } from '../schemas/product.schema';

---

## Quick Code Templates (With Feature API)

### 1. Define the API for a feature

Create `features/products/api/products.api.ts`:

```ts
import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { Product, CreateProductInput } from "../types/product.types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useFetchProducts(params?: { page?: number }) {
  return useFetchQuery<Product[]>(
    API.PRODUCTS,
    productKeys.list(params || {}),
    params,
  );
}

export function useCreateProduct() {
  return useApiMutation<Product, CreateProductInput>(API.PRODUCTS, "post", {
    successMessage: "Product created!",
    invalidateQueries: [{ key: productKeys.lists() }],
    mutationOptions: {},
  });
}
```

### 2. Use the API in a Page (Data Fetch)

```tsx
// features/products/pages/product-list.page.tsx
import { useFetchProducts } from "../api/products.api";
import { ProductCard } from "../components/product-card.component";

export function ProductListPage() {
  const { data, isLoading } = useFetchProducts({ page: 1 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### 3. Use the API in a Form (Mutation)

```tsx
// features/products/forms/product-form.form.tsx (or inside a page)
import { useCreateProduct } from "../api/products.api";
import {
  productSchema,
  type ProductFormValues,
} from "../schemas/product.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function ProductForm() {
  const createProduct = useCreateProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (values: ProductFormValues) => {
    createProduct.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} />
      <input {...form.register("price", { valueAsNumber: true })} />
      <button type="submit" disabled={createProduct.isPending}>
        Create
      </button>
    </form>
  );
};
```

### 4. Invalidate queries after a mutation (manual example)

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../api/products.api";

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: productKeys.lists() });
```

---

## Critical Rules & Pitfalls

1. Never put server data in Redux – Tanstack owns all API state.
2. Never call useNavigate in render – use declarative Navigate for redirects (except event handlers like onClick).
3. `useApiMutation` requires `mutationOptions` – pass `{}` if you have no extra callbacks.
4. Use absolute imports from `@/` (e.g., `@/lib/store`). Exception: same‑directory files with the same context may use relative imports (`./`).
5. Pages should be thin – delegate logic to custom hooks or child components.
6. Feature components use `.component.tsx` suffix – never PascalCase outside layouts/.
7. Feature API files use `.api.ts` suffix and export typed hooks and query keys.
8. When adding a global slice, place it in `lib/store/slices/` with the `.slice.ts` suffix and use `createSlice`.
9. Always import from the feature's `api/` file – never use the generic wrappers directly in pages or forms.

---

This document is your source of truth. Any new file, route, or feature must respect these conventions to keep the codebase consistent and maintainable.
