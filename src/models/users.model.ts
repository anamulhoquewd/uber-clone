import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate and hash reset token
userSchema.methods.generateResetPasswordToken = function (expMinutes = 30) {
  let resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and save it in the database
  resetToken = this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration
  this.resetPasswordExpireDate = Date.now() + expMinutes * 60 * 1000; // default 30 minutes

  return resetToken;
};

// Match Admin entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If password is not modified, skip hashing
    next();
  }

  if (!this.password) {
    return next(new Error("Password is required"));
  }

  // Use bcrypt to hash the password
  const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Export the user model
const User = mongoose.model("User", userSchema);

export default User;
