import { ridesController } from "../controllers/index.js";
import { Hono } from "hono";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const rideRouter = new Hono();

// Create Ride
rideRouter.post("/register", authenticateUser, (c) => ridesController.createRide(c));

export default rideRouter;