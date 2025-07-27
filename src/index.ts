import { serve } from "@hono/node-server";
import { Hono } from "hono";
import connectDB from "./config/db.js";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import userRouter from "./routes/user.route.js";
import { notFound } from "./errors/index.js";

const app = new Hono();

// Config MongoDB
connectDB();

app.use(
  logger(),
  prettyJSON(),
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Ensure OPTIONS is handled
    allowHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Health check
app.get("/health", (c) => c.text("API is healthy!"));

// Auth Routes
app.route("/auth", userRouter);

// Global Error Handler
app.onError((error: any, c) => {
  console.error("error: ", error);
  return c.json(
    {
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    },
    500
  );
});

// Not Found Handler
app.notFound((c) => {
  const error = notFound(c);
  return error;
});

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
