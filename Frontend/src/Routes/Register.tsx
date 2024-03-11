import { useState, useRef } from "react";

import { Link } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";

import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Checkbox } from "@/Components/UI/Checkbox";

import AuthLayout from "@/Components/Auth/AuthLayout";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordAgainRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);

  const handleRegister = () => {
    setLoading(true);
  };

  return (
    <AuthLayout route="register">
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
          <Link to="/auth/login">Login</Link>
        </Button>
        <div className="w-1/2 flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Setting up an account takes less than a minute
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
          <Input
            id="passwordAgain"
            placeholder="Password again"
            type="password"
            ref={passwordAgainRef}
            disabled={loading}
          />
          <div className="self-start flex items-center gap-x-2">
            <Checkbox id="terms" ref={termsRef} disabled={loading} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              You agree to our{" "}
              <Link
                to="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          <Button className="!mt-8" disabled={loading} onClick={handleRegister}>
            {loading ? (
              <>
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />{" "}
                Please wait
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
