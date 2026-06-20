var Hls = window.Hls;
var video = document.querySelector("[data-player-video]");
var trigger = document.querySelector("[data-player-trigger]");
var overlay = document.querySelector("[data-player-overlay]");
var configNode = document.getElementById("player-config");
var config = configNode ? JSON.parse(configNode.textContent) : null;
var hls = null;
var prepared = false;

function preparePlayer() {
  if (!video || !config || prepared) {
    return;
  }

  prepared = true;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = config.source;
  } else if (Hls && Hls.isSupported()) {
    hls = new Hls({ enableWorker: true });
    hls.loadSource(config.source);
    hls.attachMedia(video);
  } else {
    video.src = config.source;
  }
}

function startPlayer() {
  if (!video) {
    return;
  }

  preparePlayer();

  if (overlay) {
    overlay.classList.add("is-hidden");
  }

  video.setAttribute("controls", "controls");
  video.play().catch(function () {});
}

if (trigger) {
  trigger.addEventListener("click", startPlayer);
}

if (video) {
  video.addEventListener("click", function () {
    if (!prepared || video.paused) {
      startPlayer();
    }
  });
}

window.addEventListener("pagehide", function () {
  if (hls) {
    hls.destroy();
    hls = null;
  }
});
