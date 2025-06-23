import authService from "@/api/authService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // event handler
  const handleForgotPassword = async (data: { email: string }) => {
    try {
      setLoading(true);
      const res = await authService.forgotPassword(data.email);
      if (!res.success) {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Forgot Your Password ?</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            onSubmit={handleSubmit(handleForgotPassword)}
            className="space-y-6"
            noValidate
          >
            <div className="grid gap-2">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                required
                {...register("email", {
                  required: "email is required",
                })}
              />
            </div>
            <Button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-400"
            >
              {loading ? "Resetting..." : "Reset my password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgetPassword;
