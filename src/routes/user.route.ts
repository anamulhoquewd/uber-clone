import { userController } from "../controllers/index.js";
import { Hono } from "hono";
import { authenticated } from "../middlewares/auth.middleware.js";

const userRouter = new Hono();

// Register user route
userRouter.post("/register", (c) => userController.userResister(c));

// Login user route
userRouter.post("/login", (c) => userController.userLogin(c));

// Get user profile route
userRouter.get("/profile", authenticated, (c) =>
  userController.getUserProfile(c)
);

// Logout user route
userRouter.post("/logout", authenticated, (c) => userController.userLogout(c));

export default userRouter;
