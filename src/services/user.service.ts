import z from "zod";
import User from "../models/users.model.js";
import { schemaValidationError } from "../errors/index.js";

// Register user service
export const userResisterService = async (body: {
  fullname: string;
  email: string;
  password: string;
}) => {
  const bodyValidatetion = z.object({
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
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
  // If validation passes, proceed with user registration
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      email: body.email,
    });

    if (existingUser) {
      return {
        error: {
          success: false,
          message: "User already exists.",
        },
      };
    }

    // Create user
    const user = new User(validationResult.data);

    // Save user to database
    await user.save();

    return {
      success: {
        success: true,
        data: user,
        message: "User registered successfully.",
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

// Login user service
export const userLoginService = async (body: {
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
    // Find user by email
    const user = await User.findOne({ email: body.email }).select("+password");

    if (!user) {
      return {
        error: {
          success: false,
          message: "Invalid credentials",
          fields: [
            {
              name: "email",
              message: "User not found",
            },
          ],
        },
      };
    }

    // Validate password
    if (!(await user.matchPassword(body.password))) {
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
    const authToken = await user.generateAuthToken();

    // Return success response with user data and token
    return {
      success: {
        success: true,
        data: user,
        message: "User logged in successfully.",
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
