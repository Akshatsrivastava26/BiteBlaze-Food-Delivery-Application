# Backend Code Review Report

Date: 2026-04-04
Scope: backend folder (Node.js, Express.js, MongoDB/Mongoose, Socket.IO)

## Overall Score (out of 10)

4.3/10

## Strengths

- Clear domain-oriented folder split: controllers, routes, models, middleware, config, utils.
- Mongoose relations are modeled for core entities (User, Shop, Item, Order, DeliveryAssignment).
- Geospatial support exists for delivery location with a 2dsphere index on user location.
- Cookie-based authentication with httpOnly enabled.
- Real-time delivery/order updates are integrated with Socket.IO.
- Basic OTP flows and payment integration are already implemented.

## Critical Issues (must fix) 

1. ✅✅ Done Delivery OTP verification flow is functionally broken and can throw runtime errors.

- In verifyDeliveryOtp, the condition uses `shopOrder.otpExpires || shopOrder.otpExpires < Date.now()`, so any non-null expiry is treated as a failure and valid OTPs are rejected.
- The cleanup query references `assignedDeliveryBoy`, which is undefined in scope and can crash the request path.
- sendDeliveryOtpMail is invoked in the order controller but not imported, which can trigger a runtime ReferenceError when sending OTP.
- Impact: delivery confirmation can fail for valid users and intermittently return 500 responses in production.

2. Missing authorization checks allow horizontal privilege escalation.

- Item edit/delete endpoints do not verify item ownership against authenticated owner.
- Order status update does not verify that request user owns the shopOrder being modified.
- Order detail endpoint fetches any order by ID without ownership or role guard.
- Delivery OTP endpoints do not verify assigned delivery partner/owner relationship for the given shopOrder.
- Impact: authenticated users can manipulate resources belonging to others.

3. Sensitive user data exposure risk.

- Auth responses return full user documents directly.
- User schema password field is not excluded by default.
- Impact: accidental password hash leakage to clients/logs and enlarged breach blast radius.

4. Password-reset OTP expiry is not persisted correctly.

- sendOtp computes expiry in a local variable but does not assign it to the user document.
- verifyOtp compares with user.otpExpires, causing logical inconsistency.
- Impact: OTP flow can fail unpredictably and reduce account recovery reliability.

5. Security hardening baseline is missing for internet exposure.

- No helmet, no rate limiting, no request-size hard limits, no abuse controls.
- Cookies are forced secure false and sameSite strict for all environments.
- Impact: higher exploitability and abuse risk in production.

## Moderate Issues

1. No centralized error-handling middleware.

- Most controllers do local try/catch with inconsistent payload shape and status semantics.
- Errors are sometimes returned as interpolated strings.

2. Route semantics and REST consistency are weak.

- Mutations use POST/GET in non-standard ways (for example accept-order via GET).
- Path naming is action-centric instead of resource-centric.

3. Multer storage uses original filename and writes directly into public directory.

- No MIME type validation.
- No file size limits.
- Filename collision and unsafe filename risks.

4. Regex construction from user input is not escaped.

- City and search query patterns are directly converted into regex.
- Risk of regex-based denial of service under crafted inputs.

5. Socket events trust client-supplied userId and broadcast broad updates.

- No socket-level auth middleware to bind socket identity to JWT.
- updateLocation emits to all clients with io.emit.

6. Performance inefficiencies.

- N+1 shop lookups during order placement.
- Repeated populate calls and heavy payload population even when not always needed.
- Limited use of lean for read-only lists.

7. Missing schema indexes for common query patterns.

- Order queries on nested fields and assignment lookups are likely to degrade under load.

8. Production operations gaps.

- No structured logging strategy.
- No health/readiness endpoint.
- No graceful shutdown for DB/socket.

## Suggestions for Improvement

- Add layered boundaries:
  - Route layer: request parsing and response mapping only.
  - Controller layer: orchestration only.
  - Service layer: business rules and workflows.
  - Repository/data layer: query composition and projection.
  - Validation layer: Joi/Zod/express-validator schemas per endpoint.
- Introduce consistent API response envelope and error codes.
- Add API versioning now (for example /api/v1) before public growth.
- Add authorization policy helpers (owner of item, owner of shopOrder, assigned delivery boy).
- Add pagination for list endpoints and field projection defaults.

## Architecture Improvements

- Move payment, order assignment, OTP, and notification logic out of controllers into services.
- Create repositories for Order, DeliveryAssignment, Item with reusable query methods.
- Create policy module for role/ownership checks:
  - canEditItem(userId, itemId)
  - canUpdateShopOrderStatus(userId, orderId, shopId)
  - canAccessOrder(userId, orderId, role)
- Introduce async wrapper + centralized error middleware to eliminate repeated try/catch boilerplate.
- Define DTO mappers to avoid leaking raw Mongoose docs.

## Security Fixes

