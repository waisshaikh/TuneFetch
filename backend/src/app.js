import express from "express";
import cors from "cors";
import downloadRoute from "./src/routes/downloadRoute.js";
import path from "path";

const app = express();

// ✅ FIXED CORS
app.use(cors({
<<<<<<< HEAD
  origin: "https://tune-fetch-beta.vercel.app"
=======
  origin: "https://tune-fetch-beta.vercel.app/"
>>>>>>> 303bba8adafced934e40dbfc7d86eeb2747e2db2
}));

app.use(express.json());


app.use("/downloads", express.static(path.resolve("downloads")));


app.use("/api", downloadRoute);

// health check
app.get("/", (req, res) => {
  res.send("YT MP3 Backend Running");
});

const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
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
>>>>>>> 303bba8adafced934e40dbfc7d86eeb2747e2db2
