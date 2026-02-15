import {
  index,
  route,
  layout,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),

  layout("routes/_auth.tsx", [
    route("login", "routes/_auth.login.tsx"),
    route("signup", "routes/_auth.signup.tsx"),
  ]),

  layout("routes/_protected.tsx", [
    route("today", "routes/_protected.today.tsx"),
    route("backlog", "routes/_protected.backlog.tsx"),
    route("upcoming", "routes/_protected.upcoming.tsx"),
    route("completed", "routes/_protected.completed.tsx"),
  ]),

  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