- Use input validation middleware on every endpoint.
- Validate and sanitize ObjectId params before hitting Mongoose.
- Escape user-input regex or replace with indexed normalized fields.
- Make cookie options environment-aware:
  - secure true in production
  - sameSite none only when cross-site cookie is required with https
- Add rate limiters:
  - strict limiter on auth, OTP, payment verification routes
  - general limiter globally
- Add helmet and set trust proxy appropriately for deployment.
- Do not return token in response body when using cookie auth.
- Mark password field as select false in schema and create safe user serializers.
- Add socket auth middleware using JWT in handshake and reject anonymous events.

## Performance Improvements

- Add indexes:
  - Order: user, createdAt
  - Order: shopOrders.owner, shopOrders.status, shopOrders.deliveredAt
  - Shop: city, owner(unique)
  - Item: shop, category
  - DeliveryAssignment: assignedTo+status, brodcastedTo+status, order+shopOrderId
- Use lean and select for read-heavy endpoints.
- Reduce populate depth; fetch only needed fields.
- Replace per-shop fetch in placeOrder with one bulk query using $in.
- Add pagination and limit defaults for list endpoints.
- Consider Redis for hot read caching (shops/items by city).

## Express and API Design Notes

- Add global middlewares in index:
  - helmet
  - compression
  - express.json with size limit
  - rate limiter
  - centralized error handler
- Normalize status codes:
  - 200 for successful reads/updates
  - 201 only for created resources
  - 401 unauthorized, 403 forbidden, 404 not found
- Rename endpoints gradually to REST shape:
  - POST /orders
  - PATCH /orders/:orderId/shop-orders/:shopOrderId/status
  - POST /orders/:orderId/shop-orders/:shopOrderId/accept

## Error Handling Review

- Good: most handlers use try/catch.
- Issues:
  - inconsistent response formats.
  - user-facing internal error strings.
  - missed null checks before dereferencing in some handlers.
- Recommendation:
  - Throw typed application errors from services.
  - Map errors in one middleware with consistent schema.

## Code Quality Review

- Duplicate imports and repeated controller import lines can be consolidated.
- Several long controller functions combine validation, business logic, data access, and socket emissions.
- Some naming/typo issues reduce maintainability (for example brodcastedTo).
- Action-oriented route names make API harder to evolve.

## Socket.IO Review

- Current implementation updates online status and locations, which is a good foundation.
- Must fix:
  - authenticate sockets before accepting identity/updateLocation events.
  - avoid trusting payload userId; bind user id from verified token.
  - avoid global location broadcast unless explicitly required; emit to scoped rooms.
  - add rate control for updateLocation events.

## ENV and Config Management

- dotenv is initialized in multiple modules; centralize environment initialization in one startup module.
- Add strict env validation at boot (required keys for DB, JWT, Razorpay, Mail, Cloudinary).
- Move third-party client creation into dedicated provider modules with startup checks.

## Production Readiness

Current status: not production-ready.

Must-have additions before production:

- security middleware stack (helmet, limiter, compression).
- centralized logging with correlation ids.
- graceful shutdown hooks for HTTP server, Socket.IO, and Mongo connection.
- health and readiness endpoints.
- automated tests for auth, order lifecycle, OTP, and role-based authorization.

## Refactored Code Examples

### 1) Centralized async handler and error middleware

Use a reusable async wrapper and a single error middleware for consistency.

    // middleware/asyncHandler.js
    export const asyncHandler = (fn) => (req, res, next) =>
      Promise.resolve(fn(req, res, next)).catch(next);

    // middleware/errorHandler.js
    export const errorHandler = (err, req, res, next) => {
      const status = err.statusCode || 500;
      res.status(status).json({
        message: err.publicMessage || "Internal server error",
        code: err.code || "INTERNAL_ERROR",
      });
    };

### 2) Ownership guard example for item update/delete

    // services/policy.service.js
    export const assertItemOwnedByUser = async ({ itemId, userId, Item, Shop }) => {
      const item = await Item.findById(itemId).select("shop");
      if (!item) {
        const err = new Error("Item not found");
        err.statusCode = 404;
        throw err;
      }
      const shop = await Shop.findOne({ _id: item.shop, owner: userId }).select("_id");
      if (!shop) {
        const err = new Error("Forbidden");
        err.statusCode = 403;
        throw err;
      }
      return item;
    };

### 3) Fix delivery OTP verification logic

    // controller snippet
    if (!shopOrder.deliveryOtp || shopOrder.deliveryOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (!shopOrder.otpExpires || shopOrder.otpExpires < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

### 4) Cookie options by environment

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

## Priority Action Plan (recommended order)

1. Fix critical runtime and authz flaws in order and item flows.
2. Add validation layer and ObjectId guards for all endpoints.
3. Implement centralized error handling and safe response serializers.
4. Add production security middleware and rate limits.
5. Add indexes and optimize heavy query/populate paths.
6. Refactor controllers into services/policies/repositories.
7. Add integration tests for auth, order lifecycle, and authorization boundaries.
