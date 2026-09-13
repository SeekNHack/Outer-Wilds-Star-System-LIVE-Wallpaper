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

## Wallpaper Engine settings

The first column identifies the corresponding option in Wallpaper Engine.

| Setting | Default | Range or choices | What it does |
| --- | --- | --- | --- |
| **Background · color** | `#030405` | Any color | Changes the background color. |
| **Star density (%)** | `100%` | `0–300%` | Sets the number of moving stars relative to the screen area. At `100%`, there are about 220 stars per million screen pixels; `0%` hides them. |
| **Background · colored stars** | On | On / off | Switches between mixed white, blue, yellow, and orange stars and an all-white starfield. |
| **Orbits · appearance** | Full orbit | Full orbit, Fading trail, Hidden | Shows complete paths, fading trails, or no paths. Celestial bodies keep moving when paths are hidden. |
| **Orbits · opacity (%)** | `36%` | `0–100%` | Controls the visibility of orbit paths and trails. |
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
| **Loop · show countdown** | On | On / off | Shows the time until the finale starts above the bottom-right edge, clear of the Windows taskbar. It stays still while Wallpaper Engine pauses the wallpaper and is hidden when the loop is off or the finale begins. |
| **Loop · speed (%)** | `100%` | `100–3000%` | Sets the playback speed of the loop, orbits, and other motion. `100%` is normal speed; about `2243%` compresses a 22-minute story and its finale to one real minute. Use `?loopacceleration=2243` in a browser preview. |

The small white body with a red glow circles outside the largest planetary orbit. Its dashed path appears only while the pointer is over the body and follows the configured orbit opacity, including when other orbit paths are hidden.

### Timeline by countdown at a 22-minute duration

The first column shows **time remaining**, as displayed by the countdown, from 22:00 down to 0:00. Story milestones scale proportionally when the loop duration changes. The Sun Station's descent begins at 10:30 on this countdown and lasts five seconds regardless of loop duration.

| Countdown | Event in the wallpaper |
| --- | --- |
| 22:00 | The loop and countdown begin. On the first cycle, the Orbital Probe Cannon fires immediately with a yellow-orange explosion and sends a glowing probe in a random direction. |
| About 21:58 | On later cycles, the cannon fires just after the scene fades back in. |
| About 21:00 | The probe begins fading after one minute of flight, or about 20:58 on later cycles. |
| 20:00 | Sand starts flowing between the Hourglass Twins. |
| 16:45 | Sun Station warp pad becomes accessible in the story; no separate warp effect is shown. |
| 15:20 | The Stranger opens its sails, shown by a brighter glow. |
| 14:10 | Ash Twin warp pad becomes accessible in the story; no separate warp effect is shown. |
| 10:30 | The Sun Station starts spiraling inward while continuing to orbit the Sun. |
| 10:25 | The Sun Station finishes entering the Sun and has faded away. |
| 9:00 | The Stranger's dam breaks, marked by a slight brightening. |
| 2:00 | The Interloper can be swallowed from this point, when its icy head first enters the visible Sun. It then fades out. |
| 1:42 | The sand flow begins its 1.5-second fade-out. |
| 1:40 | The sand flow has completely stopped. |
| 1:30 | The Stranger tilts as the Island Tower falls. |
| 1:25 | End Times begins; the stars have fully disappeared. |
| 0:00 | The countdown reaches zero and the red Sun begins to collapse and turn blue. |

The countdown hides at 0:00. The 26-second finale continues afterward:

| Time after zero | Event in the wallpaper |
| --- | --- |
| +5s | The Sun reaches its smallest size and holds for about 0.2 seconds. |
| +5.2s | The blue Sun begins expanding; The Stranger is fully hidden, and shockwaves and short-lived blue and white sparks launch immediately. |
| +23.4s | The expanding Sun and scene begin fading to black. |
| +26s | The loop resets; the scene fades back in over 1.8 seconds. |


## How the Quantum Moon moves

The Quantum Moon starts near a randomly selected planet. It can move to another planet or a sixth empty location in three ways:

1. The mouse reaches the Moon when it is visible.
2. The configured timer elapses, if **Quantum Moon · timed shifting** is on.
3. Wallpaper Engine pauses the wallpaper, even if timed shifting is off. The Moon changes planet immediately, so it is already in its new position when playback resumes.

The timer stops while the wallpaper is paused and starts a fresh interval when it resumes. Whether Wallpaper Engine pauses the wallpaper depends on its playback settings; a window covering only part of the wallpaper does not necessarily trigger a pause.
