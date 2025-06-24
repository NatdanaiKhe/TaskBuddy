import { useForm } from "react-hook-form";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onBlur",
  });

  const rememberValue = watch("remember");

  // event handler
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      await login(data.email, data.password, data.remember)
      navigate('/')
    } catch (err: any) {
      console.error("Login failed", err)
      // error handler
      if (err.response?.status === 401) {
        setSubmitError("Invalid email or password. Please try again.");
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else if (err.message) {
        setSubmitError(err.message);
      } else {
        setSubmitError(
          "Login failed. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberChange = (checked: boolean) => {
    setValue("remember", checked, { shouldValidate: true });
  };

  const clearError = () => {
    if (submitError) {
      setSubmitError(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] h-auto bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome Back</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <a
              className="text-blue-600 hover:text-blue-400 underline"
              href="/register"
            >
              Sign up here
            </a>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* Error Banner */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  onChange={e => {
                    clearError();
                    // Let react-hook-form handle the change
                    register("email").onChange(e);
                  }}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 1,
                      message: "Password is required",
                    },
                  })}
                  onChange={e => {
                    clearError();
                    // Let react-hook-form handle the change
                    register("password").onChange(e);
                  }}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberValue}
                    onCheckedChange={handleRememberChange}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
