(function() {
  const toggle = document.querySelector('.mobile-toggle');
  const panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let index = 0;
    const show = function(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function() {
        show(index + 1);
      }, 5200);
    }
  }

  document.querySelectorAll('.search-input').forEach(function(input) {
    const root = input.closest('main') || document;
    const items = Array.from(root.querySelectorAll('[data-search]'));
    input.addEventListener('input', function() {
      const q = input.value.trim().toLowerCase();
      items.forEach(function(item) {
        const text = (item.getAttribute('data-search') || '').toLowerCase();
        item.dataset.hidden = q && !text.includes(q) ? 'true' : 'false';
      });
    });
  });
})();
