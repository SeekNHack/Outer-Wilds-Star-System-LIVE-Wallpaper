// Lively's property values differ only for colors and dropdowns. Reuse the
// Wallpaper Engine settings handler so both hosts update the same scene state.
const livelyPropertyNames = new Set([
  'stardensity', 'skycolor', 'coloredstars', 'orbitstyle', 'pathopacity',
  'motionspeed', 'fullsystemscale', 'clocksize', 'clocktop', 'clockleft',
  'strangerenabled', 'strangershadowonly', 'strangerspeed',
  'quantumautoshift', 'quantumshiftseconds', 'loopenabled', 'loopcountdown',
  'loopacceleration', 'meteoritesenabled', 'giantslightningenabled'
]);

window.livelyPropertyListener = function livelyPropertyListener(name, value) {
  if (!livelyPropertyNames.has(name)) return;

  if (name === 'orbitstyle') {
    value = ['full', 'trail', 'hidden'][value];
    if (!value) return;
  } else if (name === 'skycolor') {
    if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) return;
    value = [1, 3, 5].map(index =>
      (parseInt(value.slice(index, index + 2), 16) / 255).toFixed(6)
    ).join(' ');
  }

  window.wallpaperPropertyListener.applyUserProperties({ [name]: { value } });
};

window.livelyWallpaperPlaybackChanged = function livelyWallpaperPlaybackChanged(data) {
  try {
    const state = typeof data === 'string' ? JSON.parse(data) : data;
    if (typeof state?.IsPaused === 'boolean') {
      window.wallpaperPropertyListener.setPaused(state.IsPaused);
    }
  } catch (error) {
    console.warn('Ignoring invalid Lively playback event', error);
  }
};
