import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // index("routes/home.tsx"),
  index("routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("schedule", "routes/schedule.tsx"),
] satisfies RouteConfig;
