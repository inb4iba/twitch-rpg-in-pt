import dotenv from "dotenv";
import api from "./api.js";
import { getRPGGames, getRPGStreams } from "./fetchData.js";
import express from "express";
import cors from "cors";

dotenv.config();

const twitchApi = await api.getAPI();
const app = express();
const port = 3000;

app.use(cors());
app.options("*", cors());

app.get("/", async (req, res) => {
  const games = await getRPGGames(twitchApi);
  if (games == null || games.length == 0) return;

  const streams = await getRPGStreams(twitchApi, games);
  if (streams == null) return;

  res.send(streams);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
