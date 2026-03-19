import express from "express";
import cors from "cors";
import downloadRoute from "./src/routes/downloadRoute.js";
import path from "path";

const app = express();

// ✅ FIXED CORS
app.use(cors({
  origin: "https://tune-fetch-beta.vercel.app"
}));

app.use(express.json());


app.use("/downloads", express.static(path.resolve("downloads")));


app.use("/api", downloadRoute);

// health check
app.get("/", (req, res) => {
  res.send("YT MP3 Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});