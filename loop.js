// The configured duration ends at the start of the finale; its 26 seconds
// run afterward, so the countdown reaches zero when the Sun begins collapsing.
(() => {
  const ORIGINAL_SECONDS = 22 * 60;
  const HOURLY_SECONDS = 60 * 60;
  const FINALE_SECONDS = 26;
  const RESTART_FADE_SECONDS = 1.8;
  const SAND_FADE_SECONDS = 1.5;
  const STATION_FALL_SECONDS = 5;
  const PROBE_VISIBLE_SECONDS = 60;
  const PROBE_FADE_SECONDS = 1.5;
  const PROBE_PRELAUNCH_SECONDS = 1;
  // Keep the red phase only 30% larger than normal before the final collapse begins.
  const RED_SUN_MAX_SCALE = 1.30;
  const root = document.documentElement;
  const sun = document.querySelector('.sun');
  const wallpaper = document.querySelector('.wallpaper');
  const probeCannon = document.querySelector('.moon--orbital-probe');
  const probeMoonOrbit = document.querySelector('.moon-orbit--giants');
  const giantTraveller = document.querySelector('.traveller--giants');
  const probeShot = document.querySelector('.probe-shot');
  const countdownElement = document.getElementById('loop-remaining');
  const previewCountdown = new URLSearchParams(window.location.search).get('loopcountdown');
  const accelerationParam = Number(new URLSearchParams(window.location.search).get('loopacceleration'));
  const hasAccelerationParam = new URLSearchParams(window.location.search).has('loopacceleration') &&
    Number.isFinite(accelerationParam) && accelerationParam >= 100 && accelerationParam <= 3000;
  if (previewCountdown === '0' || previewCountdown === '1') {
    root.classList.toggle('loop-countdown-enabled', previewCountdown === '1');
  }
  const milestones = {
    sandStart: 120,
    sailsOpen: 400,
    stationDestroyed: 690,
    damBreak: 780,
    cometCrash: 1200,
    sandStop: 1220,
    towerFall: 1230,
    endTimes: 1235
  };
  let enabled = true;
  let triggerMode = 'timer';
  let triggerModeSetByHost = false;
  let accelerationPercent = hasAccelerationParam ? accelerationParam : 100;
  let accelerationSetByWallpaperEngine = false;
  let paused = false;
  // The story occupies either 22 minutes or the entire hour before :00.
  let duration = ORIGINAL_SECONDS;
  let elapsed = 0;
  let previousTime = null;
  let frameId = null;
  let restarting = false;
  let finaleBaseDiameter = null;
  let appliedSunScale = 1;
  let probeOrigin = null;
  let probeDirection = Math.random() * Math.PI * 2;
  let probeStartSeconds = PROBE_PRELAUNCH_SECONDS;
  let displayedRemainingSeconds = -1;
  let hourTarget = null;
  let hourRemainingSeconds = 0;
  let restartStartedAt = 0;

  const storyDuration = () => duration;
  const at = seconds => seconds / ORIGINAL_SECONDS * duration;
  const timeScale = () => enabled && triggerMode === 'timer' ? accelerationPercent / 100 : 1;
  const syncTimeScale = () => window.dispatchEvent(new CustomEvent(
    'wallpaper-time-scale-changed', { detail: timeScale() }
  ));
  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smooth = value => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };
  // Start quickly, then ease into a slower expansion.
  const fastThenSlow = value => 1 - Math.pow(1 - clamp01(value), 3);
  // Start gently, then accelerate into the final collapse.
  const slowThenFast = value => Math.pow(clamp01(value), 3);

  function hourlySchedule(now) {
    // The story advances with the local clock and ends at every full hour.
    // During the 26-second finale, the target remains the hour just reached.
    const hourStart = new Date(now);
    hourStart.setMinutes(0, 0, 0);
    let target = hourStart.getTime();
    if (now >= target + FINALE_SECONDS * 1000) target += 60 * 60 * 1000;
    const remaining = (target - now) / 1000;
    return {
      target,
      remaining,
      elapsed: duration - remaining
    };
  }

  function clearEffects() {
    root.classList.remove(
      'loop-active', 'loop-probe-firing', 'loop-probe-broken', 'loop-sand-flowing',
      'loop-sails-open',
      'loop-dam-broken',
      'loop-tower-fallen', 'loop-end-times', 'loop-finale', 'loop-blackout'
    );
    root.classList.remove('loop-restarting');
    root.style.removeProperty('--loop-sun-scale');
    root.style.removeProperty('--loop-sun-inverse-scale');
    root.style.removeProperty('--loop-sun-mask-alpha');
    root.style.removeProperty('--loop-sun-red');
    root.style.removeProperty('--loop-sun-blue');
    root.style.removeProperty('--loop-sun-brightness');
    root.style.removeProperty('--loop-sun-opacity');
    root.style.removeProperty('--loop-stranger-opacity');
    root.style.removeProperty('--loop-station-left');
    root.style.removeProperty('--loop-station-opacity');
    root.style.removeProperty('--loop-world-opacity');
    root.style.removeProperty('--loop-cover-opacity');
    root.style.removeProperty('--loop-sand-fade-duration');
    root.style.removeProperty('--loop-twins-progress');
    window.dispatchEvent(new CustomEvent('wallpaper-loop-star-visibility', { detail: 1 }));
  }

  function resetScene(fadeIn = false) {
    elapsed = 0;
    restarting = fadeIn;
    restartStartedAt = Date.now();
    hourTarget = null;
    hourRemainingSeconds = 0;
    finaleBaseDiameter = null;
    appliedSunScale = 1;
    probeOrigin = null;
    probeDirection = Math.random() * Math.PI * 2;
    const restartDelay = fadeIn
      ? RESTART_FADE_SECONDS + .5 + (triggerMode === 'hour' ? FINALE_SECONDS : 0)
      : 0;
    probeStartSeconds = restartDelay + PROBE_PRELAUNCH_SECONDS;
    probeShot.style.opacity = '0';
    displayedRemainingSeconds = -1;
    previousTime = null;
    clearEffects();
    root.style.setProperty('--loop-sand-fade-duration', `${at(SAND_FADE_SECONDS)}s`);
    if (fadeIn) {
      root.classList.add('loop-restarting');
      root.style.setProperty('--loop-cover-opacity', '1');
    }
    root.classList.toggle('loop-disabled', !enabled);
    window.dispatchEvent(new Event('wallpaper-loop-reset'));
    aimProbeCannon();
    window.dispatchEvent(new CustomEvent('wallpaper-loop-story-duration', { detail: duration }));
  }

  function updateCountdown() {
    const remaining = triggerMode === 'hour'
      ? Math.max(0, Math.ceil(hourRemainingSeconds))
      : Math.max(0, Math.ceil(duration - elapsed));
    if (remaining === displayedRemainingSeconds) return;
    displayedRemainingSeconds = remaining;
    const minutes = Math.floor(remaining / 60);
    const seconds = String(remaining % 60).padStart(2, '0');
    countdownElement.textContent = `${minutes}:${seconds}`;
  }

  function renderProbe() {
    const flightTime = elapsed - probeStartSeconds;
    if (flightTime < 0 || flightTime >= PROBE_VISIBLE_SECONDS + PROBE_FADE_SECONDS) {
      probeShot.style.opacity = '0';
      return;
    }
    if (probeOrigin === null) {
      const cannon = probeCannon.getBoundingClientRect();
      const scene = wallpaper.getBoundingClientRect();
      const x = cannon.left + cannon.width / 2;
      const y = cannon.top + cannon.height / 2;
      probeOrigin = {
        x: x - scene.left, y: y - scene.top,
        dx: Math.cos(probeDirection), dy: Math.sin(probeDirection)
      };
    }
    // Keep the launch speed throughout the minute, even after leaving the screen.
    const distance = 65 * flightTime / .85;
    const x = probeOrigin.x + probeOrigin.dx * distance;
    const y = probeOrigin.y + probeOrigin.dy * distance;
    probeShot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    probeShot.style.opacity = String(clamp01(flightTime / .12) *
      (1 - clamp01((flightTime - PROBE_VISIBLE_SECONDS) / PROBE_FADE_SECONDS)));
  }

  function orbitAngle(element) {
    const transform = getComputedStyle(element).transform;
    if (transform === 'none') return 0;
    const matrix = new DOMMatrixReadOnly(transform);
    return Math.atan2(matrix.b, matrix.a);
  }

  function aimProbeCannon() {
    // Both animated orbits rotate the cannon's local right-facing axis.
    // Cancel those rotations so it keeps pointing along the probe's path.
    const parentAngle = orbitAngle(giantTraveller) + orbitAngle(probeMoonOrbit);
    probeMoonOrbit.style.setProperty('--probe-aim-angle', `${probeDirection - parentAngle}rad`);
  }

  function render() {
    window.dispatchEvent(new CustomEvent('wallpaper-loop-time', { detail: elapsed }));
    updateCountdown();
    const finale = elapsed >= storyDuration();
    const storyTime = Math.min(elapsed, storyDuration());
    const passed = seconds => storyTime >= at(seconds);
    root.classList.toggle('loop-active', true);
    root.classList.toggle('loop-probe-firing',
      elapsed >= probeStartSeconds && elapsed < probeStartSeconds + 1.2);
    root.classList.toggle('loop-probe-broken',
      elapsed >= probeStartSeconds);
    aimProbeCannon();
    renderProbe();
    root.classList.toggle('loop-sand-flowing',
      passed(milestones.sandStart) && storyTime < at(milestones.sandStop - SAND_FADE_SECONDS));
    root.style.setProperty('--loop-twins-progress', String(clamp01(
      (storyTime - at(milestones.sandStart)) / at(milestones.sandStop - milestones.sandStart)
    )));
    const stationFallStart = at(milestones.stationDestroyed);
    const stationFall = clamp01((storyTime - stationFallStart) / at(STATION_FALL_SECONDS));
    root.style.setProperty('--loop-station-left', `${90 - 40 * smooth(stationFall)}%`);
    root.style.setProperty('--loop-station-opacity', String(1 - smooth((stationFall - .65) / .35)));
    root.classList.toggle('loop-sails-open', passed(milestones.sailsOpen));
    root.classList.toggle('loop-dam-broken', passed(milestones.damBreak));
    root.classList.toggle('loop-tower-fallen', passed(milestones.towerFall));
    root.classList.toggle('loop-end-times', passed(milestones.endTimes));
    root.classList.toggle('loop-finale', finale);
    root.classList.toggle('loop-blackout', finale);
    if (restarting) {
      const restartElapsed = triggerMode === 'hour'
        ? (Date.now() - restartStartedAt) / 1000
        : elapsed;
      const cover = 1 - smooth(restartElapsed / RESTART_FADE_SECONDS);
      root.classList.toggle('loop-restarting', cover > 0);
      root.style.setProperty('--loop-cover-opacity', String(cover));
      if (cover <= 0) restarting = false;
    }

    // Keep a few stars visible through End Times; the last vanish with 1:00 left.
    const starProgress = clamp01(storyTime / at(ORIGINAL_SECONDS - 60));
    const starVisibility = Math.pow(1 - starProgress, .7);
    window.dispatchEvent(new CustomEvent('wallpaper-loop-star-visibility', { detail: starVisibility }));

    const redProgress = smooth(storyTime / storyDuration());
    window.dispatchEvent(new CustomEvent('wallpaper-loop-comet-impact-ready', {
      detail: passed(milestones.cometCrash)
    }));

    if (!finale) {
      appliedSunScale = 1 + (RED_SUN_MAX_SCALE - 1) * redProgress;
      root.style.setProperty('--loop-sun-scale', String(appliedSunScale));
      root.style.setProperty('--loop-sun-inverse-scale', String(1 / appliedSunScale));
      root.style.setProperty('--loop-sun-mask-alpha', '0');
      root.style.setProperty('--loop-sun-red', String(redProgress * .85));
      root.style.setProperty('--loop-sun-blue', '0');
    } else {
      const progress = clamp01((elapsed - storyDuration()) / FINALE_SECONDS);
      // Particles use the exact expansion phase as their zero.
      window.dispatchEvent(new CustomEvent('wallpaper-loop-explosion-progress', {
        detail: (progress - .20) / .77
      }));
      if (finaleBaseDiameter === null) {
        finaleBaseDiameter = sun.getBoundingClientRect().width / appliedSunScale;
      }
      const smallScale = 6 / finaleBaseDiameter;
      const fullScale = Math.hypot(window.innerWidth, window.innerHeight) * 2 / finaleBaseDiameter;
      const blueProgress = slowThenFast(progress / .192);
      const scale = progress < .192
        ? RED_SUN_MAX_SCALE + (smallScale - RED_SUN_MAX_SCALE) * blueProgress
        : progress < .20
          ? smallScale
          : smallScale + (fullScale - smallScale) * clamp01((progress - .20) / .77);
      appliedSunScale = scale;
      root.style.setProperty('--loop-sun-scale', String(scale));
      root.style.setProperty('--loop-sun-inverse-scale', String(1 / scale));
      root.style.setProperty('--loop-sun-mask-alpha', String(blueProgress));
      root.style.setProperty('--loop-sun-red', String(.85 * (1 - blueProgress)));
      root.style.setProperty('--loop-sun-blue', String(blueProgress));
      root.style.setProperty('--loop-sun-brightness', String(1 + .15 * blueProgress));
      root.style.setProperty('--loop-stranger-opacity', String(1 - smooth((progress - .192) / .008)));
      root.style.setProperty('--loop-world-opacity', String(1 - clamp01((progress - .20) / .77)));
      const cover = smooth((progress - .90) / .08);
      root.style.setProperty('--loop-sun-opacity', String(1 - cover));
      root.style.setProperty('--loop-cover-opacity', String(cover));
    }
  }

  function tick(now) {
    frameId = null;
    if (!enabled) return;
    if (triggerMode === 'hour') {
      if (!paused) {
        const schedule = hourlySchedule(Date.now());
        if (hourTarget !== null && hourTarget !== schedule.target) resetScene(true);
        hourTarget = schedule.target;
        hourRemainingSeconds = schedule.remaining;
        elapsed = schedule.elapsed;
      }
    } else {
      if (previousTime !== null && !paused) {
        elapsed += Math.max(0, Math.min(now - previousTime, 1000)) / 1000 * timeScale();
      }
      if (elapsed >= duration + FINALE_SECONDS) resetScene(true);
    }
    previousTime = now;
    render();
    frameId = requestAnimationFrame(tick);
  }

  function initializeHourlyScene() {
    const schedule = hourlySchedule(Date.now());
    hourTarget = schedule.target;
    hourRemainingSeconds = schedule.remaining;
    elapsed = schedule.elapsed;
    render();
  }

  window.addEventListener('wallpaper-loop-enabled-changed', event => {
    const nextEnabled = Boolean(event.detail);
    if (enabled === nextEnabled) return;
    enabled = nextEnabled;
    resetScene(enabled && triggerMode === 'hour');
    if (enabled && triggerMode === 'hour') initializeHourlyScene();
    syncTimeScale();
    if (enabled && frameId === null) frameId = requestAnimationFrame(tick);
  });
  window.addEventListener('wallpaper-loop-trigger-mode-changed', event => {
    if (event.detail !== 'timer' && event.detail !== 'hour') return;
    triggerModeSetByHost = true;
    if (triggerMode === event.detail) return;
    triggerMode = event.detail;
    duration = triggerMode === 'hour' ? HOURLY_SECONDS : ORIGINAL_SECONDS;
    resetScene(triggerMode === 'hour');
    if (triggerMode === 'hour' && enabled) initializeHourlyScene();
    syncTimeScale();
  });
  window.addEventListener('wallpaper-loop-acceleration-changed', event => {
    const percent = Number(event.detail);
    if (!Number.isFinite(percent) || percent < 100 || percent > 3000) return;
    accelerationSetByWallpaperEngine = true;
    if (accelerationPercent === percent) return;
    accelerationPercent = percent;
    syncTimeScale();
  });
  window.addEventListener('wallpaper-pause-changed', event => {
    paused = Boolean(event.detail);
    previousTime = null;
  });
  resetScene();
  syncTimeScale();
  frameId = requestAnimationFrame(tick);

  if (/^https?:$/.test(window.location.protocol)) {
    fetch('./project.json')
      .then(response => {
        if (!response.ok) throw new Error('Could not load project defaults');
        return response.json();
      })
      .then(project => {
        if (!triggerModeSetByHost) {
          const mode = project.general?.properties?.looptriggermode;
          if (mode) window.wallpaperPropertyListener.applyUserProperties({ looptriggermode: mode });
        }
        if (previewCountdown === null) {
          const countdown = project.general?.properties?.loopcountdown;
          if (countdown) window.wallpaperPropertyListener.applyUserProperties({ loopcountdown: countdown });
        }
        if (!hasAccelerationParam && !accelerationSetByWallpaperEngine) {
          const acceleration = project.general?.properties?.loopacceleration;
          if (acceleration) window.wallpaperPropertyListener.applyUserProperties({ loopacceleration: acceleration });
        }
      })
      .catch(() => {});
  }
})();
