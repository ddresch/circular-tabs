# CLAUDE.md

## Project Overview

**circular-tabs** is a lightweight jQuery GUI plugin that renders an interactive circular tab interface. Users click a "+" button to add tabs (up to 23), which are arranged radially around a central circle. Tabs can be dragged to reorder them, with snapping behavior on release.

- **Author**: Dirk Dresch
- **License**: MIT (2014)
- **Runtime dependency**: jQuery 1.7.2 (loaded from Google CDN)

## Repository Structure

```
circular-tabs/
├── circular-tabs.js    # Plugin logic (109 lines) — tab creation, drag/rotation, swap
├── circular-tabs.css   # Styling — circular layout, hover/selected states, transitions
├── circular-tabs.html  # Standalone demo page — loads jQuery from CDN + local files
├── README.md           # Minimal project description
├── LICENSE             # MIT license
└── CLAUDE.md           # This file
```

This is a **single-page vanilla JS project** with no subdirectories, no build system, and no package manager.

## How to Run

Open `circular-tabs.html` directly in a browser. No build step, no server required. The page loads jQuery 1.7.2 from Google's CDN, so an internet connection is needed.

## Architecture and Key Concepts

### Coordinate System

Tabs are positioned using CSS `transform: rotate(Ndeg)` with `transform-origin: 50% 100%` (bottom-center pivot). The plugin converts between:
- **Screen coordinates** (mouse pageX/pageY) → **polar angle** (Math.atan2) → **CSS degrees** (via `convertThetaToCssDegs`)

Each tab is spaced 15 degrees apart (`(tabIndex + 1) * 15`).

### State Model

- **`tabs` array** — global array of tab objects: `{index, lbl, degree}`
- **DOM data attributes** — each `.circular-tab` element stores `data-degree`, `data-index`, and optionally `data-moveable`
- **`draggedTab`** — global reference to the currently dragged jQuery element
- **`maxTabNum`** — hard limit of 23 tabs

### Key Functions (circular-tabs.js)

| Function | Purpose |
|---|---|
| `addTab()` | Creates a new tab object, appends it to DOM, hides "+" marker at max |
| `createTabView(newTab)` | Builds DOM element, applies rotation, binds mousedown/mousemove/mouseup |
| `rotateAnnotationCropper(offset, x, y, cropper)` | Main drag handler — computes angle from mouse position, triggers tab swap if needed |
| `getTabIndexOfDegree(degree)` | Finds tab within ±4 degrees of a given angle (excluding dragged tab) |
| `rotateTab(tab, cssDegs)` | Applies CSS rotation with vendor prefixes |
| `convertThetaToCssDegs(theta)` | Converts `atan2` angle to CSS rotation: `90 - theta` |

### CSS Classes (circular-tabs.css)

| Selector | Role |
|---|---|
| `#circular-tabs` | 480x480px container, centered |
| `#innerCircle` | 380x380px decorative circle (lightcoral background) |
| `.circular-tab` | Individual tab: 40x220px black bar, rotated from bottom-center |
| `.circular-tab:hover` | Grey background on hover |
| `.circular-tab.selected` | Orange background while dragging |
| `.animate` | 0.25s ease-in CSS transition (removed during drag, re-added on drop) |

### Interaction Flow

1. User clicks "+" (`#marker`) → `addTab()` pushes to array, calls `createTabView()`
2. `createTabView()` creates DOM, rotates to position, binds mouse events
3. On **mousedown**: tab becomes `.selected`, `.animate` removed, z-index raised
4. On **mousemove**: `rotateAnnotationCropper()` calculates angle, swaps tabs if overlapping
5. On **mouseup**: tab snaps to its `data-degree`, `.animate` restored, `.selected` removed

## Development Conventions

### Code Style
- Vanilla JavaScript with jQuery — no modules, no transpilation
- Global functions and variables (no namespace wrapping or IIFE)
- Brace style: opening brace on same line for functions, `if`/`else` blocks
- Single quotes not enforced — mixed usage (primarily single quotes in jQuery selectors)
- `var` declarations (ES3/5 style — no `let`/`const`)
- Console logging present in `getTabIndexOfDegree()` (debug artifact)

### CSS Style
- Vendor prefixes included for all transforms and transitions (`-moz-`, `-webkit-`, `-ms-`, `-o-`)
- No CSS preprocessor — plain CSS
- `user-select: none` with full vendor prefix set to prevent text selection during drag

### No Build/Test/Lint Infrastructure
- No `package.json`, no npm scripts
- No test framework or test files
- No linter or formatter configuration
- No CI/CD pipeline
- No `.gitignore`

## Guidelines for AI Assistants

1. **Keep it simple** — this is a minimal jQuery plugin. Don't introduce build tools, module bundlers, or frameworks unless explicitly asked.
2. **Maintain jQuery patterns** — use jQuery selectors and DOM manipulation consistent with existing code.
3. **Preserve vendor prefixes** — CSS changes should include `-moz-`, `-webkit-`, `-ms-` prefixes where the existing code does.
4. **Global scope** — functions and variables are global. Follow this pattern unless asked to refactor.
5. **Test manually** — no automated tests exist. Open `circular-tabs.html` in a browser to verify changes.
6. **Coordinate math** — understand the polar coordinate conversion before modifying rotation/positioning logic. The CSS degree system differs from standard mathematical angles.
7. **Max tab limit** — the 23-tab limit relates to the 15-degree spacing (23 × 15 = 345°). Changing spacing requires adjusting the limit.
