import { Hono } from "hono";
import { captainController } from "../controllers/index.js";

const captainRouter = new Hono();

// Register a route for the captain
captainRouter.post("/register", (c) => captainController.captainRegister(c));

export default captainRouter;
