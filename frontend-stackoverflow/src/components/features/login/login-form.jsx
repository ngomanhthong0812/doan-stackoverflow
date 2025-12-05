"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaGoogle, FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function LoginForm() {
  const { login, forgotPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    const success = await login(values);
    setIsLoading(false);
    if (success) form.reset();
  }

  async function onForgotSubmit(values) {
    setForgotLoading(true);
    await forgotPassword(values.email);
    forgotForm.reset();
    setForgotLoading(false);
  }

  const loginGoogle = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const loginGithub = () => {
    window.location.href = "http://localhost:3000/api/auth/github";
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xs space-y-4 bg-white p-5 rounded-lg shadow"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot password */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="p-0 text-lg text-blue-600 hover:underline"
              >
                Forgot password?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
              </DialogHeader>
              <Form {...forgotForm}>
                <form
                  onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={forgotLoading}
                      className="bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Email"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          {/* OAuth Buttons */}
        </form>
      </Form>
      <div className="flex flex-col gap-2 mt-2">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={loginGoogle}
        >
          <FaGoogle className="h-4 w-4" />
          Login with Google
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={loginGithub}
        >
          <FaGithub className="h-4 w-4" />
          Login with GitHub
        </Button>
      </div>
    </div>
  );
}
