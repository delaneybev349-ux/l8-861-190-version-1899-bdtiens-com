(function () {
    window.initPlayer = function (videoId, overlayId, sourceUrl) {
        const video = document.getElementById(videoId);
        const overlay = document.getElementById(overlayId);
        let loaded = false;
        let hls = null;

        if (!video || !overlay || !sourceUrl) {
            return;
        }

        const load = function () {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        };

        const begin = function () {
            load();
            overlay.classList.add("is-hidden");
            video.controls = true;
            const playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        };

        overlay.addEventListener("click", begin);

        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            }
        });

        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });

        video.addEventListener("ended", function () {
            overlay.classList.remove("is-hidden");
        });

        window.addEventListener("beforeunload", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    };
})();
