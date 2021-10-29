const streams = [];

(async () => {
  const res = await axios.get("https://twitch-rpg-in-pt.herokuapp.com/api");
  streams.push(...res.data);

  updateOnlineLiveCounter(streams.length);
  createCards(streams);
})();
