import { H as Hls } from './hls-vendor.js';

function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function showMessage(frame, message) {
    var node = frame.querySelector('.player-message');

    if (!node) {
        return;
    }

    node.textContent = message;
    node.classList.add('is-visible');
}

function initVideo(video, frame) {
    if (video.dataset.ready === 'true') {
        return;
    }

    var streamUrl = video.getAttribute('data-stream');

    if (!streamUrl) {
        showMessage(frame, '暂时无法播放，请稍后再试');
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.dataset.ready = 'true';
        return;
    }

    if (Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.dataset.ready = 'true';
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
                return;
            }

            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
                return;
            }

            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
                return;
            }

            showMessage(frame, '暂时无法播放，请稍后再试');
            hls.destroy();
        });

        video._hls = hls;
        return;
    }

    showMessage(frame, '暂时无法播放，请稍后再试');
}

function startPlayback(video, frame, overlay) {
    initVideo(video, frame);
    video.setAttribute('controls', 'controls');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function () {
            overlay.classList.add('is-hidden');
        }).catch(function () {
            showMessage(frame, '点击播放器继续观看');
        });
    } else {
        overlay.classList.add('is-hidden');
    }
}

ready(function () {
    document.querySelectorAll('.player-frame').forEach(function (frame) {
        var video = frame.querySelector('video');
        var overlay = frame.querySelector('.player-overlay');

        if (!video || !overlay) {
            return;
        }

        overlay.addEventListener('click', function () {
            startPlayback(video, frame, overlay);
        });

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback(video, frame, overlay);
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });

        video.addEventListener('pause', function () {
            overlay.classList.remove('is-hidden');
        });
    });
});
