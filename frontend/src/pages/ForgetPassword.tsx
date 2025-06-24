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
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [openPopup,setOpenPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // event handler
  const handleForgotPassword = async (data: { email: string }) => {
    try {
      setLoading(true);
      const res = await authService.forgotPassword(data.email);
      if (!res.success) {
        setError(res.message);
      }
      setOpenPopup(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] h-auto bg-gray-50">
      <AlertDialog open={openPopup} onOpenChange={handlePopupClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Account Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              We've sent you a reset password email. Please check your inbox and
              click the reset your password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-blue-600">Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
