import { useNavigate, useSearchParams } from "react-router-dom";
import authService from "@/api/authService";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [seconds, setSeconds] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // call verify api
  useEffect(() => {
    const callVerifyEmail = async () => {
      try {
        if (token) {
          const result = await authService.verifyEmail(token);
          if (result) {
            setSuccess(true);
            startCountdown();
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    callVerifyEmail();
  }, [token]);

  const startCountdown = () => {
    if (isActive || seconds <= 0) return;

    setIsActive(true);
    intervalRef.current = window.setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
          setIsActive(false);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (loading) {
    return <Loader />;
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] h-auto bg-gray-50 gap-4">
        <BadgeCheck color="green" size={64} />
        <h1 className="text-4xl font-bold">Verified Success</h1>
        <p>Your email was successfully verified.</p>
        <p>
          We will redirect you to{" "}
          <a href="/login" className="underline">
            login page
          </a>{" "}
          in {seconds}
        </p>
      </div>
    );
  } else {
    return <Error />;
  }
}

export default VerifyEmail;
