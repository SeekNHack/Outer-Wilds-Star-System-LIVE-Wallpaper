# Outer Wilds Solar System Wallpaper

An animated web wallpaper inspired by the solar system of *Outer Wilds*. It features orbiting planets and moons, the Interloper, the Quantum Moon, The Stranger passing in front of the slowly rotating Sun, a live clock, and an optional supernova loop.

## Highlights

- The Interloper faces the Sun and speeds up as it approaches. The White Hole Station faces the Sun too.
- Hover over the Quantum Moon to move it to another planet. It can also vanish into a sixth, empty location, shift automatically at a configurable interval, or move when Wallpaper Engine pauses the wallpaper.
- Moving stars come in different sizes and shades of white, blue, yellow, and orange. Their density and colors are configurable.
- A small white satellite with a red glow orbits beyond the outermost planet. Hover over it to reveal its dashed orbit.
- At the start of each loop, the Orbital Probe Cannon fires a glowing probe in a new random direction. The probe travels for one loop minute before fading.
- The optional loop follows a configurable version of the 22-minute timeline: sand flows between the twins, the Sun reddens and grows, the Interloper can be swallowed, the stars fade, and the Sun collapses and explodes before the scene restarts.
- Show or hide the loop countdown. Set **Loop · speed (%)** to `100%` for normal playback or raise it to accelerate the entire loop, including orbital motion, without changing the story's timing relative to the planets.

## Getting started

Load `index.html` as a web wallpaper in Wallpaper Engine. Keep `project.json`, `solar.css`, `starfield.js`, `orbit-paths.js`, `wallpaper-settings.js`, `explosion-particles.js`, `loop.js`, and the `assets/` directory alongside it. The settings below are defined in `project.json` and appear in Wallpaper Engine's wallpaper properties panel. When previewing through a local HTTP server, the loop duration, countdown, and speed are read from `project.json`. A direct file preview defaults to a 22-minute story at normal speed, with the countdown visible; use `?loopacceleration=2243` to play the full loop in about one real minute, `?loopminutes=1` to change the story duration to one minute, or `?loopcountdown=0` to hide the timer. Browsers cannot read the adjacent JSON file automatically when opening `index.html` directly.

## Wallpaper Engine settings

The first column identifies the corresponding option in Wallpaper Engine.

| Setting | Default | Range or choices | What it does |
| --- | --- | --- | --- |
| **Background · color** | `#030405` | Any color | Changes the background color. |
| **Star density (%)** | `100%` | `0–300%` | Sets the number of moving stars relative to the screen area. At `100%`, there are about 220 stars per million screen pixels; `0%` hides them. |
| **Background · colored stars** | On | On / off | Switches between mixed white, blue, yellow, and orange stars and an all-white starfield. |
| **Orbits · appearance** | Full orbit | Full orbit, Fading trail, Hidden | Shows complete paths, fading trails, or no paths. Celestial bodies keep moving when paths are hidden. |
| **Orbits · opacity (%)** | `36%` | `0–100%` | Controls the visibility of orbit paths and trails. |

The small white body with a red glow circles outside the largest planetary orbit. Its dashed path appears only while the pointer is over the body and follows the configured orbit opacity, including when other orbit paths are hidden.
| **Motion · overall speed (%)** | `100%` | `25–300%` | Changes the speed of orbiting bodies, the Interloper, and The Stranger. It does not change the Quantum Moon's timer interval. |
| **Size · entire star system (%)** | `82%` | `50–150%` | Scales the whole star system. |
| **Clock · font size (px)** | `42px` | `24–100px` | Changes the clock's font size. |
| **Clock · top** | `2.5%` | CSS position, such as `30px` | Sets the clock's distance from the top edge. |
| **Clock · left** | `50%` | CSS position, such as `300px` | Positions the clock by its horizontal center; `50%` centers it on screen. |
| **The Stranger · show** | On | On / off | Shows or hides The Stranger and its eclipse of the Sun. |
| **The Stranger · speed (%)** | `50%` | `10–200%` | Sets The Stranger's speed relative to the overall speed. At `100%` overall speed, `50%` makes one orbit take about 120 seconds instead of 60. This setting appears only when The Stranger is shown. |
| **Quantum Moon · timed shifting** | On | On / off | Enables or disables only the Moon's periodic shifts. |
| **Quantum Moon · seconds between shifts** | `30s` | `1–120s` | Sets the interval between periodic shifts. This setting appears only when timed shifting is on. |
| **Loop** | On | On / off | Recreates a timed stellar collapse and supernova sequence. Off keeps the wallpaper's continuous animation. |
| **Loop · duration (minutes)** | `22 min` | `1–60 min` | Scales every story timestamp proportionally. This setting appears only when the loop is on. |
| **Loop · show countdown** | On | On / off | Shows the time until the finale starts in the bottom-right corner, using a smaller version of the clock font. It stays still while Wallpaper Engine pauses the wallpaper and is hidden when the loop is off or the finale begins. |
| **Loop · speed (%)** | `100%` | `100–3000%` | Sets the playback speed of the loop, orbits, and other motion. `100%` is normal speed; about `2243%` compresses a 22-minute story and its finale to one real minute. Use `?loopacceleration=2243` in a browser preview. |

