# Frontend Review Report - Vingo

Date: April 4, 2026
Scope: frontend folder (React + Vite + Redux + Tailwind + Socket.IO)

## 1. Overall Score (out of 10)

Overall Score: 5.3/10

- Architecture and feature coverage are good for an MVP.
- Production hardening is incomplete (security, resilience, UX consistency, test coverage).
- Real-time features are present but need stricter lifecycle and trust boundaries.

## 2. Strengths

- Clear high-level feature split into pages, components, hooks, and redux slices: [frontend/src/pages](frontend/src/pages), [frontend/src/components](frontend/src/components), [frontend/src/hooks](frontend/src/hooks), [frontend/src/redux](frontend/src/redux).
- Redux store is configured correctly for Socket object serialization exceptions: [frontend/src/redux/store.js](frontend/src/redux/store.js#L9).
- Useful custom hooks exist for fetch/update flows (current user, city, orders, shops, items): [frontend/src/hooks/useGetCurrentUser.jsx](frontend/src/hooks/useGetCurrentUser.jsx), [frontend/src/hooks/useGetMyOrders.jsx](frontend/src/hooks/useGetMyOrders.jsx), [frontend/src/hooks/useGetCity.jsx](frontend/src/hooks/useGetCity.jsx).
- Route guards based on auth are implemented in app routing: [frontend/src/App.jsx](frontend/src/App.jsx#L68).
- Socket.IO is actively integrated for delivery events and tracking: [frontend/src/App.jsx](frontend/src/App.jsx#L46), [frontend/src/components/DeliveryBoy.jsx](frontend/src/components/DeliveryBoy.jsx#L152), [frontend/src/pages/TrackOrderPage.jsx](frontend/src/pages/TrackOrderPage.jsx#L30).
- UI visual language is mostly consistent (primary orange theme) and mobile responsiveness is partially handled.

## 3. Critical Issues (must fix)

- High: Broken and risky UI code in signup screen.
  - Invalid import token and broken inline style string can cause runtime/maintenance issues: [frontend/src/pages/SignUp.jsx](frontend/src/pages/SignUp.jsx#L3), [frontend/src/pages/SignUp.jsx](frontend/src/pages/SignUp.jsx#L72).
- High: No root error boundary.
  - Any uncaught render error can blank the entire app: [frontend/src/main.jsx](frontend/src/main.jsx#L8).
- High: Duplicate navigation rendering for user role.
  - Nav is rendered in both Home and UserDashboard, causing duplicated fixed headers and wasted render/layout work: [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx#L47), [frontend/src/components/UserDashboard.jsx](frontend/src/components/UserDashboard.jsx#L168).
- High: Event listener leak risk in horizontal scroll controls.
  - addEventListener and removeEventListener use different function references in first effect, so cleanup does not remove those listeners: [frontend/src/components/UserDashboard.jsx](frontend/src/components/UserDashboard.jsx#L75), [frontend/src/components/UserDashboard.jsx](frontend/src/components/UserDashboard.jsx#L97).
- High: Socket listener lifecycle bug.
  - updateDeliveryLocation listener is attached without cleanup in TrackOrderPage, so remounts can duplicate handlers: [frontend/src/pages/TrackOrderPage.jsx](frontend/src/pages/TrackOrderPage.jsx#L30).
- High: Unsafe trust model in client-side real-time handling.
  - Client accepts socket payloads and applies them directly to state without validating ownership context (must be enforced server-side, and guarded client-side): [frontend/src/pages/MyOrders.jsx](frontend/src/pages/MyOrders.jsx#L20), [frontend/src/pages/TrackOrderPage.jsx](frontend/src/pages/TrackOrderPage.jsx#L30).
- High: Form validation is insufficient in auth and checkout flows.
  - No robust client checks for email/mobile/password complexity and some flows rely on alert only: [frontend/src/pages/SignIn.jsx](frontend/src/pages/SignIn.jsx#L27), [frontend/src/pages/SignUp.jsx](frontend/src/pages/SignUp.jsx#L32), [frontend/src/pages/ForgotPassword.jsx](frontend/src/pages/ForgotPassword.jsx#L47), [frontend/src/pages/CheckOut.jsx](frontend/src/pages/CheckOut.jsx#L102).
- High: Excessive production console logging and alerts.
  - Sensitive operational data and noisy errors are logged broadly: [frontend/src/pages/CheckOut.jsx](frontend/src/pages/CheckOut.jsx#L114), [frontend/src/components/Nav.jsx](frontend/src/components/Nav.jsx#L57), [frontend/src/components/DeliveryBoy.jsx](frontend/src/components/DeliveryBoy.jsx#L44).
- High: Secrets hygiene concerns.
  - Real environment file exists locally and is referenced by app; if leaked historically, keys should be rotated: [frontend/.env](frontend/.env), [frontend/.env.example](frontend/.env.example).

## 4. Moderate Issues

- API integration is scattered and duplicated.
  - Axios calls are spread across hooks/components/pages with repeated withCredentials and inconsistent error handling: [frontend/src/hooks/useGetItemsByCity.jsx](frontend/src/hooks/useGetItemsByCity.jsx#L18), [frontend/src/pages/Shop.jsx](frontend/src/pages/Shop.jsx#L18), [frontend/src/components/UserOrderCard.jsx](frontend/src/components/UserOrderCard.jsx#L19).
- No centralized API layer or interceptors.
  - Missing request timeout defaults, unified error mapping, auth refresh strategy, retry policy.
- Hook contracts are weak.
  - Some hooks do not expose loading and error state to consumers, reducing UX quality: [frontend/src/hooks/useGetMyOrders.jsx](frontend/src/hooks/useGetMyOrders.jsx#L8), [frontend/src/hooks/useGetCity.jsx](frontend/src/hooks/useGetCity.jsx#L14).
- Hardcoded geolocation fallback city/state.
  - Forces wrong location and can lead to wrong inventory/results: [frontend/src/hooks/useGetCity.jsx](frontend/src/hooks/useGetCity.jsx#L21).
- Redux data model inconsistency risk.
  - updateOrderStatus assumes shopOrders is an object, while other code treats it as an array in many flows: [frontend/src/redux/userSlice.js](frontend/src/redux/userSlice.js#L81), [frontend/src/components/UserOrderCard.jsx](frontend/src/components/UserOrderCard.jsx#L44).
- Accessibility gaps.
  - Multiple image alt values are empty; interactive icon-only actions have no aria-labels: [frontend/src/components/FoodCard.jsx](frontend/src/components/FoodCard.jsx#L60), [frontend/src/components/CartItemCard.jsx](frontend/src/components/CartItemCard.jsx#L21), [frontend/src/components/CategoryCard.jsx](frontend/src/components/CategoryCard.jsx#L6).
- No route-level code splitting.
  - App imports all pages eagerly, increasing initial bundle cost: [frontend/src/App.jsx](frontend/src/App.jsx#L4).
- Vite config is minimal for production.
  - No manual chunk strategy, no bundle thresholds, no explicit sourcemap policy: [frontend/vite.config.js](frontend/vite.config.js#L6).
- SEO baseline is incomplete.
  - Missing description/OG/Twitter tags and keeps default vite favicon: [frontend/index.html](frontend/index.html#L5), [frontend/index.html](frontend/index.html#L7).
- Quality process is underpowered.
  - ESLint rules are basic and do not discourage console usage or accessibility regressions: [frontend/eslint.config.js](frontend/eslint.config.js#L23).
- Test readiness is low.
  - No unit/integration/e2e test setup in package scripts: [frontend/package.json](frontend/package.json#L6).

## 5. UI/UX Improvements

- Remove duplicate fixed nav and establish one shell layout.
  - Keep a single app shell for authenticated views with content outlet.
- Replace alert-based interactions with in-app toast notifications and inline field errors.
  - Current alerts break flow and feel unpolished: [frontend/src/pages/CheckOut.jsx](frontend/src/pages/CheckOut.jsx#L150), [frontend/src/pages/ForgotPassword.jsx](frontend/src/pages/ForgotPassword.jsx#L49).
- Improve form UX consistency.
  - Add disabled states, helper text, input masks for phone/OTP, and stronger error copy.
- Standardize spacing and typographic rhythm.
  - Some pages use arbitrary classes and inconsistent sizing; adopt a spacing scale per layout region.
- Improve accessibility baseline.
  - Add meaningful alt text, keyboard-visible focus styles, aria-labels for icon-only buttons, and semantic landmarks.
- Add skeletons for loading-heavy views.
  - For user profile, shops, items, orders, and track page maps.

## 6. Performance Improvements

- Add route-level lazy loading with suspense fallbacks for all heavy pages.
- Debounce search API calls in Nav.
  - Query currently triggers on each keystroke: [frontend/src/components/Nav.jsx](frontend/src/components/Nav.jsx#L70).
- Memoize leaf components receiving stable props.
  - Candidate components: Food cards, cart cards, order cards.
- Reduce unnecessary rerenders.
  - Split selectors and avoid broad object selection when only one field is needed.
- Fix listener duplication in UserDashboard and TrackOrderPage.
  - This affects CPU usage and event churn over long sessions.
- Add image loading strategy.
  - Use loading="lazy", explicit dimensions, and compressed modern formats.

## 7. Architecture Improvements

- Introduce a scalable frontend structure:
  - src/app: app bootstrap, providers, routes, app-shell
  - src/features/auth, src/features/orders, src/features/shop, src/features/delivery
  - src/shared/ui, src/shared/hooks, src/shared/lib, src/shared/api
  - src/entities for typed domain models if moving toward TypeScript

- Add centralized API client:
  - api/client.js for axios instance
  - api/interceptors.js for auth/error normalization
  - api/endpoints per feature
- Normalize async state handling:
  - Prefer feature hooks returning data, loading, error, refetch.
  - Consider RTK Query to remove boilerplate and improve cache consistency.
- Introduce AppLayout and role-specific layouts.
  - Avoid cross-page duplication of Nav and role checks.
- Add ErrorBoundary + fallback UIs at root and route boundaries.
- Formalize socket layer.
  - Create useSocketEvents hook modules by feature with strict setup/cleanup and typed payload guards.

## 8. Refactored Code Examples

### Example A: Centralized API Client

File suggestion: src/shared/api/client.js

javascript
import axios from "axios";

export const api = axios.create({
baseURL: import.meta.env.VITE_BACKEND_URL,
withCredentials: true,
timeout: 12000,
});

api.interceptors.response.use(
(response) => response,
(error) => {
const message = error?.response?.data?.message || "Request failed";
return Promise.reject({ ...error, normalizedMessage: message });
}
);

### Example B: Route-level Code Splitting

File suggestion: src/App.jsx

javascript
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const CheckOut = lazy(() => import("./pages/CheckOut"));

function RouteFallback() {
return <div className="p-6 text-gray-600">Loading page...</div>;
}

<Suspense fallback={<RouteFallback />}>
<Routes>
<Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
<Route path="/checkout" element={userData ? <CheckOut /> : <Navigate to="/signin" />} />
</Routes>
</Suspense>

### Example C: Safe Socket Listener Cleanup

File suggestion: src/pages/TrackOrderPage.jsx

javascript
useEffect(() => {
if (!socket) return;

const handleDeliveryLocation = ({ deliveryBoyId, latitude, longitude }) => {
setLiveLocations((prev) => ({
...prev,
[deliveryBoyId]: { lat: latitude, lon: longitude },
}));
};

socket.on("updateDeliveryLocation", handleDeliveryLocation);
return () => socket.off("updateDeliveryLocation", handleDeliveryLocation);
}, [socket]);

### Example D: Root Error Boundary

File suggestion: src/app/ErrorBoundary.jsx

javascript
import React from "react";

export class ErrorBoundary extends React.Component {
constructor(props) {
super(props);
this.state = { hasError: false };
}

static getDerivedStateFromError() {
return { hasError: true };
}

componentDidCatch(error, info) {
if (import.meta.env.DEV) {
console.error("Unhandled UI error", error, info);
}
}

render() {
if (this.state.hasError) {
return <div className="p-6">Something went wrong. Please refresh.</div>;
}
return this.props.children;
}
}

### Example E: Reusable Validation Utility

File suggestion: src/shared/lib/validation.js

javascript
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
export const isValidPhone = (value) => /^\d{10}$/.test(value);

## Additional Notes by Requested Review Areas

- Project Structure Review:
  - Good start, but missing shared api/service layer, shared utils layer, and app shell/layout folder.
- Architecture Analysis:
  - Mostly role-driven large components. Needs better decomposition into container/presentational segments.
- API Integration:
  - Works functionally but is not scalable due to scattered call logic and no interceptors.
- Security Check:
  - Frontend key handling and socket trust boundaries need hardening.
- Error Handling:
  - No error boundary; mixed alert and inline error handling; no global strategy.
- State Management:
  - Redux usage is appropriate, but data-shape consistency and query caching strategy need improvement.
- Socket.IO Validation:
  - Socket usage exists and cleanup is partially correct; one listener cleanup bug found and trust model needs tightening.
- Build and Optimization:
  - Vite config is too basic for production scale.
- Production Readiness:
  - Not yet production ready; needs hardening sprint before launch.

## 30-Day Production Hardening Plan

Week 1

- Fix critical bugs in SignUp, duplicate Nav, socket cleanup, and UserDashboard listener cleanup.
- Add ErrorBoundary and standard notification system.

Week 2

- Build shared api client and migrate all axios calls.
- Add form validation utilities and align all auth/checkout forms.

Week 3

- Add lazy-loaded routes, image loading optimization, selector optimizations.
- Strengthen eslint rules and add pre-commit lint check.

Week 4

- Add smoke tests for auth/order/checkout/track flows.
- Add SEO meta tags and deployment-grade Vite build settings.
