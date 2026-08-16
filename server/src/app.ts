import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import journalRoutes from "./routes/journal.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { errorHandler } from "./middlewares/error.js";
import activityRoutes from "./routes/activity.routes.js";
import groupeRoutes from "./routes/groupe.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/groups", groupeRoutes);
app.use("/api/v1/posts", postRoutes);
// ... autres routeurs

app.use((_req, res) => {
  res
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Route introuvable." } });
});
app.use(errorHandler); // toujours en dernier

export default app;
