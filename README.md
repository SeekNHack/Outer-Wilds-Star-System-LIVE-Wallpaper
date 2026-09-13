# Outer Wilds Solar System Wallpaper

An animated web wallpaper inspired by the solar system of *Outer Wilds*. It features orbiting planets and moons, the Interloper, the Quantum Moon, The Stranger passing in front of the slowly rotating Sun, and a live clock.

## Getting started

Load `index.html` as a web wallpaper in Wallpaper Engine. Keep `project.json`, `solar.css`, `starfield.js`, `wallpaper-settings.js`, and the `assets/` directory alongside it. The settings below are defined in `project.json` and appear in Wallpaper Engine's wallpaper properties panel.

## Wallpaper Engine settings

The first column identifies the corresponding option in Wallpaper Engine.

| Setting | Default | Range or choices | What it does |
| --- | --- | --- | --- |
| **Background · color** | `#030405` | Any color | Changes the background color. |
| **Background · star density (%)** | `100%` | `0–300%` | Sets the number of moving stars relative to the screen area. At `100%`, there are about 220 stars per million screen pixels; `0%` hides them. |
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

## How the Quantum Moon moves

The Quantum Moon starts near a randomly selected planet. It can move to another planet in three ways:

1. The mouse reaches the Moon.
2. The configured timer elapses, if **Quantum Moon · timed shifting** is on.
3. Wallpaper Engine pauses the wallpaper, even if timed shifting is off. The Moon changes planet immediately, so it is already in its new position when playback resumes.

The timer stops while the wallpaper is paused and starts a fresh interval when it resumes. Whether Wallpaper Engine pauses the wallpaper depends on its playback settings; a window covering only part of the wallpaper does not necessarily trigger a pause.
