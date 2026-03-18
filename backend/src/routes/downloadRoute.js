import express from "express";
import { downloadMp3 } from "../controller/downloadController.js";

const router = express.Router();

router.post("/download", downloadMp3);

export default router;