## Optional loop

The loop starts when enabled. The Sun slowly grows by at most 35% and reddens, while stars gradually fade until the sky is empty at End Times. The Stranger's eclipse mask follows the Sun's size and closes as the Sun turns blue. At 11:30 in a 22-minute loop, the Sun Station begins spiraling inward and fades as it enters the Sun. When the configured duration expires, that same Sun begins a 26-second finale: it collapses over five seconds, holds its tiny blue remnant for about 0.2 seconds, then expands for about 20 seconds at a constant speed. Faint shockwaves accompany the expansion. The planets, orbit paths, and clock fade away behind it. As the Sun fades, the whole wallpaper turns black before the next cycle fades in over 1.8 seconds. Wallpaper Engine pauses the loop clock when it pauses the wallpaper. Changing the duration keeps the current percentage of the story or the current point in the finale. Turning the loop off immediately resets the Sun and scene to their normal appearance; turning it back on starts a new loop from zero.

### Timeline at a 22-minute duration

Times below are elapsed time from the start of a loop. At a 22-minute setting, the story milestones keep their exact timestamps and the finale begins at 22:00. Its 26-second animation runs after the configured time. Other durations scale story milestones proportionally; in a one-minute test, the Interloper can be swallowed from about 0:55 and the finale begins at 1:00.

The Sun Station's fall starts at the scaled story time and lasts five seconds: around 5:14 in a 10-minute loop or 11:30 in a 22-minute loop.

| Time | Event in the wallpaper |
| --- | --- |
| 0:00 | The Orbital Probe Cannon fires with a brief yellow-orange explosion; its glowing probe travels in a random direction chosen for this loop. |
| 1:00 | The probe begins fading after one minute of flight. |
| 2:00 | Sand starts flowing between the Hourglass Twins. |
| 5:15 | Sun Station warp pad becomes accessible in the story; no separate warp effect is shown. |
| 6:40 | The Stranger opens its sails, shown by a brighter glow. |
| 7:50 | Ash Twin warp pad becomes accessible in the story; no separate warp effect is shown. |
| 11:30 | The Sun Station starts spiraling inward while continuing to orbit the Sun. |
| 11:35 | The Sun Station finishes entering the Sun and has faded away. |
| 13:00 | The Stranger's dam breaks, marked by a slight brightening. |
| 20:00 | The Interloper can be swallowed from this point, when its icy head first enters the visible Sun. It then fades out. |
| 20:18.5 | The sand flow begins its 1.5-second fade-out. |
| 20:20 | The sand flow has completely stopped. |
| 20:30 | The Stranger tilts as the Island Tower falls. |
| 20:35 | End Times begins; the stars have fully disappeared. |
| 22:00 | The countdown reaches zero and the red Sun begins to collapse and turn blue. |
| 22:05 | The Sun reaches its smallest size and holds for about 0.2 seconds. |
| 22:05.2 | The blue Sun begins expanding; The Stranger is fully hidden, and shockwaves and short-lived blue and white sparks launch immediately. |
| 22:23.4 | The expanding Sun and scene begin fading to black. |
| 22:26 | The loop resets; the scene fades back in over 1.8 seconds. |

The wallpaper has no bundled *End Times* audio track, warp pad sprites, or separate dam and tower sprites. Their timeline events use the visual cues above.

## How the Quantum Moon moves

The Quantum Moon starts near a randomly selected planet. It can move to another planet or a sixth empty location in three ways:

1. The mouse reaches the Moon when it is visible.
2. The configured timer elapses, if **Quantum Moon · timed shifting** is on.
3. Wallpaper Engine pauses the wallpaper, even if timed shifting is off. The Moon changes planet immediately, so it is already in its new position when playback resumes.

The timer stops while the wallpaper is paused and starts a fresh interval when it resumes. Whether Wallpaper Engine pauses the wallpaper depends on its playback settings; a window covering only part of the wallpaper does not necessarily trigger a pause.

## Updating an existing Wallpaper Engine project

Wallpaper Engine uses its own copy of imported web wallpaper files. Make sure the project's `project.json` and `starfield.js` are both in that copy, then choose **File → Apply Wallpaper** in the editor. The **Star density (%)** slider should appear at the top of the wallpaper properties in the **Installed** tab. If the list still shows an older version, restart Wallpaper Engine's interface and reselect the wallpaper. The density control now has a fresh property key, so an older saved density value may need to be set again. Updating this repository alone does not update an installed Workshop copy; that copy needs a published wallpaper update.
