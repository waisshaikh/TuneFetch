import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handlePreview = async () => {
    try {
      setLoading(true);

      const info = await axios.post("http://localhost:5000/api/info", { url });
      setVideo(info.data);

      const res = await axios.post("http://localhost:5000/api/preview", { url });
      setAudioUrl(res.data.audioUrl);

    } catch {
      alert("Invalid URL ❌");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#00E19E] to-[#00C6FF] bg-clip-text text-transparent">
          🎧 TuneFetch
        </h1>

        {/* INPUT */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:border-[#00E19E]"
          />

          <button
            onClick={handlePreview}
            className="px-5 rounded-lg font-semibold bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black hover:scale-105 transition"
          >
            {loading ? "..." : "Preview"}
          </button>
        </div>

        {/* CARD */}
        {video && (
          <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10 shadow-lg animate-[fadeIn_0.4s_ease-in-out]">

            {/* THUMBNAIL */}
            <img
              src={video.thumbnail}
              alt="thumb"
              className="rounded-lg mb-4 w-full"
            />

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-3">
              {video.title}
            </h2>

            {/* AUDIO */}
            <audio controls className="w-full mt-2">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>

            {/* DOWNLOAD */}
            <button
              onClick={handleDownload}
              className="w-full mt-4 p-3 rounded-lg font-bold bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black hover:scale-105 transition"
            >
              {downloading ? "Downloading..." : "Download MP3"}
            </button>

          </div>
        )}

      </div>

      {/* Animation (inline Tailwind style) */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default App;