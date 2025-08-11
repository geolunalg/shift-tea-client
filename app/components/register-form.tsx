import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

import placeholder from "./placeholder.svg";
import { Link } from "react-router";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
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
                                    type="text"
                                    placeholder="The Justice League"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input
                                    id="first-name"
                                    type="text"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Smith"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-pw">Confirm Password</Label>
                                <Input
                                    id="confirm-pw"
                                    type="password"
                                    placeholder="password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src={placeholder}
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <Link to={{ pathname: "/" }}>Terms of Service</Link>{" "}
                and <Link to={{ pathname: "/" }}>Privacy Policy</Link>.
            </div>
        </div>
    )
}
