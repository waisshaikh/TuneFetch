import express from "express";
import cors from "cors";
import downloadRoute from "./src/routes/downloadRoute.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// static folder for downloads
app.use("/downloads", express.static(path.resolve("downloads")));

app.use("/api", downloadRoute);

app.get("/", (req, res) => {
  res.send(" YT MP3 Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});