import { index, route, layout, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  
  layout("./todos/layout.tsx", [
    route("backlog", "./routes/backlog.tsx"),
    route("today", "./routes/today.tsx"),
    route("upcoming", "./routes/upcoming.tsx"),
    route("completed", "./routes/completed.tsx"),
  ]),
] satisfies RouteConfig;
