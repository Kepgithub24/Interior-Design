# CLAUDE.md

Static site: `index.html`, `style.css`, `script.js` only. No build step. Preview: `open index.html`.

## Architecture

**Theming** — CSS vars in `:root` (light) and `[data-theme="dark"]` (dark). `data-theme` on `<html>`, toggled by JS, persisted in `localStorage` key `lumiere-theme`. Never hardcode colours; always use `var(--*)`.

**Scroll animations** — Add class `fade-in` to any element. `IntersectionObserver` adds `.visible` to trigger the CSS transition.

**Portfolio filter** — Items: `data-category="<slug>"` (`living-room`, `bedroom`, `office`, `kitchen`). Buttons: `data-filter="<slug>"` (+ `all`). JS toggles `.hidden`. New category = new button + matching attribute; no JS changes needed.

**Lightbox** — Triggered by click on `.portfolio-item`. Large image: replace `w=600` → `w=1200` in Unsplash src. Title from `.portfolio-overlay h3`.

**Carousel** — `.testimonial-card` + `.active` = visible. Autoplay 5500 ms, pauses on `mouseenter` of `.carousel-wrapper`. Dot count must match card count (both static HTML).

**Form** — `fetch()` POST to `https://formsubmit.co/ajax/bwongzh@gmail.com` as JSON. Validation on blur + submit. Field IDs `name`, `email`, `phone`, `message` must match `rules` object in `script.js`.
