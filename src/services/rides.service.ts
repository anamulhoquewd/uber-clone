import z from "zod";
import crypto from "crypto";
import { schemaValidationError } from "../errors/index.js";
import { Ride } from "../models/ride.model.js";
import { getDistanceDuration } from "./maps.service.js";
import mongoose from "mongoose";

export const mongoZ = z
  .any()
  .transform((val) =>
    val instanceof mongoose.Types.ObjectId ? val.toString() : val,
  )
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB User ID format",
  });

const generateOtp = (num: number): string => {
  const min = Math.pow(10, num - 1);
  const max = Math.pow(10, num) - min;
  return (min + (crypto.randomInt(max))).toString();
};

const FARE_RATES = {
  car: { baseFare: 50, perKm: 12, perMinute: 2 },
  bike: { baseFare: 20, perKm: 6, perMinute: 1 },
  auto: { baseFare: 30, perKm: 8, perMinute: 1.5 },
};

const getFareForVehicle = (
  type: "car" | "bike" | "auto",
  distance: number,
  duration: number,
) => {
  const { baseFare, perKm, perMinute } = FARE_RATES[type];
  const distanceCharge = parseFloat((distance * perKm).toFixed(2));
  const durationCharge = parseFloat((duration * perMinute).toFixed(2));
  const totalFare = parseFloat(
    (baseFare + distanceCharge + durationCharge).toFixed(2),
  );
  return { baseFare, distanceCharge, durationCharge, totalFare };
};

export const calculateFare = ({
  distance,
  duration,
}: {
  distance: number;
  duration: number;
}) => ({
  car: getFareForVehicle("car", distance, duration),
  bike: getFareForVehicle("bike", distance, duration),
  auto: getFareForVehicle("auto", distance, duration),
});

export const createRide = async (body: {
  pickup: string;
  dropoff: string;
  userId: string;
  vehicleType: "car" | "bike" | "auto";
}) => {
  const bodyValidatetion = z.object({
    pickup: z.string().min(3, "Pickup location is required"),
    dropoff: z.string().min(3, "Dropoff location is required"),
    userId: mongoZ,
    vehicleType: z.enum(["car", "bike", "auto"]),
  });

  const validationResult = bodyValidatetion.safeParse(body);

  if (!validationResult.success) {
    return {
      error: schemaValidationError(
        validationResult.error,
        "Invalid request body",
      ),
    };
  }

  try {
    const distanceDuration = await getDistanceDuration(body.pickup, body.dropoff);

    if ("error" in distanceDuration || "serverError" in distanceDuration) {
      return distanceDuration;
    }

    const { distance, duration } = distanceDuration.success.data;

    const distanceKm = distance.value / 1000;
    const durationMin = duration.value / 60;

    const fare =  calculateFare({ distance: distanceKm, duration: durationMin })[body.vehicleType].totalFare;

    const newRide = new Ride({
      user: body.userId,
      pickup: body.pickup,
      dropoff: body.dropoff,
      distance,
      duration,
      fare,
      otp: generateOtp(6),
    });

    const ride = await newRide.save();

    return {
      success: {
        success: true,
        data: ride,
        message: "Ride created successfully.",
      },
    };
  } catch (error: any) {
    console.log("Error creating ride:", error);
    return {
      serverError: {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    };
  }
};
