import { H as Hls } from './hls-vendor-dru42stk.js';

const players = document.querySelectorAll('.movie-player');

players.forEach(function(player) {
  const video = player.querySelector('video');
  const button = player.querySelector('.play-layer');
  if (!video || !button) {
    return;
  }

  const stream = video.getAttribute('data-stream');
  let ready = false;
  let hls = null;

  const prepare = function() {
    if (ready || !stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    ready = true;
  };

  const play = function() {
    prepare();
    video.controls = true;
    button.hidden = true;
    const action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function() {
        button.hidden = false;
      });
    }
  };

  button.addEventListener('click', play);
  video.addEventListener('click', function() {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener('pagehide', function() {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
});
