const hoverAudio = new Audio("/sfx/hover.mp3");
const clickAudio = new Audio("/sfx/click.mp3");

hoverAudio.volume = 0.4;
clickAudio.volume = 0.6;

export const playHover = () => {
  hoverAudio.currentTime = 0;
  hoverAudio.play().catch(() => {});
};

// hover节流，避免频繁触发
// let lastHoverTime = 0;

// export const playHover = () => {
//   const now = Date.now();
//   if (now - lastHoverTime < 120) return;

//   lastHoverTime = now;
//   hoverAudio.currentTime = 0;
//   hoverAudio.play().catch(() => {});
// };

export const playClick = () => {
  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {});
};
