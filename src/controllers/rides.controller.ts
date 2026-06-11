import type { Context } from "hono";
import { badRequestHandler, serverErrorHandler } from "../errors/index.js";
import { ridesService } from "../services/index.js";

export const createRide = async (c: Context) => {
  const body = await c.req.json();

  const user = c.get("user");

  const response = await ridesService.createRide({ ...body, userId: user._id });

  if ("error" in response && response.error) {
    return badRequestHandler(c, response.error);
  }

  if ("serverError" in response && response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  return c.json(response.success, 201);
};
