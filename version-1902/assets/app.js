(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();
            var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                card.classList.toggle('is-hidden', keyword !== '' && text.indexOf(keyword) === -1);
            });
        });
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var trigger = player.querySelector('[data-play-trigger]');
        var hlsInstance = null;

        function prepareVideo() {
            if (!video || video.getAttribute('data-ready') === '1') {
                return;
            }

            var stream = video.getAttribute('data-stream');

            if (!stream) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    backBufferLength: 30
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }

            video.setAttribute('data-ready', '1');
        }

        function playVideo() {
            prepareVideo();

            if (trigger) {
                trigger.classList.add('is-hidden');
            }

            if (video) {
                var playPromise = video.play();

                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            }
        }

        if (trigger) {
            trigger.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });

            video.addEventListener('ended', function () {
                if (trigger) {
                    trigger.classList.remove('is-hidden');
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    });
}());
