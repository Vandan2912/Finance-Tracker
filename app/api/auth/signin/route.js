// app/api/auth/signin/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "../../../../lib/db";
import bcrypt from "bcrypt";
import Joi from "joi";

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const { error } = signinSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: true, message: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Check if user exists
    const result = await executeQuery({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (result.length === 0) {
      return NextResponse.json(
        { error: true, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result[0];

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: true, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.id, username: user.username, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
