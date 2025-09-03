import { Link } from "@tanstack/react-router";
import RegisterForm from "./register-form";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      <h1 className="!text-3xl font-bold text-gray-800">Create your account</h1>

      {/* Form register */}
      <RegisterForm />

      {/* Footer */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-[#155ca2] hover:underline">
            Login
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
