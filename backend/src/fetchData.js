import axios from "axios";

export async function getRPGGames(twitchApi) {
  const urlGames = "https://api.twitch.tv/helix/games";
  const games = ["Tabletop%20RPGs", "Dungeons%20%26%20Dragons"];

  let params = "";
  games.map((game, idx) =>
    idx == 0 ? (params += `name=${game}`) : (params += `&name=${game}`)
  );

  try {
    const res = await twitchApi.get(`${urlGames}?${params}`);

    return res.data.data;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getRPGStreams(twitchApi, games) {
  const urlStreams = "https://api.twitch.tv/helix/streams";
  const urlUsers = "https://api.twitch.tv/helix/users";

  const gamesReqs = [];
  games.map((game) =>
    gamesReqs.push(
      twitchApi.get(`${urlStreams}?game_id=${game.id}&language=pt&first=100`)
    )
  );

  try {
    const resStreams = await axios.all(gamesReqs);
    const data = [];

    resStreams.map((streamsData) => {
      data.push(...streamsData.data.data);
    });

    const userReqs = [];
    data.map((streamData) =>
      userReqs.push(twitchApi.get(`${urlUsers}?id=${streamData.user_id}`))
    );

    const resUsers = await axios.all(userReqs);
    const profileImgs = resUsers.map(
      (user) => user.data.data[0].profile_image_url
    );

    const selectedData = data.map(
      (
        {
          user_id,
          user_name,
          title,
          viewer_count,
          thumbnail_url,
          started_at,
          is_mature,
        },
        idx
      ) => {
        return {
          user_id,
          user_name,
          title,
          viewer_count,
          thumbnail_url,
          started_at,
          is_mature,
          profile_img: profileImgs[idx],
        };
      }
    );

    selectedData.sort(
      (streamA, streamB) => streamB.viewer_count - streamA.viewer_count
    );

    return selectedData;
  } catch (err) {
    console.error(err);
    return null;
  }
}
