import express from "express";
import { downloadMp3,  getVideoInfo, streamAudio,previewAudio } from "../controller/downloadController.js";

const router = express.Router();

router.post("/download", downloadMp3);
router.post("/info", getVideoInfo);
router.get("/stream", streamAudio);
router.post("/preview", previewAudio);
export default router;