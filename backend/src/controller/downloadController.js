import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ✅ IMPORTANT: backend URL (NOT frontend)
const BASE_URL =
  process.env.BASE_URL || "https://tunefetch.onrender.com";

// ================= DOWNLOAD =================
export const downloadMp3 = (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const id = uuidv4();
  const filePath = path.resolve(`downloads/${id}.mp3`);
  const outputTemplate = `downloads/${id}.%(ext)s`;

  // ✅ FIXED: python → python3
  const command = `python3 -m yt_dlp -x --audio-format mp3 --audio-quality 0 "${url}" -o "${outputTemplate}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("ERROR:", stderr);
      return res.status(500).json({ error: "Conversion failed" });
    }

    setTimeout(() => {
      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "File not found" });
      }

      res.download(filePath, "audio.mp3", (err) => {
        if (err) console.error(err);

        // cleanup
        fs.unlink(filePath, () => {});
      });
    }, 1500);
  });
};

// ================= VIDEO INFO =================
export const getVideoInfo = (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  // ✅ FIXED
  const command = `python3 -m yt_dlp --dump-json "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res
        .status(500)
        .json({ error: "Failed to fetch video info" });
    }

    try {
      const data = JSON.parse(stdout);

      res.json({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
      });
    } catch (err) {
      console.error("JSON parse error:", err);
      res.status(500).json({ error: "Parsing failed" });
    }
  });
};

// ================= STREAM =================
export const streamAudio = (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  // ✅ FIXED
  const command = `python3 -m yt_dlp -f bestaudio -o - "${url}" | ffmpeg -i pipe:0 -f mp3 -ab 192k -`;

  const process = exec(command, {
    maxBuffer: 1024 * 1024 * 50,
  });

  res.setHeader("Content-Type", "audio/mpeg");

  process.stdout.pipe(res);

  process.stderr.on("data", (err) => {
    console.error("FFMPEG ERROR:", err);
  });
};

// ================= PREVIEW =================
export const previewAudio = (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  const id = uuidv4();
  const filePath = path.resolve(`downloads/${id}.mp3`);

  // ✅ FIXED
  const command = `python3 -m yt_dlp -x --audio-format mp3 "${url}" -o "${filePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ error: "Preview failed" });
    }

    setTimeout(() => {
      if (!fs.existsSync(filePath)) {
        return res
          .status(500)
          .json({ error: "File not found" });
      }

      res.json({
        audioUrl: `${BASE_URL}/downloads/${id}.mp3`,
      });
    }, 1000);
  });
};
