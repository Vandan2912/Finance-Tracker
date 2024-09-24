"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import "./login.css";

export default function Page() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container1 " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="h-full w-full">
      <div className={containerClass} id="container">
        <SignUpForm setType={setType} />
        <SignInForm setType={setType} />
        <div className="overlay-container hidden md:block">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-base">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost !bg-[#EB3C75] !text-white hover:shadow-[0_0_11px_rgba(33,33,33,.2)] hover:!bg-white hover:!text-[#EB3C75] border border-white duration-300"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="text-3xl font-bold">Hello, Friend!</h1>
              <p className="text-base">
                Enter your personal details and start journey with us
              </p>
              <button
                className="ghost !bg-[#EB3C75] !text-white hover:shadow-[0_0_11px_rgba(33,33,33,.2)] hover:!bg-white hover:!text-[#EB3C75] border border-white duration-300"
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
      Login
    </button>
  );
}
