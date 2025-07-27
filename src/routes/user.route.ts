import { userController } from "../controllers/index.js";
import { Hono } from "hono";

const userRouter = new Hono();

// Get All users (Private)
// userRouter.get("/", (c) => userController.getUsers(c));

// Create user (Only can super admin)
userRouter.post("/register", (c) => userController.userResister(c));

export default userRouter;
