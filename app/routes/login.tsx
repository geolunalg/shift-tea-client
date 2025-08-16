import LoginForm from "~/pages/Login";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
    { author: "Geovanni Luna" },
  ];
}

export default function Login() {
  return <LoginForm />;
}
