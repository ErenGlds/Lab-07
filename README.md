# Assignment 7 - Online Shop

A multi-page React shop built with Vite, react-router, Context + useReducer and Zustand, using the DummyJSON API.

## File organization

```
src/
 ├─ api/         productsApi.js (fetchProducts, fetchProduct), authApi.js (simulated login)
 ├─ hooks/       useFetch.js (loading/error/data with useReducer + abort), useLocalStorage.js
 ├─ context/     AuthContext.jsx (AuthProvider, useAuth)
 ├─ store/       cartStore.js (Zustand cart with localStorage persistence)
 ├─ components/  Layout, NavBar, ProductCard, ProtectedRoute
 ├─ pages/       Home, ProductList, ProductDetail, Cart, Login, NotFound
 ├─ App.jsx      route configuration
 └─ main.jsx     BrowserRouter and AuthProvider setup
```

Demo account: the student email as username, password `demo123456`.

## Reasoning questions

**1. State choices.**

- Signed-in user: in `AuthContext` with `useReducer`. It changes rarely and is needed by a few distant components (NavBar, Login, ProtectedRoute).
- Cart: in a Zustand store, because it changes often and is read by many components, and selectors keep re-renders small.
- Filter values: in the URL query string, so a filtered view can be shared, reloaded and opened directly.
- Product list: in `useFetch` (a reducer inside the hook) used by `ProductList`. It is server data owned by that page, so it does not need to be global.
- Theme: in `useLocalStorage` inside `Layout`, so it survives reloads without any global store.

**2. Context versus store.** Every component that reads a Context value re-renders when any part of that value changes. For a user that rarely changes, this is fine. If the cart lived in Context, every cart change would re-render all consumers, including the NavBar and anything else reading the context. With Zustand, a component subscribes only to the slice it selects, so the NavBar re-renders only when the item count changes. Putting the user in Zustand would work, but it adds nothing for such rarely changing state, and the Context + reducer pattern is the one this assignment asks for.

**3. Custom hooks.** `useFetch` shares the logic: the reducer, the loading/error/data states, the `AbortController` creation and the cleanup on dependency change or unmount. It does not share state: each call creates its own reducer state, so `ProductList` and `ProductDetail` each keep their own data and never see each other's results.

**4. Route parameters.** The `id` from `useParams` is always a string. It mattered in the "Next product" link, where I convert it with `Number(id) + 1` to compute the next id. Without the conversion, `"1" + 1` would give `"11"`.

**5. Protected routes.** `ProtectedRoute` only runs in the browser, so a user can change the JavaScript, edit state in dev tools or call the API directly and skip it. It only improves the user experience by hiding pages. To be secure, the server must verify identity (for example a session or token), check it on every request for protected data, and refuse unauthorized requests.

**6. Deep links.** On a plain static file server, reloading `/products/3` asks the server for a file at that path. No such file exists, so the server returns a 404. The Vite development server has a fallback that serves `index.html` for unknown paths, so the React app loads and react-router renders the matching page on the client. A static host needs a similar rewrite rule to `index.html`.

## Self-study notes

- **Updating one query parameter:** `setSearchParams` accepts a function that receives the previous params. I copy them with `new URLSearchParams(prev)`, then `set` or `delete` one key, so the other parameters are kept.
- **Safe store initialization:** `loadItems` in `cartStore.js` reads `localStorage` inside `try/catch`, checks that the parsed value is an array and that each item has the right fields, and falls back to an empty cart otherwise. Saving is done with `useCartStore.subscribe`, outside React.
- **Light/dark theme:** the theme name is added as a class on the wrapper element, and CSS custom properties (`--bg`, `--text`, ...) are redefined under `.app.dark`.

## Challenges

- Vite asked how to proceed because the cloned repository was not empty, and I had to choose "Ignore files and continue" so `.git` was kept.
- Some terminal commands differ between PowerShell and bash (for example `mkdir`).
- ESLint's `react-refresh/only-export-components` warned about exporting `useAuth` from the context file. I disabled the rule for that line because the assignment requires both exports in `AuthContext.jsx`.
- `fetch` does not reject on 404 or 500, so I throw an error manually and attach the status to tell "product not found" apart from other errors.
- Keeping filtered results derived during render instead of in state or an effect.
