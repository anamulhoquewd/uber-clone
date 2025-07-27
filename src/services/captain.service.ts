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
          message: "Captain already exists.",
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

// Login captain service
export const captainLoginService = async (body: {
  email: string;
  password: string;
}) => {
  const bodyValidation = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const validationResult = bodyValidation.safeParse(body);

  if (!validationResult.success) {
    return {
      error: schemaValidationError(
        validationResult.error,
        "Invalid request body"
      ),
    };
  }

  try {
    // Find captain by email
    const captain = await Captain.findOne({ email: body.email }).select(
      "+password"
    );

    if (!captain) {
      return {
        error: {
          success: false,
          message: "Invalid credentials",
          fields: [
            {
              name: "email",
              message: "Captain not found",
            },
          ],
        },
      };
    }

    // Validate password
    if (!(await captain.matchPassword(body.password))) {
      return {
        error: {
          success: false,
          message: "Invalid credentials",
          fields: [
            {
              name: "password",
              message: "Password is incorrect",
            },
          ],
        },
      };
    }

    // Generate auth token
    const authToken = await captain.generateAuthToken();

    // Return success response with captain data and token
    return {
      success: {
        success: true,
        data: captain,
        message: "Captain logged in successfully.",
        token: authToken,
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
