// Wallpaper Engine sends all properties on load, then only the changed ones.
// Fresh size keys prevent saved values for the old individual sliders from applying.

window.wallpaperPropertyListener = {
  applyUserProperties(properties) {
    for (const [key, property] of Object.entries(properties)) {
      if (key === 'clocktop' || key === 'clockleft') {
        const cssProperty = key === 'clocktop' ? 'top' : 'left';
        const value = String(property.value).trim();
        if (CSS.supports(cssProperty, value)) {
          document.documentElement.style.setProperty(`--clock-${cssProperty}`, value);
        }
        continue;
      }
      if (key === 'orbitstyle') {
        const style = property.value;
        document.documentElement.classList.toggle('trail-mode', style === 'trail');
        document.documentElement.classList.toggle('orbit-hidden', style === 'hidden');
        continue;
      }
      if (key === 'skycolor') {
        const channels = String(property.value).trim().split(/\s+/).map(Number);
        if (channels.length === 3 && channels.every(Number.isFinite)) {
          const rgb = channels.map(channel => Math.round(Math.max(0, Math.min(1, channel)) * 255));
          document.documentElement.style.setProperty('--background-color', `rgb(${rgb.join(', ')})`);
        }
        continue;
      }

      const value = Number(property.value);
      if (!Number.isFinite(value)) continue;
      if (key === 'starsamount') {
        const far = document.querySelector('.stars--far');
        const near = document.querySelector('.stars--near');
        far.style.display = near.style.display = value === 0 ? 'none' : 'block';
        if (value > 0) {
          const spacing = Math.sqrt(100 / value);
          document.documentElement.style.setProperty('--far-star-size', `${390 * spacing}px ${287 * spacing}px`);
          document.documentElement.style.setProperty('--near-star-size', `${610 * spacing}px ${349 * spacing}px`);
        }
      } else if (key === 'pathopacity') {
        document.documentElement.style.setProperty('--orbit-opacity', String(value / 100));
      } else if (key === 'motionspeed' && value > 0) {
        window.dispatchEvent(new CustomEvent('wallpaper-speed-changed', { detail: value / 100 }));
      } else if (key === 'fullsystemscale') {
        document.documentElement.style.setProperty('--system-scale', String(value / 100));
      } else if (key === 'clocksize') {
        document.documentElement.style.setProperty('--clock-size', `${value}px`);
      }
    }
  }
};
