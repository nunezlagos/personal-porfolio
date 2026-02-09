(function() {
  const canvas = document.getElementById('global-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Configuration
  const STAR_COUNT = 1000;

  let width = 0;
  let height = 0;
  let dpr = 2;
  let stars = [];
  let raf = 0;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeStar() {
    const isBlue = Math.random() < 0.35;
    return {
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.6, 1.8),
      baseAlpha: rand(0.05, 0.35),
      amp: rand(0.15, 0.65),
      speed: rand(0.8, 2.2),
      phase: rand(0, Math.PI * 2),
      driftX: rand(-0.015, 0.015),
      driftY: rand(-0.01, 0.01),
      hue: isBlue ? rand(185, 205) : rand(40, 60),
    };
  }

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, () => makeStar());
  }

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function drawStar(s, a) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${a})`;
    ctx.fill();
  }

  function tick(t) {
    clear();
    const time = t * 0.001;
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const tw = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
      const a = Math.min(1, Math.max(0, s.baseAlpha + s.amp * tw));

      drawStar(s, a);

      s.x += s.driftX;
      s.y += s.driftY;

      if (s.x < -5) s.x = width + 5;
      if (s.x > width + 5) s.x = -5;
      if (s.y < -5) s.y = height + 5;
      if (s.y > height + 5) s.y = -5;

      if (a < 0.06 && Math.random() < 0.03) {
        stars[i] = makeStar();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(tick);
  }

  resize();
  initStars();
  raf = requestAnimationFrame(tick);

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    initStars();
    raf = requestAnimationFrame(tick);
  });
})();
