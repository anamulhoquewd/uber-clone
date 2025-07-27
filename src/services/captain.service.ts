import z from "zod";
import { schemaValidationError } from "../errors/index.js";
import Captain, { type ICaptain } from "../models/captain.model.js";

// Register a new captain service
export const captainService = async (body: ICaptain) => {
  const bodyValidatetion = z.object({
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),

    vehicle: z.object({
      vehicleType: z.enum(["car", "bike", "truck", "cng"]),
      plateNumber: z.string().min(1, "Plate number is required"),
      color: z.string().min(1, "Color is required"),
      capacity: z.number().min(1, "Capacity must be at least 1"),
    }),
  });

  const validationResult = bodyValidatetion.safeParse(body);

  if (!validationResult.success) {
    return {
      error: schemaValidationError(
        validationResult.error,
        "Invalid request body"
      ),
    };
  }
  // If validation passes, proceed with captain registration
  try {
    // Check if captain already exists
    const existingCaptain = await Captain.findOne({
      email: body.email,
    });

    if (existingCaptain) {
      return {
        error: {
          success: false,
          message: "Captain with this email already exists.",
        },
      };
    }

    // Create captain
    const captain = new Captain(validationResult.data);

    // Save captain to database
    await captain.save();

    return {
      success: {
        success: true,
        data: captain,
        message: "Captain registered successfully.",
      },
    };
  } catch (error: any) {
    return {
      serverError: {
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
      },
    };
  }
};
