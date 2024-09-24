// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "../../../../lib/db";
import bcrypt from "bcrypt";
import Joi from "joi";

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const { error } = signupSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: true, message: error.details[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // Check if user already exists
    const existingUser = await executeQuery({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: true, message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await executeQuery({
      query: "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      values: [username, email, hashedPassword],
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: true, message: "Error registering user" },
      { status: 500 }
    );
  }
}
