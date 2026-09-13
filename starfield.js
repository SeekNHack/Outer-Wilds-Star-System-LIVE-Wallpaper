// Draw individual stars so density scales with screen area instead of repeating tiles.
(() => {
  const canvas = document.getElementById('starfield');
  const context = canvas.getContext('2d');
  if (!context) return;

  const colors = [
    '#ffffff', '#f4f8ff', '#e8f2ff', '#fffaf0', '#f8fbff',
    '#83b4ff', '#a9d2ff', '#d2e7ff',
    '#ffe49a', '#ffce69', '#f9edbe',
    '#f3ae69', '#e98553', '#ffca92'
  ];
  const starsPerMillionPixels = 220;
  let density = 100;
  let colored = true;
  let width = 0;
  let height = 0;
  let stars = [];
  let frameId = null;
  let lastFrameTime = null;

  function makeStar() {
    const depth = Math.random();
    const far = depth < .7;
    const near = depth >= .94;
    const speed = far ? .8 + Math.random() * 1.2
      : near ? 3.8 + Math.random() * 1.8
        : 2 + Math.random() * 1.5;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: far ? .75 + Math.random() * .55
        : near ? 1.9 + Math.random() * .8
          : 1.2 + Math.random() * .65,
      speedX: speed,
      speedY: speed * (.25 + Math.random() * .2),
      alpha: far ? .45 + Math.random() * .35
        : near ? .72 + Math.random() * .25
          : .58 + Math.random() * .28,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: .5 + Math.random() * 1.2
    };
  }

  function updateStarCount() {
    const count = Math.round(width * height / 1_000_000 * starsPerMillionPixels * density / 100);
    while (stars.length < count) stars.push(makeStar());
    stars.length = count;
  }

  function scheduleFrame() {
    if (frameId === null) frameId = requestAnimationFrame(drawFrame);
  }

  function drawFrame(now) {
    frameId = null;
    if (!stars.length) {
      context.clearRect(0, 0, width, height);
      lastFrameTime = null;
      return;
    }
    if (lastFrameTime !== null && now - lastFrameTime < 33) {
      scheduleFrame();
      return;
    }

    const elapsed = lastFrameTime === null ? 0 : Math.min((now - lastFrameTime) / 1000, .1);
    lastFrameTime = now;
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.x = (star.x + star.speedX * elapsed) % width;
      star.y = (star.y + star.speedY * elapsed) % height;
      const alpha = star.alpha * (.85 + .15 * Math.sin(now / 1000 * star.twinkleSpeed + star.phase));
      context.fillStyle = colored ? star.color : '#ffffff';
      if (star.size > 1.9) {
        context.globalAlpha = alpha * .08;
        context.beginPath();
        context.arc(star.x, star.y, star.size * 1.8, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = alpha;
      context.fillRect(star.x - star.size / 2, star.y - star.size / 2, star.size, star.size);
    }
    context.globalAlpha = 1;
    scheduleFrame();
  }

  function resizeStarfield() {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (!nextWidth || !nextHeight) return;
    if (width && height) {
      for (const star of stars) {
        star.x *= nextWidth / width;
        star.y *= nextHeight / height;
      }
    }
    width = nextWidth;
    height = nextHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    updateStarCount();
    scheduleFrame();
  }

  window.addEventListener('resize', resizeStarfield);
  window.addEventListener('wallpaper-star-density-changed', event => {
    const value = Number(event.detail);
    if (!Number.isFinite(value)) return;
    density = Math.max(0, Math.min(300, value));
    updateStarCount();
    scheduleFrame();
  });
  window.addEventListener('wallpaper-star-colors-changed', event => {
    colored = event.detail;
    scheduleFrame();
  });
  resizeStarfield();
})();
