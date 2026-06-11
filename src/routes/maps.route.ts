import { Hono } from "hono";
import { mapsController } from "../controllers/index.js";

const mapsRoute = new Hono();

// Get coordinates for an address
mapsRoute.get("/get-coordinates", (c) => mapsController.getMapsController(c));

// Get distance and duration between two coordinates
mapsRoute.get("/get-distance-duration", (c) => mapsController.getDistanceDurationController(c));

// Get route suggestions
mapsRoute.get("/get-route-suggestions", (c) => mapsController.getRouteSuggestionsController(c));    

export default mapsRoute;