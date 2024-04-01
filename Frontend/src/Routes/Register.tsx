import { useState, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaArrowLeft } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";

import { RegisterAPI } from "@/API";
import { useToast } from "@/Components/UI/useToast";

import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Checkbox } from "@/Components/UI/Checkbox";

import AuthLayout from "@/Components/Auth/AuthLayout";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordAgainRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);

  const handleRegister = async () => {
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordAgain = passwordAgainRef.current?.value;
    const terms = termsRef.current?.dataset?.state == "checked";

    if (!firstName || !lastName || !email || !password || !passwordAgain) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
      });
    } else if (password !== passwordAgain) {
      toast({
        title: "Error",
        description: "Passwords do not match",
      });
    } else if (!terms) {
      toast({
        title: "Error",
        description: "Please agree to the terms",
      });
    } else {
      const data = {
        firstName,
        lastName,
        email,
        password,
      };
      setLoading(true);
      const response = await RegisterAPI(data);
      setLoading(false);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        navigate("/auth/login");
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
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
          <div className="flex flex-row space-x-2">
            <Input
              id="firstName"
              placeholder="First Name"
              type="text"
              ref={firstNameRef}
              disabled={loading}
            />
            <Input
              id="lastName"
              placeholder="Last Name"
              type="text"
              ref={lastNameRef}
              disabled={loading}
            />
          </div>
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
