import dotenv from "dotenv";
dotenv.config();

import api from "./backend/api.js";
import { getRPGGames, getRPGStreams } from "./backend/fetchData.js";

import express from "express";
const app = express();
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 5100;

const twitchApi = await api.getAPI();

import cors from "cors";
app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api", async (req, res) => {
  const games = await getRPGGames(twitchApi);
  if (games == null || games.length == 0) return;

  const streams = await getRPGStreams(twitchApi, games);
  if (streams == null) return;

  res.send(streams);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
