const streams = [];

(async () => {
  const res = await axios.get("http://localhost:5100/api");
  streams.push(...res.data);

  updateOnlineLiveCounter(streams.length);
  createCards(streams);
})();

function updateTimer(user_idx) {
  const timerElement = document.getElementById(`time${user_idx}`);
  let hours = streams[user_idx].hours;
  let minutes = streams[user_idx].minutes;
  let seconds = streams[user_idx].seconds;

  seconds = seconds + 1 === 60 ? 0 : seconds + 1;
  minutes = seconds === 0 ? (minutes + 1 === 60 ? 0 : minutes + 1) : minutes;
  hours = minutes === 0 && seconds === 0 ? hours + 1 : hours;

  streams[user_idx].hours = hours;
  streams[user_idx].minutes = minutes;
  streams[user_idx].seconds = seconds;

  if (timerElement) {
    timerElement.textContent = `${hours === 0 ? "" : hours + ":"}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

function getOnlineTime(time, user_idx) {
  const started = new Date(time);
  const diff = Date.now() - started;
  let hours = Math.floor(diff / 1000 / 60 / 60);
  let minutes = Math.floor((diff / 1000 / 60) % 60);
  let seconds = Math.floor(((diff / 1000) % 60) % 60);

  streams[user_idx].hours = hours;
  streams[user_idx].minutes = minutes;
  streams[user_idx].seconds = seconds;

  let timeOnline = `${hours === 0 ? "" : hours + ":"}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  setInterval(() => updateTimer(user_idx), 1000);

  return timeOnline;
}

function updateOnlineLiveCounter(counter) {
  const h2 = document.createElement("h2");
  h2.innerHTML = `Estamos com <span>${counter}</span> lives online.`;
  document.getElementById("header").append(h2);
}

function createCards(streams) {
  const container = document.getElementById("streams-container");
  streams.map(
    (
      {
        user_name,
        is_mature,
        viewer_count,
        title,
        profile_img,
        thumbnail_url,
        user_id,
        started_at,
      },
      idx
    ) => {
      const avatar = document.createElement("img");
      avatar.src = profile_img;
      avatar.className = "avatar";

      const userDiv = document.createElement("div");
      userDiv.className = "userDiv";
      const user = document.createElement("p");
      user.textContent = user_name;
      user.className = "user";
      userDiv.append(user);

      const viewers = document.createElement("p");
      viewers.textContent = viewer_count;
      viewers.className = "viewers";

      const streamTitle = document.createElement("p");
      streamTitle.textContent =
        title.length >= 31 ? `${title.substr(0, 28)}...` : title;
      streamTitle.className = "title";

      const thumb = document.createElement("img");
      thumb.src = thumbnail_url
        .replace("{width}", "400")
        .replace("{height}", "240");
      thumb.className = "thumb";

      const onlineTime = document.createElement("p");
      onlineTime.textContent = getOnlineTime(started_at, idx);
      onlineTime.className = "timer";
      onlineTime.id = `time${idx}`;

      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer";
      cardFooter.append(onlineTime, viewers);

      const card = document.createElement("div");
      card.className = is_mature ? "card mature" : "card";
      card.id = user_id;
      card.append(avatar, userDiv, streamTitle, thumb, cardFooter);

      const link = document.createElement("a");
      link.href = `https://twitch.tv/${user_name}`;
      link.target = "_blank";
      link.append(card);
      let isover = false;
      let animation;
      link.addEventListener("mouseover", (e) => {
        if (!isover) {
          const userElement = e.currentTarget
            .querySelector(".card")
            .querySelector(".user");
          if (userElement.scrollWidth > userElement.clientWidth) {
            const animDuration = Math.max(
              (1500 * (userElement.scrollWidth - userElement.clientWidth)) / 28,
              750
            );
            isover = true;
            animation = userElement.animate(
              [
                { transform: "translateX(0px)" },
                {
                  transform: `translateX(-${
                    userElement.scrollWidth - userElement.clientWidth
                  }px)`,
                },
              ],
              {
                duration: animDuration,
                iterations: Infinity,
                direction: "alternate",
                easing: "ease-in-out",
              }
            );
          }
        }
      });
      link.addEventListener("mouseleave", (e) => {
        const userElement = e.currentTarget
          .querySelector(".card")
          .querySelector(".user");
        if (userElement.scrollWidth > userElement.clientWidth) {
          isover = false;
          userElement.className = "user";
          animation.cancel();
        }
      });

      container.appendChild(link);
    }
  );
}
