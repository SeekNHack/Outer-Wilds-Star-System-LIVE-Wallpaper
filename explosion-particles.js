// Canvas sparks are keyed to the finale's progress, so pausing or changing the
// loop duration never makes them drift out of sync with the expanding Sun.
(() => {
  const canvas = document.getElementById('explosion-particles');
  const context = canvas.getContext('2d');
  if (!context) return;

  const palette = ['255,255,255', '238,250,255', '160,224,255', '92,190,255'];
  let width = 0;
  let height = 0;
  let particles = [];
  let cycleSeed = Math.floor(Math.random() * 0xffffffff);
  let progress = null;
  let lastDrawnProgress = null;

  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smooth = value => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };

  function buildParticles() {
    let seed = cycleSeed;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 0x100000000;
    };
    const count = Math.min(115, Math.max(55, Math.round(width * height / 1_000_000 * 72)));
    particles = Array.from({ length: count }, () => ({
      angle: random() * Math.PI * 2,
      launch: random() < .72 ? random() * .035 : .045 + random() * .04,
      lifetime: .04 + random() * .035,
      reach: .06 + random() * .15,
      size: .7 + Math.pow(random(), 2) * 2.1,
      alpha: .6 + random() * .4,
      curve: (random() - .5) * .12,
      color: palette[Math.floor(random() * palette.length)]
    }));
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildParticles();
    lastDrawnProgress = null;
    draw();
  }

  function draw() {
    if (!width || !height || progress === lastDrawnProgress) return;
    lastDrawnProgress = progress;
    context.clearRect(0, 0, width, height);
    if (progress === null) return;

    const centerX = width / 2;
    const centerY = height * .52;
    if (progress < 0) {
      // A growing cue appears only for the final fraction of a second before launch.
      if (progress >= -.006) {
        const cue = smooth((progress + .006) / .006);
        context.beginPath();
        context.arc(centerX, centerY, 3 + 5 * cue, 0, Math.PI * 2);
        context.strokeStyle = `rgba(125, 220, 255, ${.2 * cue})`;
        context.lineWidth = 1.5 + 2 * cue;
        context.stroke();
      }
      return;
    }

    const fade = 1 - smooth((progress - .58) / .14);
    if (fade <= 0) return;
    const diagonal = Math.hypot(width, height);
    context.globalCompositeOperation = 'lighter';

    for (const start of [0, .06]) {
      const age = (progress - start) / .35;
      if (age < 0 || age > 1) continue;
      context.beginPath();
      context.arc(centerX, centerY,
        8 + diagonal * .62 * (1 - Math.pow(1 - age, 1.5)), 0, Math.PI * 2);
      context.strokeStyle = `rgba(125, 220, 255, ${.2 * (1 - age) * fade})`;
      context.lineWidth = 1.5 + (1 - age) * 2;
      context.stroke();
    }

    for (const particle of particles) {
      const age = (progress - particle.launch) / particle.lifetime;
      if (age < 0 || age > 1) continue;
      const opacity = particle.alpha * smooth(age / .1) *
        (1 - smooth((age - .3) / .7)) * fade;
      if (opacity <= 0) continue;
      const angle = particle.angle + particle.curve * age;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const distance = 6 + (1 - Math.pow(1 - age, 1.45)) * diagonal * particle.reach;
      const x = centerX + dx * distance;
      const y = centerY + dy * distance;
      if (x < -50 || x > width + 50 || y < -50 || y > height + 50) continue;

      const trail = (10 + particle.size * 16) * (.55 + age * .65);
      const tailX = x - dx * trail;
      const tailY = y - dy * trail;
      const bendX = (tailX + x) / 2 - dy * particle.curve * 30;
      const bendY = (tailY + y) / 2 + dx * particle.curve * 30;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(tailX, tailY);
      context.quadraticCurveTo(bendX, bendY, x, y);
      const glow = context.createLinearGradient(tailX, tailY, x, y);
      glow.addColorStop(0, 'rgba(55, 170, 255, 0)');
      glow.addColorStop(.55, `rgba(55, 170, 255, ${opacity * .16})`);
      glow.addColorStop(1, `rgba(90, 205, 255, ${opacity * .4})`);
      context.strokeStyle = glow;
      context.lineWidth = 5 + particle.size * 2.5;
      context.shadowColor = 'rgba(75, 190, 255, .75)';
      context.shadowBlur = 9;
      context.stroke();
      context.shadowBlur = 0;
      const core = context.createLinearGradient(tailX, tailY, x, y);
      core.addColorStop(0, `rgba(${particle.color}, 0)`);
      core.addColorStop(.7, `rgba(${particle.color}, ${opacity * .4})`);
      core.addColorStop(1, `rgba(${particle.color}, ${opacity})`);
      context.strokeStyle = core;
      context.lineWidth = particle.size;
      context.stroke();
    }
    context.globalCompositeOperation = 'source-over';
  }

  window.addEventListener('wallpaper-loop-explosion-progress', event => {
    const value = Number(event.detail);
    if (!Number.isFinite(value)) return;
    progress = value;
    draw();
  });
  window.addEventListener('wallpaper-loop-reset', () => {
    progress = null;
    cycleSeed = Math.floor(Math.random() * 0xffffffff);
    buildParticles();
    lastDrawnProgress = -1;
    draw();
  });
  window.addEventListener('resize', resize);
  resize();
})();
