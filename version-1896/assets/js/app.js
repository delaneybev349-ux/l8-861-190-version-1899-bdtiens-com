(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const siteNav = document.querySelector('[data-site-nav]');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            siteNav.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let activeSlide = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeSlide);
        });
    }

    function startHero() {
        if (timer || slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const index = Number(dot.getAttribute('data-hero-dot')) || 0;
            showSlide(index);
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
            startHero();
        });
    });

    startHero();

    const inputs = Array.from(document.querySelectorAll('[data-card-search]'));

    inputs.forEach(function (input) {
        const panel = input.closest('[data-filter-scope]');
        const nextScope = panel ? panel.nextElementSibling : null;
        const scope = nextScope && nextScope.matches('[data-filter-scope]') ? nextScope : document;
        const cards = Array.from(scope.querySelectorAll('[data-card]'));
        const count = panel ? panel.querySelector('[data-filter-count]') : null;

        function applyFilter() {
            const query = input.value.trim().toLowerCase();
            let visible = 0;

            cards.forEach(function (card) {
                const text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-tags') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                const matched = !query || text.includes(query);
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = query ? '匹配到 ' + visible + ' 部影片' : '';
            }
        }

        input.addEventListener('input', applyFilter);
    });
})();
