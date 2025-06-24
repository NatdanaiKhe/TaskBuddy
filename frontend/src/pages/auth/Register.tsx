import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "@/api/authService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { RegisterFormData } from "@/types/authType";
import { useState } from "react";

interface RoleOption {
  value: string;
  label: string;
}

function Register() {
  const navigate = useNavigate();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "onBlur", // Validate on blur for better UX
  });

  const password = watch("password");

  const roleOptions: RoleOption[] = [
    { value: "provider", label: "Provide Services" },
    { value: "customer", label: "Find Services" },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const res = await authService.register(
        data.firstName,
        data.lastName,
        data.email,
        data.role,
        data.password
      );
      console.log(res);
      
      if(res.success !== true){
        setSubmitError(res.message)
      }else{
        setSuccessDialogOpen(true);
      }

      
    } catch (err: any) {
      console.error("Registration failed", err);

      // Handle different types of errors
      if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else if (err.message) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  const handleRoleChange = (value: string) => {
    setValue("role", value, { shouldValidate: true });
  };

  const navigateToLogin = () => {
    setSuccessDialogOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] h-auto  bg-gray-100">
      {/* Success Dialog */}
      <AlertDialog
        open={successDialogOpen}
        onOpenChange={handleSuccessDialogClose}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              We've sent you a verification email. Please check your inbox and
              click the verification link to activate your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-400"
              onClick={navigateToLogin}
            >
              Continue to Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl">Create Your Account</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <a
              className="text-blue-600 hover:text-blue-400 underline"
              href="/login"
            >
              Sign in here
            </a>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              {/* error  */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              {/* name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z\s'-]+$/,
                        message:
                          "First name can only contain letters, spaces, apostrophes, and hyphens",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z\s'-]+$/,
                        message:
                          "Last name can only contain letters, spaces, apostrophes, and hyphens",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* role */}
              <div className="grid gap-2">
                <Label htmlFor="role">What brings you here?</Label>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Choose your role</SelectLabel>
                      {roleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">
                    Please select your role
                  </p>
                )}
              </div>

              {/* email */}
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
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message:
                        "Password must contain uppercase, lowercase, number, and special character",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character (@$!%*?&)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
