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
    timerElement.innerHTML = `<i class="fas fa-clock"></i> ${
      hours === 0 ? "" : hours + ":"
    }${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
