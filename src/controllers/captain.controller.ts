import type { Context } from "hono";
import { badRequestHandler, serverErrorHandler } from "../errors/index.js";
import { captainService } from "../services/index.js";

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
