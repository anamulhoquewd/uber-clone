import type { Context } from "hono";
import { badRequestHandler, serverErrorHandler } from "../errors/index.js";
import { mapsService } from "../services/index.js";

// Register user controller
export const getMapsController = async (c: Context) => {
const address = c.req.query("address");


  if (!address || address.length < 3) {
    return badRequestHandler(c, { message: "Address query parameter is required and must be at least 3 characters long" });
  }
  const response = await mapsService.getAddressCoordinate(address);
  if (response.error) {
    return badRequestHandler(c, response.error);
  }

  if (response.serverError) {
    return serverErrorHandler(c, response.serverError);
  }

  return c.json(response.success, 200);
};

export const getDistanceDurationController = async (c: Context) => {
  const origin = c.req.query("origin");
  const destination = c.req.query("destination");
  
    if (!origin || !destination) {
        return badRequestHandler(c, { message: "Both origin and destination query parameters are required" });
    }

    const response = await mapsService.getDistanceDuration(origin, destination);
    if (response.error) {
        return badRequestHandler(c, response.error);
    }

    if (response.serverError) {
        return serverErrorHandler(c, response.serverError);
    }

    return c.json(response.success, 200);
    
}