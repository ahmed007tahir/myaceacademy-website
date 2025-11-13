/* =========================================================================
   JS for:
   - seamless marquee announcement
   - slide-by-slide infinite carousel (cloning technique) with autoplay + arrows
   ========================================================================= */

/* ===== MARQUEE / ANNOUNCEMENT (seamless) ===== */
(function () {
  const track = document.querySelector('.ann-track');
  if (!track) return;

  // Duplicate track content to allow seamless scroll
  track.innerHTML = track.innerHTML + track.innerHTML;

  let req;
  let x = 0;
  const speed = 0.6; // px per frame, adjust for speed
  const step = () => {
    x -= speed;
    // total width is half of scrollWidth (we duplicated)
    const half = track.scrollWidth / 2;
    // when we've scrolled half, wrap back
    if (Math.abs(x) >= half) x = 0;
    track.style.transform = `translateX(${x}px)`;
    req = requestAnimationFrame(step);
  };
  // start
  track.style.willChange = 'transform';
  req = requestAnimationFrame(step);

  // pause on hover
  track.parentElement.addEventListener('mouseenter', () => cancelAnimationFrame(req));
  track.parentElement.addEventListener('mouseleave', () => { req = requestAnimationFrame(step); });
})();

/* ===== Carousel - slide-by-slide infinite loop with clones ===== */
(function () {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!track) return;

  let slides = Array.from(track.children);
  const slideCount = slides.length;

  // Clone first and last for smooth looping
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  // recalc slides array
  slides = Array.from(track.children);
  let index = 1; // we start at the real first slide (after lastClone)
  let slideWidth = slides[index].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

  // set initial translate
  const setTranslate = (idx, animate = true) => {
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform .5s ease';
    const x = -(idx * slideWidth);
    track.style.transform = `translateX(${x}px)`;
    if (!animate) {
      // Force reflow to ensure the style change takes effect, then re-enable transition
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
      track.style.transition = 'transform .5s ease';
    }
  };

  // initial
  const resizeHandler = () => {
    slideWidth = slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap || 0));
    setTranslate(index, false);
  };
  window.addEventListener('resize', resizeHandler);
  resizeHandler();

  // Next / Prev functions
  let autoPlayTimer = null;
  const next = () => {
    if (index >= slides.length - 1) return; // safety
    index++;
    setTranslate(index, true);
    handleLoopEdge();
  };
  const prev = () => {
    if (index <= 0) return;
    index--;
    setTranslate(index, true);
    handleLoopEdge();
  };

  // If we moved into a clone, after transition end jump to the real slide without animation
  const handleLoopEdge = () => {
    const onEnd = () => {
      // if at last clone (which is appended at end), jump to real first
      if (slides[index].classList.contains('clone')) {
        track.style.transition = 'none';
        if (index === slides.length - 1) {
          index = 1;
        } else if (index === 0) {
          index = slides.length - 2;
        }
        const x = -(index * slideWidth);
        track.style.transform = `translateX(${x}px)`;
        // Force reflow then restore transition
        // eslint-disable-next-line no-unused-expressions
        track.offsetHeight;
        track.style.transition = 'transform .5s ease';
      }
      track.removeEventListener('transitionend', onEnd);
    };
    track.addEventListener('transitionend', onEnd);
  };

  // Buttons
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

  // Autoplay
  const startAutoplay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => { next(); }, 4000);
  };
  const restartAutoplay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      startAutoplay();
    }
  };
  startAutoplay();

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => { if (autoPlayTimer) clearInterval(autoPlayTimer); });
  track.parentElement.addEventListener('mouseleave', () => startAutoplay());

  // Make sure initial position is correct
  setTimeout(() => setTranslate(index, false), 50);
})();
