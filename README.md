# express-switchware

> A lightweight Express middleware to **conditionally dispatch requests** to different handlers based on the request.

## 🚀 Features

- Simple API — just like a `switch` statement, but for Express
- TypeScript-first, with automatic `.d.ts` type definitions
- Works with any `RequestHandler` or router
- Tiny and dependency-free (except `express`)

---

## 📦 Installation

```bash
npm install express-switchware
```

or with Yarn

```bash
yarn add express-switchware
```

## 🛠 Usage Example 1: API versioning

```ts
// Version-specific handlers
const v1Handler: express.RequestHandler = (req, res) =>
  res.json({ version: "v1", data: "Hello from API v1" });

const v2Handler: express.RequestHandler = (req, res) =>
  res.json({ version: "v2", data: "Hello from API v2" });

app.use(
  "/api",
  expressSwitchware(
    (req) => req.headers["x-api-version"], // pick version from header
    {
      v1: v1Handler,
      v2: v2Handler,
    }
  )
);
```

## 🛠 Usage Example 2: Payment provider switch

```ts
// Handlers for different payment providers
const stripeHandler: express.RequestHandler = (req, res) =>
  res.send("Processed payment with Stripe");
const paypalHandler: express.RequestHandler = (req, res) =>
  res.send("Processed payment with PayPal");

app.post(
  "/checkout",
  expressSwitchware(
    (req) => req.body.provider, // e.g. { "provider": "stripe" }
    {
      stripe: stripeHandler,
      paypal: paypalHandler,
    }
  )
);
```

## ⚡ TypeScript Safety

If you use a schema (e.g. [`Zod`](https://zod.dev/)) or a TypeScript union type for platform, you get compile-time checking:

```ts
type ApiVersion = "v1" | "v2";

app.use(
  "/api",
  expressSwitchware<ApiVersion>(
    (req) => req.headers["x-api-version"] as ApiVersion,
    {
      v1: (req, res) => res.json({ version: "v1" }),
      v2: (req, res) => res.json({ version: "v2" }),
      // 🚫 TypeScript error if you forget one!
    }
  )
);
```

## 🧩 Advanced: Switching Routers

You can even branch entire routers:

```ts
// v1 router
const v1Router = Router();
v1Router.get("/users", (req, res) => res.json([{ id: 1, name: "Alice" }]));

// v2 router
const v2Router = Router();
v2Router.get("/users", (req, res) =>
  res.json([{ id: 1, name: "Alice", email: "alice@example.com" }])
);

// Switch routers by API version header
app.use(
  "/api",
  expressSwitchware(
    (req) => req.headers["x-api-version"], // e.g. X-API-Version: v1
    {
      v1: v1Router,
      v2: v2Router,
    }
  )
);
```

## ❌ Invalid Keys

If the key doesn’t match any mapping, express-switchware will forward an error to your error handler:

```ts
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(400).json({ error: err.message });
  }
);
```
