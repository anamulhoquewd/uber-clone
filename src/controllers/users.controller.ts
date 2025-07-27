import type { Context } from "hono";
import { userService } from "../services/index.js";
import {
  badRequestHandler,
  schemaValidationError,
  serverErrorHandler,
} from "../errors/index.js";
import z from "zod";

// Register user
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

// Login user
export const userLogin = async (c: Context) => {
  const body = await c.req.json();

  const response = await userService.userLoginService(body);

  if (response.error) {
    return badRequestHandler(c, response.error);
  }

  if (response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  return c.json(response.success, 200);
};
