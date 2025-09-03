import { Link } from "@tanstack/react-router";
import LoginForm from "./login-form";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      <h1 className="!text-3xl font-bold text-gray-800">Login</h1>

      {/* Form login */}
      <LoginForm />

      {/* Thêm phần dưới */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#155ca2] hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2">
          Are you an employer?{" "}
          <a
            href="#"
            className="text-[#155ca2] hover:underline"
            target="_blank"
          >
            Sign up on Talent
          </a>
        </p>
      </div>
    </div>
  );
}
