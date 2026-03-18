import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/download",
        { url },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "audio.mp3";
      a.click();
    } catch (err) {
      alert("Download failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-xl w-[500px]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#00E19E] to-[#00C6FF] bg-clip-text text-transparent">
          🎧 TuneFetch
        </h1>

        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:border-[#00E19E]"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleDownload}
          className="w-full mt-5 p-3 rounded-lg font-semibold bg-gradient-to-r from-[#00E19E] to-[#00C6FF] text-black shadow-lg"
        >
          {loading ? "Converting..." : "Download MP3"}
        </motion.button>

      </motion.div>
    </div>
  );
}

export default App;