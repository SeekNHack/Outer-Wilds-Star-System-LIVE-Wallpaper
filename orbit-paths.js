// Draw every orbit below the bodies. Reading their real positions keeps full
// rings and fading trails aligned with the existing CSS and comet animations.
(() => {
  const root = document.documentElement;
  const system = document.querySelector('.solar-system');
  const canvas = document.getElementById('orbit-paths');
  const context = canvas.getContext('2d');
  if (!context) return;

  const mainOrbits = [...document.querySelectorAll('.orbit:not(.orbit--beacon)')];
  const beaconOrbit = document.querySelector('.orbit--beacon');
  const beacon = document.querySelector('.outer-beacon');
  let beaconHovered = false;
  beacon.addEventListener('mouseenter', () => { beaconHovered = true; });
  beacon.addEventListener('mouseleave', () => { beaconHovered = false; });
  const moonOrbits = [...document.querySelectorAll('.moon-orbit')];
  const binarySystem = document.querySelector('.binary-system');
  const cometOrbit = document.querySelector('.interloper-orbit');
  const comet = document.getElementById('interloper');
  let width = 0;
  let height = 0;

  function centerOf(element, systemBounds, scale) {
    const bounds = element.getBoundingClientRect();
    return {
      x: (bounds.left + bounds.width / 2 - systemBounds.left) / scale,
      y: (bounds.top + bounds.height / 2 - systemBounds.top) / scale
    };
  }

  function drawOrbit(cx, cy, rx, ry, body, opacity, trail, systemBounds, scale) {
    if (opacity <= 0 || !rx || !ry) return;
    if (!trail || !body) {
      context.strokeStyle = `rgba(237, 240, 238, ${opacity})`;
      context.beginPath();
      context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      context.stroke();
      return;
    }

    const position = centerOf(body, systemBounds, scale);
    const angle = Math.atan2((position.y - cy) / ry, (position.x - cx) / rx);
    const sections = 24;
    for (let i = 0; i < sections; i++) {
      const start = angle - Math.PI / 2 + i * Math.PI / (2 * sections);
      const end = angle - Math.PI / 2 + (i + 1) * Math.PI / (2 * sections);
      context.strokeStyle = `rgba(237, 240, 238, ${opacity * (i + 1) / sections})`;
      context.beginPath();
      context.ellipse(cx, cy, rx, ry, 0, start, end);
      context.stroke();
    }
  }

  function frame() {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    if (nextWidth !== width || nextHeight !== height) {
      width = nextWidth;
      height = nextHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, width * ratio / 4, height * ratio / 4);
    }
    context.clearRect(-width / 4, -height / 4, width, height);
    if (width && height) {
      const bounds = system.getBoundingClientRect();
      const scale = bounds.width / system.offsetWidth;
      const value = Number.parseFloat(getComputedStyle(root).getPropertyValue('--orbit-opacity'));
      const opacity = Number.isFinite(value) ? value : .36;
      const trail = root.classList.contains('trail-mode');
      context.lineWidth = 1;

      if (!root.classList.contains('orbit-hidden')) {
        for (const orbit of mainOrbits) {
          const center = centerOf(orbit, bounds, scale);
          const body = orbit.querySelector('.binary-system, .planet');
          drawOrbit(center.x, center.y, orbit.offsetWidth / 2, orbit.offsetHeight / 2,
            body, opacity, trail, bounds, scale);
        }
        for (const orbit of moonOrbits) {
          const style = getComputedStyle(orbit);
          if (style.display === 'none') continue;
          const center = centerOf(orbit, bounds, scale);
          const body = orbit.querySelector('.moon, .quantum-moon');
          drawOrbit(center.x, center.y, orbit.offsetWidth / 2, orbit.offsetHeight / 2,
            body, opacity * Number.parseFloat(style.opacity || 1), trail, bounds, scale);
        }
        const binaryCenter = centerOf(binarySystem, bounds, scale);
        drawOrbit(binaryCenter.x, binaryCenter.y, binarySystem.offsetWidth / 2,
          binarySystem.offsetWidth / 2, binarySystem.querySelector('.planet'),
          opacity, trail, bounds, scale);

        const cometCenter = centerOf(cometOrbit, bounds, scale);
        drawOrbit(cometCenter.x, cometCenter.y, cometOrbit.offsetWidth / 2,
          cometOrbit.offsetHeight / 2, comet, opacity, trail, bounds, scale);
      }
      if (beaconHovered && opacity > 0) {
        const center = centerOf(beaconOrbit, bounds, scale);
        context.setLineDash([12, 8]);
        context.lineWidth = 1;
        context.strokeStyle = `rgba(237, 240, 238, ${opacity})`;
        context.beginPath();
        context.ellipse(center.x, center.y,
          beaconOrbit.offsetWidth / 2, beaconOrbit.offsetHeight / 2, 0, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
