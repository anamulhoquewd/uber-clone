import { Hono } from "hono";
import { captainController } from "../controllers/index.js";
import { authenticateCaptain } from "../middlewares/auth.middleware.js";

const captainRouter = new Hono();

// Register a route for the captain
captainRouter.post("/register", (c) => captainController.captainRegister(c));

// Login route for the captain
captainRouter.post("/login", (c) => captainController.captainLogin(c));

// Get captain profile route
captainRouter.get("/profile", authenticateCaptain, (c) =>
  captainController.getCaptainProfile(c)
);

// Logout captain route
captainRouter.post("/logout", authenticateCaptain, (c) =>
  captainController.captainLogout(c)
);

export default captainRouter;
