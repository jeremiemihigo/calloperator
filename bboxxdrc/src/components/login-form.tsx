"use client";

import { AlerteError } from "@/app/static/AlertError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import React from "react";

interface ILogin {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [values, setValue] = React.useState<ILogin>({
    username: "",
    password: "",
  });
  const router = useRouter();
  const handlechange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValue({
      ...values,
      [name]: value,
    });
  };
  const [message, setMessage] = React.useState<string>("");
  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.message === "success") {
        window.location.replace("/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <form
      onSubmit={submitLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your username below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            id="username"
            onChange={(e) => handlechange(e)}
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input
            onChange={(e) => handlechange(e)}
            id="password"
            name="password"
            type="password"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
        {message && <AlerteError title={message} />}
      </div>
    </form>
  );
}
