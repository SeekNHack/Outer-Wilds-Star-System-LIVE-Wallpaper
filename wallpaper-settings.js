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
      if (key === 'strangerenabled') {
        const enabled = property.value === true || property.value === 1 || property.value === '1' || property.value === 'true';
        document.documentElement.classList.toggle('stranger-disabled', !enabled);
        continue;
      }
      if (key === 'quantumautoshift') {
        const enabled = property.value === true || property.value === 1 || property.value === '1' || property.value === 'true';
        window.dispatchEvent(new CustomEvent('wallpaper-quantum-auto-shift-changed', { detail: enabled }));
        continue;
      }
      if (key === 'quantumshiftseconds') {
        const seconds = Number(property.value);
        if (Number.isFinite(seconds) && seconds > 0) {
          window.dispatchEvent(new CustomEvent('wallpaper-quantum-shift-seconds-changed', { detail: seconds }));
        }
        continue;
      }
      if (key === 'coloredstars') {
        const enabled = property.value === true || property.value === 1 || property.value === '1' || property.value === 'true';
        window.dispatchEvent(new CustomEvent('wallpaper-star-colors-changed', { detail: enabled }));
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
      if (key === 'stardensity' || key === 'starsamount') {
        window.dispatchEvent(new CustomEvent('wallpaper-star-density-changed', { detail: value }));
      } else if (key === 'pathopacity') {
        document.documentElement.style.setProperty('--orbit-opacity', String(value / 100));
      } else if (key === 'motionspeed' && value > 0) {
        window.dispatchEvent(new CustomEvent('wallpaper-speed-changed', { detail: value / 100 }));
      } else if (key === 'strangerspeed' && value > 0) {
        window.dispatchEvent(new CustomEvent('wallpaper-stranger-speed-changed', { detail: value / 100 }));
      } else if (key === 'fullsystemscale') {
        document.documentElement.style.setProperty('--system-scale', String(value / 100));
      } else if (key === 'clocksize') {
        document.documentElement.style.setProperty('--clock-size', `${value}px`);
      }
    }
  },
  setPaused(isPaused) {
    window.dispatchEvent(new CustomEvent('wallpaper-pause-changed', { detail: isPaused }));
  }
};
