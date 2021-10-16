import axios from "axios";

export default {
  getAPI: async () => {
    const urlAuth = "https://id.twitch.tv/oauth2/token?";
    const scope = "analytics:read:games";

    try {
      const res = await axios.post(
        `${urlAuth}client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials&scope=${scope}`
      );

      const api = axios.create({
        headers: {
          "Client-Id": process.env.CLIENT_ID,
          Authorization: `Bearer ${res.data.access_token}`,
        },
      });
      return api;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};
