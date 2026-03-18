import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  //  GET VIDEO INFO
  const handlePreview = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/info", {
        url,
      });

      setVideo(res.data);
    } catch (err) {
      alert("Invalid URL ❌");
    } finally {
      setLoading(false);
    }
  };

  //  DOWNLOAD
  const handleDownload = async () => {
    try {
      setDownloading(true);

      const res = await axios.post(
        "http://localhost:5000/api/download",
        { url },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "audio.mp3";
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      <div className="w-[600px]">

        {/* TITLE */}
        <h1 className="text-4xl text-center font-bold mb-8 bg-gradient-to-r from-[#00E19E] to-[#00C6FF] bg-clip-text text-transparent">
          TuneFetch Pro
        </h1>

        {/* INPUT + PREVIEW */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-black/40 border border-white/20"
          />

          <button
            onClick={handlePreview}
            className="px-5 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-semibold"
          >
            {loading ? "..." : "Preview"}
          </button>
        </div>

        {/*  VIDEO CARD */}
        {video && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/5 p-5 rounded-xl border border-white/10"
          >
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="rounded-lg mb-4"
            />

            <h2 className="text-lg font-semibold">{video.title}</h2>

            {/* AUDIO PREVIEW */}
            <audio controls className="w-full mt-4">
              <source
                src={`http://localhost:5000/api/stream?url=${encodeURIComponent(
                  url
                )}`}
                type="audio/mpeg"
              />
            </audio>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleDownload}
              className="w-full mt-4 p-3 rounded-lg bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black font-bold"
            >
              {downloading ? "Downloading..." : "Download MP3"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;