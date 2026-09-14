(() => {
  const layer = document.getElementById('giants-lightning');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  let enabled = true;
  let paused = false;
  let nextFlashTimer;
  let flashId = 0;

  function addPath(group, shape, className = '') {
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', shape);
    if (className) path.setAttribute('class', className);
    group.appendChild(path);
  }

  function flash() {
    const x = 38 + Math.random() * 24;
    const y = 38 + Math.random() * 24;
    const angle = Math.random() * 360;
    const bend = (Math.random() - .5) * 8;
    const shape = `M 0 -19 L ${-3 + bend * .4} -10 L ${3 + bend} -3 ` +
      `L ${-2 + bend * .5} 5 L ${2 + bend} 11 L ${bend * .5} 20`;
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    const group = document.createElementNS(svgNamespace, 'g');
    group.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);
    addPath(group, shape);
    addPath(group, shape, 'giants-lightning__core');
    addPath(group, `M ${3 + bend} -3 L ${10 + bend} 0 L ${7 + bend} 8`,
      'giants-lightning__branch');
    svg.appendChild(group);
    layer.replaceChildren(svg);
    layer.style.setProperty('--storm-x', `${x}%`);
    layer.style.setProperty('--storm-y', `${y}%`);

    const currentFlash = ++flashId;
    const started = performance.now();
    function animate(now) {
      if (currentFlash !== flashId) return;
      const progress = Math.min(1, (now - started) / 430);
      // A short second flare makes the storm feel like lightning, not a pulse.
      const brightness = progress < .10 ? progress / .10
        : progress < .27 ? 1 - (progress - .10) / .17 * .78
          : progress < .43 ? .22 + (progress - .27) / .16 * .7
            : .92 * Math.pow((1 - progress) / .57, 2);
      layer.style.opacity = String(brightness);
      if (progress < 1) requestAnimationFrame(animate);
      else layer.replaceChildren();
    }
    animate(started);
  }

  function scheduleFlash() {
    clearTimeout(nextFlashTimer);
    if (paused || !enabled) return;
    // 4.5–10.5 seconds apart, averaging eight flashes per real minute.
    nextFlashTimer = setTimeout(() => {
      flash();
      scheduleFlash();
    }, (4.5 + Math.random() * 6) * 1000);
  }

  window.addEventListener('wallpaper-pause-changed', event => {
    paused = Boolean(event.detail);
    ++flashId;
    layer.style.opacity = '0';
    layer.replaceChildren();
    scheduleFlash();
  });
  window.addEventListener('wallpaper-giants-lightning-enabled-changed', event => {
    enabled = Boolean(event.detail);
    ++flashId;
    layer.style.opacity = '0';
    layer.replaceChildren();
    scheduleFlash();
  });
  scheduleFlash();
})();
