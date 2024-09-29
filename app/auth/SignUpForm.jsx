"use client";
import { Users } from "../../utils/schema";
import React from "react";
import bcrypt from "bcryptjs";
import { toast } from "sonner";
import { db } from "../../utils/dbConfig";

function SignUpForm({ setType }) {
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    if (evt.target.id === "show") {
      setState({
        ...state,
        [evt.target.name]: evt.target.checked,
      });
    } else {
      setState({
        ...state,
        [evt.target.name]: value,
      });
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { username, email, password } = state;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser = await db
        .insert(Users)
        .values({
          username,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        })
        .returning();

      toast.success("Signed up successfully");
      // Handle successful sign-up (e.g., set user context, redirect)

      // You might want to use Next.js router to redirect
      // import { useRouter } from 'next/router';
      // const router = useRouter();
      // router.push('/dashboard');
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        toast.error("Email already in use");
      } else {
        toast.error("An error occurred during sign-up");
      }
    }

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container bg-white sign-up-container w-full md:w-1/2 flex justify-center items-center">
      <div className="mx-5 md:m-20 p-7 border border-gray-300 min-w-[80%] lg:min-w-[60%] rounded-2xl">
        <form onSubmit={handleOnSubmit} className="text-start">
          <h1 className="text-3xl font-bold">Sign up</h1>
          <div className="w-full flex flex-col md:flex-row items-center md:gap-5">
            <div className="w-full">
              <label htmlFor="first-name">User Name</label>
              <input
                id="user-name"
                type="text"
                name="username"
                className="focus:shadow-md focus:bg-gray-50 hover:bg-gray-50 border-gray-200 hover:border-gray-300 focus:border-gray-300 focus-visible:outline-0 duration-300"
                value={state.fname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="focus:shadow-md focus:bg-gray-50 hover:bg-gray-50 border-gray-200 hover:border-gray-300 focus:border-gray-300 focus-visible:outline-0 duration-300"
              value={state.email}
              onChange={handleChange}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row items-center md:gap-5">
            <div className="w-full">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={state.show ? "text" : "password"}
                name="password"
                className="focus:shadow-md focus:bg-gray-50 hover:bg-gray-50 border-gray-200 hover:border-gray-300 focus:border-gray-300 focus-visible:outline-0 duration-300"
                value={state.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="w-full bg-[#302b63] hover:bg-[#0f0c29] hover:shadow-md">
            Sign Up
          </button>
          <div className="flex justify-center gap-1 mt-3 md:hidden">
            Don’t have an account?{" "}
            <div
              className="font-normal hover:font-semibold text-[#302b63] cursor-pointer"
              onClick={() => {
                setType("signIn");
              }}
            >
              Sign in
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
