import type { Context } from "hono";
import { userService } from "../services/index.js";
import { badRequestHandler, serverErrorHandler } from "../errors/index.js";
import { getCookie, setCookie } from "hono/cookie";
import BlackList from "../models/black-list.model.js";

// Register user controller
export const userResister = async (c: Context) => {
  const body = await c.req.json();

  const response = await userService.userResisterService(body);

  if (response.error) {
    return badRequestHandler(c, response.error);
  }

  if (response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  return c.json(response.success, 201);
};

// Login user controller
export const userLogin = async (c: Context) => {
  const body = await c.req.json();

  const response = await userService.userLoginService(body);

  if (response.error) {
    return badRequestHandler(c, response.error);
  }

  if (response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  // Set token in cookie
  setCookie(c, "token", response.success.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });

  return c.json(response.success, 200);
};

// Get user profile controller
export const getUserProfile = async (c: Context) => {
  const user = c.get("user");

  return c.json(
    {
      success: true,
      data: user,
      message: "User profile retrieved successfully.",
    },
    200
  );
};

// User logout controller
export const userLogout = async (c: Context) => {
  const token =
    getCookie(c, "token") ||
    c.req.header("Authorization")?.replace("Bearer ", "");

  await new BlackList({ token }).save();

  // Clear the cookie
  setCookie(c, "token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  return c.json({ success: true, message: "Logged out successfully." }, 200);
};
