import { useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";

import { LoginAPI } from "@/API";

import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Checkbox } from "@/Components/UI/Checkbox";

import AuthLayout from "@/Components/Auth/AuthLayout";
import { useToast } from "@/Components/UI/useToast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    const data = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      month,
    };
    setLoading(true);
    const response = await LoginAPI(data);
    setLoading(false);
    if (response.status === 200) {
      navigate("/dashboard");
    } else if (response.status === 400) {
      toast({
        title: "Error",
        description: "Invalid email or password",
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred",
      });
    }
  };

  return (
    <AuthLayout route="login">
      <div className="w-full h-full relative flex justify-center items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 left-0"
          asChild
        >
          <Link to="/">
            <FaArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" className="absolute top-0 right-0" asChild>
          <Link to="/auth/register">Register</Link>
        </Button>
        <div className="w-1/2 flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your email and password
          </p>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            ref={emailRef}
            disabled={loading}
          />
          <Input
            id="password"
            placeholder="Password"
            type="password"
            ref={passwordRef}
            disabled={loading}
          />
          <div className="self-start flex items-center gap-x-2">
            <Checkbox
              id="terms"
              checked={month}
              onCheckedChange={() => setMonth(!month)}
              disabled={loading}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Stay signed in for a month
            </label>
          </div>
          <Button className="!mt-8" onClick={handleLogin} disabled={loading}>
            {loading ? (
              <>
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />{" "}
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
