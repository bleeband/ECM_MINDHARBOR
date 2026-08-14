import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", validate(refreshSchema), refresh);

router.post("/logout", requireAuth, validate(logoutSchema), logout);

router.get("/me", requireAuth, me);

export default router;
