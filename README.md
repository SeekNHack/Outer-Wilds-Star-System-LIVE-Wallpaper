# Outer Wilds Solar System Wallpaper

An animated web wallpaper inspired by the solar system of *Outer Wilds*.

## Highlights

- Hover over the Quantum Moon to move it to another planet. It can also vanish into a sixth, empty location, shift automatically at a configurable interval, or move when the wallpaper host pauses the wallpaper.
- Moving stars come in different sizes and shades of white, blue, yellow, and orange. Their density and colors are configurable.
- At the start of each loop, the Orbital Probe Cannon aims in a new random direction, stays intact briefly, then breaks as it fires a glowing probe. Both cannon images keep facing the shot as they orbit.
- Timber Hearth, Brittle Hollow, Giant's Deep, and Dark Bramble rotate slowly as they orbit.
- Hollow's Lantern launches its first meteorite toward Brittle Hollow 15 seconds into a 22-minute loop, or about 45 seconds after the hour in hourly mode. After five impacts, Brittle Hollow reveals its hole until the next loop. Later launches average about one per minute, rising to about three per minute near the end; some arrive in pairs. They can be switched off.
- Red lightning briefly lights up different parts of Giant's Deep about eight times per minute, even when the loop is off. It can be switched off separately.
- The game's 22-minute sequence can run at its usual length or scale proportionally across a 60-minute hourly cycle.

## Wallpaper Engine and Lively settings

Both Wallpaper Engine and Lively expose the settings below. The first column names the option in either app. In Lively, right-click the wallpaper in the library and select **Customise**. Lively shows dependent controls even when their parent toggle is off; their descriptions say when they apply.

| Setting | Default | Range or choices | What it does |
| --- | --- | --- | --- |
| **Background · color** | `#030405` | Any color | Changes the background color. |
| **Star density (%)** | `200%` | `0–300%` | Sets the number of moving stars relative to the screen area. At `100%`, there are about 220 stars per million screen pixels; `0%` hides them. |
| **Background · colored stars** | On | On / off | Switches between mixed white, blue, yellow, and orange stars and an all-white starfield. |
| **Orbits · appearance** | Full orbit | Full orbit, Fading trail, Hidden | Shows complete paths, fading trails, or no paths. Celestial bodies keep moving when paths are hidden. |
| **Orbits · opacity (%)** | `36%` | `0–100%` | Controls the visibility of orbit paths and trails. |
| **Motion · overall speed (%)** | `100%` | `25–300%` | Changes the speed of orbiting bodies, the Interloper, and The Stranger. It does not change the Quantum Moon's timer interval. |
| **Size · entire star system (%)** | `82%` | `50–150%` | Scales the whole star system. |
| **Clock · font size (px)** | `42px` | `24–100px` | Changes the clock's font size. |
| **Clock · top** | `2.5%` | CSS position, such as `30px` | Sets the clock's distance from the top edge. |
| **Clock · left** | `50%` | CSS position, such as `300px` | Positions the clock by its horizontal center; `50%` centers it on screen. |
| **The Stranger · show** | On | On / off | Shows The Stranger and its eclipse. Off hides both the image and shadow. |
| **The Stranger · shadow only** | Off | On / off | Hides The Stranger's PNG while keeping its moving shadow and eclipse. Available when **The Stranger · show** is on. |
| **The Stranger · speed (%)** | `50%` | `10–200%` | Sets The Stranger's speed relative to the overall speed. At `100%` overall speed, `50%` makes one orbit take about 120 seconds instead of 60. This setting appears only when The Stranger is shown. |
| **Quantum Moon · timed shifting** | On | On / off | Enables or disables only the Moon's periodic shifts. |
| **Quantum Moon · seconds between shifts** | `30s` | `1–120s` | Sets the interval between periodic shifts. This setting appears only when timed shifting is on. |
| **Loop** | On | On / off | Recreates a timed stellar collapse and supernova sequence. Off keeps the wallpaper's continuous animation. |
| **Loop · supernova trigger** | After 22 minutes | After 22 minutes, At the exact hour | Chooses a repeating 22-minute timer or a 60-minute story whose supernova begins at every local full hour (`HH:00`). Opening the wallpaper partway through an hour initializes the scene at that point in the story. |
| **Loop · show countdown** | On | On / off | Shows the time until the finale starts above the bottom-right edge, clear of the Windows taskbar. Hourly mode counts down to the next full hour. It stays still while the wallpaper host pauses the wallpaper and is hidden when the loop is off or the finale begins. |
| **Loop · speed (%)** | `100%` | `100–3000%` | In 22-minute timer mode, sets the playback speed of the loop, orbits, and other motion. `100%` is normal speed; about `2243%` compresses a 22-minute story and its finale to one real minute. Use `?loopacceleration=2243` in a browser preview. Hourly mode follows the clock and ignores this setting. |
| **Loop · Hollow's Lantern meteorites** | On | On / off | Enables the meteorites that hit Brittle Hollow while the loop runs. They average about one per minute until the final five minutes in timer mode or the final `13:38` in hourly mode, then about three per minute. |
| **Giant's Deep · red lightning** | On | On / off | Enables brief red lightning inside Giant's Deep, averaging eight flashes per real minute. |

