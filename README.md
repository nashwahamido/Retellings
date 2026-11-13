# Retellings

**Where history and literature meet.**

Retellings is an accessible website that brings James Joyce's *Dubliners* to life. It traces the places in the stories through a walking tour and a map of locations, alongside Joyce's life and the history behind the city.

- **Website:** [retellingdubliners.com](https://www.retellingdubliners.com/pages/index.html)
- **Project:** MSc Interactive Digital Media team project, Trinity College Dublin (Jan – Mar 2026), module CS7026

## Pages

The site reads like a book, and the navigation is its table of contents.

| Page | File | Content |
| --- | --- | --- |
| The Cover | `pages/index.html` | Title, the 3D book as the way in, the contents, and plates of Joyce's Dublin |
| I. The Preface | `pages/life-of-joyce.html` | Joyce's life, *Dubliners*, and further reading |
| II. The Book | `pages/locations.html` | An interactive book: each story's lines naming Dublin places, with windows for every place |
| III. My Tour | `pages/walking-tour.html` | Saved places on a map: reorder, best order, distances, eat & rest stops, a suggested walk |
| IV. Colophon | `pages/about.html` | The edition, the original team, thanks, and every source (`credits.html` redirects here) |

## Accessibility

Accessibility was part of the design from the start:

- light and dark mode, using a separate colour-variable stylesheet
- semantic page landmarks (header, navigation, main content, footer)
- alt text on images, and captions crediting their sources
- a written accessibility plan explaining the design decisions

## Built with

Plain HTML, CSS and JavaScript, with no framework or build step. It's hosted on GitHub Pages with a custom domain.

```
pages/      HTML pages, plus images and audio in pages/assets and pages/audio
app/css/    a global stylesheet, colour variables and one stylesheet per page
app/js/     interactions: location filters, "load more" galleries, quotes, theme toggle
index.html  redirects the site root to pages/index.html
CNAME       custom domain
```

## Running locally

Serve the folder with any static server and open `/pages/index.html`:

```bash
python3 -m http.server 8000
```

## Team

| Name | Role |
| --- | --- |
| Nashwa Hamido | Accessibility reviewer, logo designer, front-end developer |
| Emma Sun | Wireframer, copywriter, illustrator, front-end developer |
| Ge You | Interface designer, image editor, front-end developer |
| Logan Dulski | Project manager, logo designer, audio editor, front-end developer |
| Yayi Liu | Photographer, copywriter, front-end developer |

Created for academic purposes as part of the MSc in Interactive Digital Media at Trinity College Dublin.
