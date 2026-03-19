import { useState } from "react";
import axios from "axios";

const API = "https://tunefetch.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  //  Preview + Info
  const handlePreview = async () => {
    try {
      if (!url) return alert("Paste URL first!");

      setLoading(true);

      const info = await axios.post(`${API}/info`, { url });
      setVideo(info.data);

      const res = await axios.post(`${API}/preview`, { url });
      setAudioUrl(res.data.audioUrl);

    } catch (err) {
      console.error(err);
      alert("Invalid URL or server error!");
    } finally {
      setLoading(false);
    }
  };

  // ⬇Download
  const handleDownload = async () => {
    try {
      if (!url) return alert("Paste URL first!");

      setDownloading(true);

      const res = await axios.post(
        `${API}/download`,
        { url },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "audio.mp3";
      link.click();

    } catch (err) {
      console.error(err);
      alert("Download failed!");
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
            {loading ? "Loading..." : "Preview"}
          </button>
        </div>

        {/* CARD */}
        {video && (
          <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10 shadow-lg">

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

            {/* AUDIO PREVIEW */}
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full mt-2" />
            )}

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
    </div>
  );
}

export default App;