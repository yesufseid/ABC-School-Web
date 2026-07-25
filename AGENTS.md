# FRONTEND_AGENT.md

## Project Overview

React + TypeScript application using:

- React Router v7 (Component prop, not element)
- Redux Toolkit (global slices only for auth & user prefs)
- Tanstack Query (server state via wrappers)
- Axios (interceptors with auto‑refresh on 401)
- TailwindCSS + shadcn/ui (raw components in components/ui/, lowercased)
- Custom wrappers (in components/custom/, lowercased)

**Golden rule:** Redux is **never** for server data – that is Tanstack's job. Redux holds auth state, user preferences, and the occasional ephemeral UI flag.

---

## Directory Structure (Canonical)

```src/
├── app/
│   └── routes/
│       └── router.ts                # Component‑based routes
├── components/
│   ├── layouts/                     # Only PascalCase files live here
│   │   ├── AuthLayout.tsx
│   │   ├── MainLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── ui/                          # shadcn/ui raw (lowercase .tsx)
│   │   ├── button.tsx
│   │   └── sonner.tsx
│   └── custom/                      # Your wrappers (lowercase .tsx)
│       ├── button.tsx               # re‑exports ui/button with defaults
│       └── select.tsx               # abstracts {label, value}[] for shadcn
├── features/                        # Domain modules (kebab‑case)
│   └── auth/                        # Example feature
│       ├── pages/
│       │   ├── login.page.tsx
│       │   └── register.page.tsx
│       ├── components/              # feature‑scoped components
│       │   ├── auth-card.component.tsx
│       │   └── login-tabs.component.tsx
│       ├── forms/                   # file or folder (see rules)
│       │   └── login.form.tsx
│       ├── schemas/
│       │   └── login.schema.ts      # Zod + inferred type
│       └── types/
│           └── user.types.ts
├── lib/
│   ├── api/
│   │   ├── http.ts                  # axios instance + interceptors
│   │   ├── query.ts                 # useFetchQuery / useApiMutation
│   │   └── api.constants.ts         # endpoint constants
│   ├── store/
│   │   ├── index.ts
│   │   ├── store.ts
│   │   ├── hooks.ts                 # typed useAppDispatch/Selector
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
| Schemas                      | kebab‑case.schema.ts            | login.schema.ts (exports schema + type)   |
| Types                        | kebab‑case.types.ts             | user.types.ts                             |
| Redux slices                 | kebab‑case.slice.ts             | auth.slice.ts                             |
| shadcn/ui raw                | lowercase.tsx                   | button.tsx, dialog.tsx                    |
| Custom wrappers              | lowercase.tsx (in custom/)      | button.tsx, select.tsx                    |
| Feature folders              | kebab‑case                      | auth, product-management                  |

**Suffix list:** page, form, component, schema, types, slice.
No other suffixes are allowed. Layouts are the sole exception to the PascalCase rule.

---

## Redux (Auth & Prefs Only)

- Store lives in src/lib/store/.
- Always import useAppDispatch and useAppSelector from @/lib/store/hooks.
- Never use raw useDispatch or useSelector.

Auth slice shape (from auth.slice.ts):

    type User = { name: string; phoneNumber: string };
    type AuthState =
      | { accessToken: string; user: User }
      | { accessToken: null; user: null };

- Check authentication: state.auth.accessToken !== null.
- Actions: setCredentials, updateAccessToken, updateUser, logout.

---

## API Layer

### Axios Interceptors (http.ts)
- Automatic refresh on first 401.
- If refresh succeeds, retry original request.
- If refresh fails, redirect to login.

### Query Wrappers (query.ts)

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

### API Constants (api.constants.ts)
Define all endpoints in a single object:

    export const API = {
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
      },
      PRODUCTS: '/products',
    } as const;

Always use API.* – never hardcode URL strings.

---

## Routing (React Router v7)

- Config file: src/app/routes/router.ts
- Use the Component prop (not element).
- ProtectedRoute lives in components/layouts/ProtectedRoute.tsx.

**ProtectedRoute implementation:**

    import { Outlet, Navigate, useLocation } from 'react-router-dom';
    import { useAppSelector } from '@/lib/store/hooks';

    export const ProtectedRoute = () => {
      const { accessToken } = useAppSelector(state => state.auth);
      const location = useLocation();

      if (!accessToken) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
      }
      return <Outlet />;
    };

- replace prevents back‑button traps.
- state.from lets the login page redirect back after authentication.

**Router structure example:**

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

---

## Feature Module Blueprint

Every feature in src/features/ follows this structure:

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
    ├── schemas/
    │   └── feature-name.schema.ts      # exports schema + inferred type
    └── types/
        └── feature-name.types.ts

### Form: file vs folder threshold
- File if: < 8 fields, one schema, single step.
- Folder if: ≥ 8 fields, or 2+ schemas, or multi‑step wizard.

### Schema exports
Always export both the Zod schema and the inferred type:

    export const loginSchema = z.object({ email: z.string().email() });
    export type LoginFormValues = z.infer<typeof loginSchema>;

Then import as: import { loginSchema, type LoginFormValues } from '../schemas/login.schema';

---

## Quick Code Templates

### Page with data fetch

    // features/products/pages/product-list.page.tsx
    import { useFetchQuery } from '@/lib/api/query';
    import { API } from '@/lib/api/api.constants';

    export const ProductListPage = () => {
      const { data, isLoading } = useFetchQuery<Product[]>(
        API.PRODUCTS,
        ['products'],
        { page: 1 },
      );
      // render...
    };

### Mutation

    const mutation = useApiMutation<Product, CreateProductInput>(
      API.PRODUCTS,
      'post',
      {
        successMessage: 'Product created!',
        invalidateQueries: [{ key: ['products'] }],
        mutationOptions: {},
      }
    );

    // call mutation.mutate(formData)

---

## Critical Rules & Pitfalls

1. Never put server data in Redux – Tanstack owns all API state.
2. Never call useNavigate in render – use declarative Navigate for redirects (except event handlers like onClick).
3. useApiMutation requires mutationOptions – pass {} if you have no extra callbacks.
4. Use absolute imports from @/ (e.g., @/lib/store/hooks).
5. Pages should be thin – delegate logic to custom hooks or child components.
6. Feature components use .component.tsx suffix – never PascalCase outside layouts/.
7. When adding a global slice, place it in lib/store/slices/ with the .slice.ts suffix and use createSlice.

---

This document is your source of truth. Any new file, route, or feature must respect these conventions to keep the codebase consistent and maintainable.
