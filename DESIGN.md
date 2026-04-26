---
version: "alpha"
name: "Faraway — Strategic Card Game"
description: "Faraway Strategic Feature Section is designed for highlighting product capabilities and value points. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for component libraries and responsive product interfaces."
colors:
  primary: "#8B6A55"
  secondary: "#5C3822"
  tertiary: "#929852"
  neutral: "#080808"
  background: "#080808"
  surface: "#030303"
  text-primary: "#737373"
  text-secondary: "#FFFFFF"
  border: "#262626"
  accent: "#8B6A55"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "128px"
    fontWeight: 300
    lineHeight: "128px"
    letterSpacing: "-0.05em"
    textTransform: "uppercase"
  body-md:
    fontFamily: "SFMono-Regular"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "1px"
  md: "4px"
  lg: "8px"
  xl: "12px"
  gap: "8px"
  card-padding: "16px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "#171717"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "12px"
  button-link:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "7px"
    padding: "24px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses dark mode with #8B6A55 as the main accent and #080808 as the neutral foundation.

- **Primary (#8B6A55):** Main accent and emphasis color.
- **Secondary (#5C3822):** Supporting accent for secondary emphasis.
- **Tertiary (#929852):** Reserved accent for supporting contrast moments.
- **Neutral (#080808):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #080808; Surface: #030303; Text Primary: #737373; Text Secondary: #FFFFFF; Border: #262626; Accent: #8B6A55

- **Gradients:** bg-gradient-to-tr from-neutral-900/20 to-transparent, bg-gradient-to-t from-[#5C3822]/10 to-transparent

## Typography

Typography pairs Inter for display hierarchy with SFMono-Regular for supporting content and interface copy.

- **Display (`display-lg`):** Inter, 128px, weight 300, line-height 128px, letter-spacing -0.05em, uppercase.
- **Body (`body-md`):** SFMono-Regular, 12px, weight 400, line-height 16px.
- **Labels (`label-md`):** Inter, 14px, weight 400, line-height 20px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Section padding:** 24px, 96px, 112px, 128px
- **Card padding:** 16px, 24px
- **Gaps:** 8px, 12px, 16px, 24px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #262626; 1px #404040; 1px #8B6A55
- **Blur:** 12px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 8px radius. Drive the shell with linear-gradient(to right bottom, rgba(92, 56, 34, 0.4), rgba(46, 58, 47, 0.1)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 4px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 4px, 7px, 8px, 12px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #171717, text #FFFFFF, radius 9999px, padding 12px, border 1px solid rgb(38, 38, 38).
- **Links:** text #737373, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background #080808, border 0px solid rgb(229, 231, 235), radius 7px, padding 24px, shadow none.
- **Card surface:** background #080808, border 0px solid rgb(229, 231, 235), radius 7px, padding 24px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 4px, 7px, 8px, 12px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 150ms and 2000ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes. Scroll choreography uses GSAP ScrollTrigger and Parallax for section reveals and pacing.

**Motion Level:** expressive

**Durations:** 150ms, 2000ms, 700ms, 1000ms, 300ms

**Easings:** ease, cubic-bezier(0.4, 0, 1), 0.2, 0.6

**Hover Patterns:** text, color, opacity

**Scroll Patterns:** gsap-scrolltrigger, parallax

## WebGL

Reconstruct the graphics as a full-bleed background field using webgl, renderer, alpha, antialias, dpr clamp, custom shaders. The effect should read as retro-futurist, technical, and meditative: dot-matrix particle field with green on black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, Renderer, alpha, antialias, DPR clamp, custom shaders

**Techniques:** Dot matrix, Breathing pulse, Pointer parallax, Shader gradients, Noise fields

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Fixed WebGL Background Canvas -->
      <canvas id="bg-canvas" class="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none opacity-40"></canvas>

      <!-- Navigation -->
      ```
  - **JS reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      ```

## ThreeJS

Reconstruct the Three.js layer as a full-bleed background field that feels retro-futurist, volumetric, and technical. Use alpha, antialias, dpr clamp renderer settings, perspective, ~45deg fov, icosahedron geometry, meshstandardmaterial + meshbasicmaterial materials, and ambient + directional lighting. Motion should read as timeline-led reveals, with poster frame + dom fallback.

**Id:** threejs

**Label:** ThreeJS

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Render:**
    - **Value:** alpha, antialias, DPR clamp
  - **Camera:**
    - **Value:** Perspective, ~45deg FOV
  - **Lighting:**
    - **Value:** ambient + directional
  - **Materials:**
    - **Value:** MeshStandardMaterial + MeshBasicMaterial
  - **Geometry:**
    - **Value:** icosahedron
  - **Motion:**
    - **Value:** Timeline-led reveals

**Techniques:** PBR shading, Particle depth, Timeline beats, alpha, antialias, DPR clamp, Poster frame + DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Fixed WebGL Background Canvas -->
      <canvas id="bg-canvas" class="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none opacity-40"></canvas>

      <!-- Navigation -->
      ```
  - **JS reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      ```
