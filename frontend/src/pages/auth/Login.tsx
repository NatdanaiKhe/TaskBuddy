import { useState, useRef } from "react";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!email || !password) return "Email and password are required.";
    if (!/\S+@\S+\.\S+/.test(email))
      return "Please enter a valid email address.";
    return null;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email, password, remember);
      navigate("/");
      
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl">Welcome back</CardTitle>
          <CardDescription>
            Don&apos;t have an account?{" "}
            <a className="text-blue-600 hover:text-blue-400" href="/register">
              Sign up
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            onSubmit={handleLogin}
            className="space-y-6"
            noValidate
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/reset-password"
                    className="ml-auto text-sm hover:underline underline-offset-4"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center">
                <Input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>

            {error && (
              <div
                className="mt-4 text-sm text-red-600"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <button type="submit" className="hidden" />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-400"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
