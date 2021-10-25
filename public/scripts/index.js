const streams = [];

(async () => {
  const res = await axios.get("https://twitch-rpg-in-pt.herokuapp.com/api");
  streams.push(...res.data);

  updateOnlineLiveCounter(streams.length);
  createCards2(streams);
})();

function updateTimer(user_idx) {
  const timerElement = document.getElementById(`time${user_idx}`);
  let hours = streams[user_idx].hours;
  let minutes = streams[user_idx].minutes;
  let seconds = streams[user_idx].seconds;

  seconds = seconds + 1 === 60 ? 0 : seconds + 1;
  minutes = seconds === 0 ? (minutes + 1 === 60 ? 0 : minutes + 1) : minutes;
  hours = minutes === 0 && seconds === 0 ? hours + 1 : hours;

  updateTimeForUser(user_idx, hours, minutes, seconds);

  if (timerElement) {
    timerElement.textContent = `${hours === 0 ? "" : hours + ":"}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

function getOnlineTime(time, user_idx) {
  const started = new Date(time);
  const diff = Date.now() - started;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor(((diff / 1000) % 60) % 60);

  updateTimeForUser(user_idx, hours, minutes, seconds);

  let timeOnline = `${hours === 0 ? "" : hours + ":"}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  setInterval(() => updateTimer(user_idx), 1000);

  return timeOnline;
}

function updateTimeForUser(user_idx, hours, minutes, seconds) {
  streams[user_idx].hours = hours;
  streams[user_idx].minutes = minutes;
  streams[user_idx].seconds = seconds;
}

// [TODO] update h2 instead of create
function updateOnlineLiveCounter(counter) {
  const h2 = document.createElement("h2");
  h2.className = "sub-header";
  h2.innerHTML = `Estamos com <span>${counter}</span> lives online.`;
  document.getElementById("header").append(h2);
}

let isOver = false;
let animation;
let cardClasses;

function onMouseOver(element) {
  if (!isOver) {
    isOver = true;

    const cardElement = element.querySelector(".card");
    cardClasses = cardElement.className;
    cardElement.className = `${cardClasses} cardMouseOver`;

    const avatarElement = cardElement.querySelector(".avatar");
    avatarElement.className = "avatar avatarMouseOver";

    const userElement = cardElement.querySelector(".user");
    addAnimation(userElement);
  }
}

function onMouseLeave(element) {
  if (isOver) {
    console.log("leave");
    isOver = false;

    const cardElement = element.querySelector(".card");
    cardElement.className = cardClasses;

    const avatarElement = cardElement.querySelector(".avatar");
    avatarElement.className = "avatar";

    const userElement = cardElement.querySelector(".user");
    if (userElement.scrollWidth > userElement.clientWidth) {
      userElement.className = "user";
      animation.cancel();
    }
  }
}

function addAnimation(element) {
  if (element.scrollWidth > element.clientWidth) {
    const animDuration = Math.max(
      (1500 * (element.scrollWidth - element.clientWidth)) / 28,
      750
    );
    animation = element.animate(
      [
        { transform: "translateX(0px)" },
        {
          transform: `translateX(-${
            element.scrollWidth - element.clientWidth
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

function createCards(streams) {
  const container = document.getElementById("streams-container");

  container.innerHTML = `${streams
    .map(
      (stream, idx) => `
      <a class="text-light" href="https://twitch.tv/${
        stream.user_name
      }" target="_blank" onmouseover="onMouseOver(this)" onmouseleave="onMouseLeave(this)">
        <div class="card ${stream.is_mature ? "mature" : ""}">
          <img class="avatar" src=${stream.profile_img} />
          <div class="user-div">
            <p class="user">
              ${stream.user_name}
            </p>
          </div>
          <p class="title">
            ${
              stream.title.length >= 30
                ? `${stream.title.substr(0, 27)}...`
                : stream.title
            }
          </p>
          <img class="thumb" src=${stream.thumbnail_url
            .replace("{width}", "400")
            .replace("{height}", "240")} />
          <div class="card-footer">
            <p id=time${idx} class="timer">${getOnlineTime(
        stream.started_at,
        idx
      )}</p>
            <p class="viewers">${stream.viewer_count}</p>
          </div>
        </div>
      </a>
    `
    )
    .toString()
    .replace(/,/gi, "")}`;
}
