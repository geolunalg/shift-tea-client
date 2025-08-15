import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import shifttee from "./shifttee.svg";
import { Link, useNavigate } from "react-router";
import React, { useState } from "react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.passwordConfirm) {
      setError("password do not match");
      setLoading(false);
      return;
    }

    const reqData = {
      facility: {
        facilityName: data.facilityName,
      },
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        isAdmin: true,
      },
    };

    try {
      const res = await fetch("/api/v1/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqData),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Something went wrong");
        return;
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Please register your facility
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="facility-name">Facility Name</Label>
                <Input
                  id="facility-name"
                  name="facilityName"
                  type="text"
                  placeholder="Acme Corporation"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  placeholder="Smith"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.smith@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-pw">Confirm Password</Label>
                <Input
                  id="password-confirm"
                  name="passwordConfirm"
                  type="password"
                  placeholder="password"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={shifttee}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link to={{ pathname: "/" }}>Terms of Service</Link> and{" "}
        <Link to={{ pathname: "/" }}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
