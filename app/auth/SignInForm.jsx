import React from "react";
import { toast } from "sonner";
import { Users } from "../../utils/schema";
import bcrypt from "bcryptjs";
import { db } from "../../utils/dbConfig";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function SignInForm({ setType }) {
  const router = useRouter();
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = state;

    try {
      const users = await db.select().from(Users).where(eq(Users.email, email)).limit(1);

      if (users.length === 0) {
        toast.error("Invalid email or password");
        return;
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        toast.error("Invalid email or password");
        return;
      }
      const userString = encodeURIComponent(JSON.stringify(user));
      document.cookie = `user=${userString}; path=/; max-age=86400`;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("An error occurred during sign-in");
    }

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container bg-white sign-in-container w-full md:w-1/2 flex justify-center items-center">
      <div className="mx-5 md:mx-20 p-7 border border-gray-300 min-w-[80%] lg:min-w-[60%] rounded-2xl">
        <form onSubmit={handleOnSubmit}>
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="text-base font-normal text-black">Welcome back to your account</p>
          {/* <span>or use your account</span> */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="focus:shadow-md focus:bg-gray-50 hover:bg-gray-50 border-gray-200 focus-visible:!outline-0 duration-300"
            value={state.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="focus:shadow-md focus:bg-gray-50 hover:bg-gray-50 border-gray-200 focus-visible:!outline-0 duration-300"
            value={state.password}
            onChange={handleChange}
          />
          <a href="#" className="hover:text-[#EB3C75] duration-300">
            Forgot your password?
          </a>
          <button className="w-full hover:bg-[#860e35] border-0 hover:shadow-md">Sign In</button>
          <div className="social-container w-full">
            <div className="flex justify-center gap-1 mt-3 md:hidden">
              Don’t have an account?{" "}
              <div
                className="font-bold text-[#EB3C75] cursor-pointer"
                onClick={() => {
                  setType("signUp");
                }}
              >
                Sign up
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
