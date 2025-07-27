import type { Context } from "hono";
import { badRequestHandler, serverErrorHandler } from "../errors/index.js";
import { captainService } from "../services/index.js";
import { getCookie, setCookie } from "hono/cookie";
import Blacklist from "../models/black-list.model.js";

// Register captain controller
export const captainRegister = async (c: Context) => {
  const body = await c.req.json();

  const response = await captainService.captainService(body);

  if (response.error) {
    return badRequestHandler(c, response.error);
  }

  if (response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  return c.json(response.success, 201);
};

// Login captain controller
export const captainLogin = async (c: Context) => {
  const body = await c.req.json();

  const response = await captainService.captainLoginService(body);

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

// Get captain profile controller
export const getCaptainProfile = async (c: Context) => {
  const captain = c.get("captain");

  return c.json(
    {
      success: true,
      data: captain,
      message: "Captain profile retrieved successfully.",
    },
    200
  );
};

// Logout captain controller
export const captainLogout = async (c: Context) => {
  const token =
    getCookie(c, "token") ||
    c.req.header("Authorization")?.replace("Bearer ", "");

  await new Blacklist({ token }).save();

  // Clear the cookie
  setCookie(c, "token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

  return c.json({ success: true, message: "Logged out successfully." }, 200);
};
