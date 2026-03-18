import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const downloadMp3 = (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const id = uuidv4();
  const filePath = path.resolve(`downloads/${id}.mp3`);
  const outputTemplate = `downloads/${id}.%(ext)s`;

  const command = `python -m yt_dlp --ffmpeg-location "C:\\Users\\waiss\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin" --extractor-args "youtube:player_client=android" -x --audio-format mp3 --audio-quality 0 "${url}" -o "${outputTemplate}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("ERROR:", stderr);
      return res.status(500).json({ error: "Conversion failed " });
    }

    // wait for file creation
    setTimeout(() => {
      if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "File not found " });
      }

      res.download(filePath, "audio.mp3", (err) => {
        if (err) {
          console.error(err);
        }

        // cleanup after download
        fs.unlink(filePath, () => {});
      });
    }, 1500);
  });
};