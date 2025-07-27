import { verify } from "hono/jwt";
import { config } from "dotenv";
import User from "../models/users.model.js";
import { authenticationError } from "../errors/index.js";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import Blacklist from "../models/black-list.model.js";
config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

// Check if user is authenticated
export const authenticated = async (c: Context, next: Next) => {
  const token =
    getCookie(c, "token") ||
    c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return authenticationError(c);
  }

  // Check if token is blacklisted
  const isBlacklisted = await Blacklist.findOne({ token });
  if (isBlacklisted) {
    return authenticationError(c);
  }

  try {
    const { id } = await verify(token, JWT_ACCESS_SECRET);

    const user = await User.findById(id).select("-password -refresh");

    if (!user) {
      return authenticationError(c);
    }

    c.set("user", user);
    return next();
  } catch (error) {
    return authenticationError(c);
  }
};