### Install in Lively Wallpaper

Add `index.html` as a local web wallpaper in Lively. Lively creates its own `LivelyInfo.json` in the imported wallpaper's library folder; this project does not include one. `LivelyProperties.json` creates the **Customise** controls, and Lively saves their values per display. The Wallpaper Engine project and Workshop ID remain separate in `project.json`.

To make the Quantum Moon shift when Lively pauses the wallpaper, set `"Arguments": "--pause-event true"` in the `LivelyInfo.json` generated for that imported wallpaper, then reload it. Lively sends pause events only when this argument is enabled; the other settings work without it.

If you change a default in `LivelyProperties.json` after importing, use **Restore Default** in Lively's Customise menu to replace Lively's saved copy. Opening `index.html` directly in a browser does not provide Lively's settings or pause events; use a local HTTP server for browser preview.

### Timeline by countdown

The table below shows the 22-minute timer mode. **At the exact hour** scales story milestones across 60 minutes, from one full hour to the next. For example, sand starts about `54:33` before the next hour, the Sun Station begins falling at `28:38`, the Interloper is armed at `5:27` and enters the Sun at about `5:25`, and the last stars vanish at `2:44`. If the wallpaper opens halfway through the hour, these milestones and the countdown are calculated immediately from the current local time. The 26-second supernova finale still begins exactly at `HH:00`.

| Countdown | Event in the wallpaper |
| --- | --- |
| 22:00 | The loop and countdown begin with the Orbital Probe Cannon intact. |
| 21:59 | On the first cycle, the cannon breaks, explodes and launches a glowing probe together after one second. |
| About 21:57 | On later cycles, the cannon breaks and fires after the scene fades back in. |
| 21:45 | Hollow's Lantern launches its first meteorite toward Brittle Hollow. |
| About 20:59 | The probe begins fading after one minute of flight, or about 20:57 on later cycles. |
| 20:00 | Sand starts flowing between the Hourglass Twins; Ash Twin gradually empties and Ember Twin fills. |
| 15:20 | The Stranger becomes brighter. |
| 10:30 | The Sun Station starts spiraling inward while continuing to orbit the Sun. |
| 10:25 | The Sun Station finishes entering the Sun and has faded away. |
| 9:00 | The Stranger brightens again. |
| 5:00 | Hollow's Lantern's meteorites become more frequent, rising from about one to about three per minute. |
| 2:00 | The Interloper can be swallowed once its icy head enters the visible Sun. |
| About 1:59 | At the default motion speed, the Interloper reaches the Sun and fades out. Changing the overall motion speed can shift this crossing. |
| 1:42 | The sand flow begins its 1.5-second fade-out. |
| 1:40 | The sand flow has completely stopped and both twins show their final appearance. |
| 1:30 | The Stranger tilts. |
| 1:00 | The last stars disappear completely. |
| 0:00 | The countdown reaches zero and the red Sun begins to collapse and turn blue. |

In hourly mode, the same events occur at these local clock times (rounded to the nearest second):

| Clock time | Countdown | Event |
| --- | --- | --- |
| `HH:00:29` | 59:31 | The cannon breaks and fires after the previous supernova and scene fade. |
| `HH:00:45` | 59:15 | Hollow's Lantern launches its first meteorite. |
| `HH:05:27` | 54:33 | Sand begins flowing. |
| `HH:18:11` | 41:49 | The Stranger brightens. |
| `HH:31:22` | 28:38 | The Sun Station begins its fall. |
| `HH:31:35` | 28:25 | The Sun Station has faded into the Sun. |
| `HH:46:22` | 13:38 | Meteorites become more frequent. |
| `HH:54:33` | 5:27 | The Interloper can be swallowed by the growing Sun. |
| About `HH:54:35` | About 5:25 | The Interloper reaches the Sun and fades out with its orbit. |
| `HH:55:27` | 4:33 | Sand stops flowing. |
| `HH:57:16` | 2:44 | The last stars disappear. |
| Next `HH:00:00` | 0:00 | The supernova finale begins. |


## How the Quantum Moon moves

The Quantum Moon starts near a randomly selected planet. It can move to another planet or a sixth empty location in three ways:

1. The mouse reaches the Moon when it is visible.
2. The configured timer elapses, if **Quantum Moon · timed shifting** is on.
3. Wallpaper Engine or Lively pauses the wallpaper, even if timed shifting is off. In Lively, this requires the `--pause-event true` argument described above. The Moon changes planet immediately, so it is already in its new position when playback resumes.

The timer stops while the wallpaper is paused and starts a fresh interval when it resumes. Whether the host pauses the wallpaper depends on its playback settings; a window covering only part of the wallpaper does not necessarily trigger a pause.
