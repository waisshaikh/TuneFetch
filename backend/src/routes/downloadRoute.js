import express from "express";
import { downloadMp3,  getVideoInfo, streamAudio } from "../controller/downloadController.js";

const router = express.Router();

router.post("/download", downloadMp3);
router.post("/info", getVideoInfo);
router.get("/stream", streamAudio);

export default router;