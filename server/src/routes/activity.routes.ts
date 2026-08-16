import { Router } from "express";
import { getActivities } from "../controllers/activity.controller.js";

const router = Router();

// route public, pas besoin detre connecter
router.get("/", getActivities);

export default router;
