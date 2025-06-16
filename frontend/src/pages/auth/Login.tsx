import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const { login } = useAuth();
  const [loading,setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formSubmit = () => {
    const form = document.getElementById("login-form") as HTMLFormElement;
    form?.requestSubmit()
  };

  const handleLogin = async(event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const remember = (form.elements.namedItem("remember") as HTMLInputElement)
      .checked;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    await login(email, password, remember);
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome back</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <a className="text-blue-600 hover:text-blue-400" href="/register">
              Sign up
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="reset-password"
                    aria-label="Forgot password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex items-center">
                <Input id="remember" type="checkbox" className="w-4 h-4 mr-2" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>
            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
            <button type="submit" className="hidden" />
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            onClick={formSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-400"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
