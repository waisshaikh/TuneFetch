import { useState } from "react";
import axios from "axios";
import "./styles/app.scss";

function App() {
  const [url, setUrl] = useState("");

  const downloadMP3 = async () => {
    const res = await axios.post("http://localhost:5000/api/mp3", { url }, {
      responseType: "blob"
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(res.data);
    link.download = "audio.mp3";
    link.click();
  };

  const downloadVideo = async () => {
    const res = await axios.post("http://localhost:5000/api/video", { url }, {
      responseType: "blob"
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(res.data);
    link.download = "video.mp4";
    link.click();
  };

  return (
    <div className="app">
      <h1>YT Downloader</h1>

      <input
        type="text"
        placeholder="Paste YouTube URL"
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="buttons">
        <button onClick={downloadMP3}>Download MP3</button>
        <button onClick={downloadVideo}>Download Video</button>
      </div>
    </div>
  );
}

export default App;