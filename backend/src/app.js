import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
app.use("/downloads", express.static("downloads"));

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend running 🔥");
});

// MP3 Converter (STABLE)
app.post("/api/mp3", (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL required" });
    }

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="audio.mp3"'
    );

    const ytProcess = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      "-",
      url,
    ]);

    ytProcess.stdout.pipe(res);

    ytProcess.stderr.on("data", (data) => {
      console.log("yt-dlp error:", data.toString());
    });

    ytProcess.on("close", (code) => {
      console.log("yt-dlp finished:", code);
    });

  } catch (error) {
    console.log("Server error:", error);
    res.status(500).json({ message: "Internal error" });
  }
});

app.get("/api/stream", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: "URL required" });
  }

  // yt-dlp process
  const ytDlp = spawn("yt-dlp", [
    "-f",
    "bestaudio",
    "-o",
    "-",
    url,
  ]);

  // ffmpeg process (convert to mp3 stream)
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    "pipe:0",
    "-f",
    "mp3",
    "-ab",
    "192k",
    "pipe:1",
  ]);

  res.setHeader("Content-Type", "audio/mpeg");

  ytDlp.stdout.pipe(ffmpeg.stdin);
  ffmpeg.stdout.pipe(res);

  ytDlp.stderr.on("data", (data) =>
    console.log("yt-dlp:", data.toString())
  );

  ffmpeg.stderr.on("data", (data) =>
    console.log("ffmpeg:", data.toString())
  );
});

export default app;