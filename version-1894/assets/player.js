var hlsPromise = null;

function loadHls() {
  if (window.Hls) {
    return Promise.resolve(window.Hls);
  }
  if (hlsPromise) {
    return hlsPromise;
  }
  hlsPromise = new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
    script.async = true;
    script.onload = function () {
      resolve(window.Hls);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return hlsPromise;
}

export function setupPlayer(videoId, overlayId, source) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  if (!video || !source) {
    return;
  }

  var attached = false;
  var hlsInstance = null;

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  }

  function showOverlay() {
    if (overlay) {
      overlay.classList.remove("is-hidden");
    }
  }

  function attachSource() {
    if (attached) {
      return Promise.resolve();
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return Promise.resolve();
    }
    return loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }).catch(function () {
      video.src = source;
    });
  }

  function startPlayback() {
    attachSource().then(function () {
      hideOverlay();
      var playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {
          showOverlay();
        });
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener("play", hideOverlay);
  video.addEventListener("pause", function () {
    if (!video.currentTime || video.ended) {
      showOverlay();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
