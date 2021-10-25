let isOver = false;
let userAnimation, titleAnimation;
let cardClasses;

function onMouseOver(element) {
  if (!isOver) {
    isOver = true;

    const cardElement = element.querySelector(".card");
    cardClasses = cardElement.className;
    cardElement.className = `${cardClasses} card-mouse-over`;

    const avatarElement = cardElement.querySelector(".avatar");
    avatarElement.className = "avatar avatar-mouse-over";

    const thumbElement = cardElement.querySelector(".thumb");
    thumbElement.className = "thumb thumb-mouse-over";

    const userElement = cardElement.querySelector(".user");
    if (checkOverflow(userElement)) addUserAnimation(userElement);

    const titleElement = cardElement.querySelector(".title");
    if (checkOverflow(titleElement)) addTitleAnimation(titleElement);
  }
}

function onMouseLeave(element) {
  if (isOver) {
    isOver = false;

    const cardElement = element.querySelector(".card");
    cardElement.className = cardClasses;

    const avatarElement = cardElement.querySelector(".avatar");
    avatarElement.className = "avatar";

    const thumbElement = cardElement.querySelector(".thumb");
    thumbElement.className = "thumb";

    const userElement = cardElement.querySelector(".user");
    if (checkOverflow(userElement)) userAnimation.cancel();

    const titleElement = cardElement.querySelector(".title");
    if (checkOverflow(titleElement)) titleAnimation.cancel();
  }
}

function checkOverflow(element) {
  if (element.scrollWidth <= element.clientWidth) return false;

  return true;
}

function addUserAnimation(element) {
  const animDuration = Math.max(
    (1500 * (element.scrollWidth - element.clientWidth)) / 28,
    750
  );
  userAnimation = element.animate(
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
    }
  );
}

function addTitleAnimation(element) {
  const animDuration = Math.max(
    (1500 * (element.scrollWidth - element.clientWidth)) / 28,
    750
  );
  titleAnimation = element.animate(
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
    }
  );
}
