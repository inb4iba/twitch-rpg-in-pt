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
          <div class="title-div">
            <p class="title">
              ${stream.title}
            </p>
          </div>
          <img class="thumb" src=${stream.thumbnail_url
            .replace("{width}", "400")
            .replace("{height}", "240")} />
          <div class="card-footer">
            <p id=time${idx} class="timer"><i class="fas fa-clock"></i> ${getOnlineTime(
        stream.started_at,
        idx
      )}</p>
            <p class="viewers"><i class="fas fa-user"></i> ${
              stream.viewer_count
            }</p>
          </div>
        </div>
      </a>
    `
    )
    .toString()
    .replace(/,/gi, "")}`;
}
