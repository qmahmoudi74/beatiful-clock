// loop => updateTime => displayTime => animateDigits => (removeAnimation) => tick => loop

const clockContainer = document.querySelector(".clock");
const rollClass = "clock__block--bounce";
let digitsTimeout;
let rollTimeout;

const tick = (newTime) => {
  clearTimeout(digitsTimeout);
  digitsTimeout = setTimeout(() => loop(newTime), 1e3);
};

const removeAnimations = () => {
  const groups = clockContainer.querySelectorAll("[data-time-group]");

  groups.forEach((group) => {
    group.classList.remove(rollClass);
  });
};

const animateDigits = (newTime) => {
  const groups = clockContainer.querySelectorAll("[data-time-group]");

  groups.forEach((group, i) => {
    const { a, b } = newTime;
    if (a[i] !== b[i]) group.classList.add(rollClass);
  });

  clearTimeout(rollTimeout);
  rollTimeout = setTimeout(removeAnimations, 900);
};

const displayTime = (newTime) => {
  const timeDigits = [...newTime.b];
  const amPm = timeDigits.pop();

  clockContainer.ariaLabel = `${timeDigits.join(":")} ${amPm}`;

  Object.keys(newTime).forEach((letter) => {
    const letterEls = clockContainer.querySelectorAll(
      `[data-time="${letter}"]`
    );

    letterEls.forEach((el, i) => {
      if (el.textContent === newTime[letter][i]) return;
      el.textContent = newTime[letter][i];
    });
  });
};

const updateTime = (oldTime) => {
  const newTime = JSON.parse(JSON.stringify(oldTime));

  const rawDate = new Date();
  const date = new Date(rawDate.getTime() + 1e3);

  const hour = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    hour12: false
  });

  const minute = date.toLocaleTimeString("en-US", { minute: "2-digit" });
  const second = date.toLocaleTimeString("en-US", { second: "2-digit" });

  const amPm = parseInt(hour) < 12 ? "AM" : "PM";

  newTime.a = [...newTime.b];
  newTime.b = [
    `${parseInt(hour) > 12 ? `0${hour % 12}` : hour % 12}`,
    minute,
    second,
    amPm
  ];

  if (!newTime.a.length) newTime.a = [...newTime.b];

  return newTime;
};

function loop(oldTime = { a: [], b: [] }) {
  const newTime = updateTime(oldTime);
  displayTime(newTime);
  animateDigits(newTime);
  tick(newTime);
}

loop();
