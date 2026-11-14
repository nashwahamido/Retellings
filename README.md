# Retellings

**Where history and literature meet.**

Retellings brings James Joyce's *Dubliners* to life. Open the book to read the lines of each story that name Dublin's streets, bridges and houses. Open any place to learn its past and present, then gather the places you love into a walk of your own, with a map, distances and somewhere to stop for tea.

The site is designed to read like a book: the navigation is its table of contents, and every page shares the same Art Deco style of navy and gold.

- **Website:** [retellingdubliners.com](https://www.retellingdubliners.com/pages/index.html)
- **Origin:** MSc Interactive Digital Media team project, Trinity College Dublin (Jan – Mar 2026), module CS7026
- **This edition:** redesigned by Nashwa Hamido

## Pages

| | Page | File | What's there |
| --- | --- | --- | --- |
| | **The Cover** | `pages/index.html` | The title, a 3D copy of *Dubliners* that opens into the stories, the contents, and plates of Joyce's Dublin |
| I. | **The Preface** | `pages/life-of-joyce.html` | Joyce's life, *Dubliners* and its four stages of life, and further reading |
| II. | **The Places** | `pages/locations.html` | A flip-book of the lines in each story that name a Dublin place. Every place opens in its own window |
| III. | **My Tour** | `pages/walking-tour.html` | Your saved places on a map of Dublin, ready to plan, print or take on your phone |
| IV. | **Colophon** | `pages/about.html` | About this edition, the original team, thanks, and the sources |
| V. | **Sources** | *(a window on every page)* | All 42 references, with a tab for each part of the site and a search field |

`credits.html` redirects to the Colophon and keeps its `#ref-N` links working. `404.html` is the "Erratum" page.

## Features

**The Places**
- A page-turning book (StPageFlip) with a contents page and a chapter menu, plus a plain-text mode that shows one chapter at a time
- Each place mentioned in the text is a label. Clicking it opens a draggable window with its history, a picture, an audio guide where there is one, a Google Maps link and **Add to my tour**

**My Tour**
- Saved places are kept in the browser and stay there between visits
- Reorder stops by dragging them or with the arrows. Distances and walking times appear between stops, and **Best order** finds the shortest walk
- A suggested walk can be added to your own tour without replacing it. Every change can be undone
- **Eat & rest nearby** shows cafés, places to eat, pubs, toilets, water and parks near your stops
- **Take it with you**: print or save a one-page map and itinerary as a PDF, open walking directions in Google Maps, or download KML (for Google My Maps) or GPX (for offline map apps)
- **Navigating Dublin**: a guide to buses, trams, trains, bikes and airport links

## Accessibility

Accessibility was part of the brief from the start, and this edition was checked against WCAG 2.1 AA:

- **Automated check:** axe-core finds no issues on any page, in light or dark mode, on desktop or phone, with windows and the phone menu open
- **Keyboard:** a skip link, visible focus, and real buttons for every control. Windows close with Esc and return focus to where you were. The phone menu keeps focus inside until it closes
- **Screen readers:** semantic landmarks, labelled controls, alt text and captions crediting every image
- **Reading comfort:** sufficient colour contrast throughout, light and dark themes, no italic text, motion reduced for people who ask for it, and a plain-text alternative to the flip-book
- **Further reading:** the written [accessibility plan](https://drive.google.com/file/d/1syxEjJ444AyrSEM038DZxU13RfFEmghK/view?usp=sharing) explains the original design decisions

## Built with

Plain HTML, CSS and JavaScript, with no framework and no build step, hosted on GitHub Pages with a custom domain. The libraries are vendored in `app/js/vendor`, so the site needs nothing from a package manager:

- [three.js](https://threejs.org/) for the 3D books on the Cover and The Places
- [StPageFlip](https://github.com/Nodlik/StPageFlip) for the page turning
- [Leaflet](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/) tiles for the map
- [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) and [Epilogue](https://fonts.google.com/specimen/Epilogue) from Google Fonts

```
pages/              the HTML pages
  assets/           images, the two 3D book models (.glb), the emblem and icons
  audio/            audio guides for the tour stops
app/css/
  variable.css      colour variables for light and dark mode
  global.css        base layout
  deco.css          the Art Deco skin: plates, nav bar, frames, footer
  type.css          the type system: two typefaces, one size per role
  folio.css         the shared "book page" style
  …                 one stylesheet per page or component
app/js/
  book.js           the flip-book on The Places
  book-text.js      the lines of Dubliners shown in the book
  locations-data.js the 60 places (descriptions, images, coordinates)
  loc-windows.js    the draggable windows
  tour-store.js     the saved tour (browser storage)
  tour.js           the My Tour planner and map
  nearby-data.js    eat & rest data from OpenStreetMap
  sources.js        the Sources window
  cover3d.js        the closed book on the Cover; book3d.js is the open book
  script.js         navigation, theme switch, phone menu
CNAME               custom domain
```

## Running locally

Serve the folder with any static server, then open `/pages/index.html`:

```bash
python3 -m http.server 8000
```

Then go to <http://localhost:8000/pages/index.html>. Opening the files directly from disk won't work, because the 3D books and the shared windows need to be served.

## Data and credits

- **Places:** descriptions and pictures are credited in the Colophon and the Sources window. Map positions are approximate.
- **Eat & rest data:** © OpenStreetMap contributors, available under the [Open Database Licence](https://opendatacommons.org/licenses/odbl/), from a snapshot taken on 13 November 2026.
- **Map tiles:** © OpenStreetMap contributors.
- **Libraries:** three.js (MIT), StPageFlip (MIT) and Leaflet (BSD-2-Clause) are used under their licences.

## Team

The original site was made by:

| Name | Role |
| --- | --- |
| Emma Sun | Wireframer, copywriter, illustrator, front-end developer |
| Ge You | Interface designer, image editor, front-end developer |
| Logan Dulski | Project manager, logo designer, audio editor, front-end developer |
| Nashwa Hamido | Accessibility reviewer, logo designer, front-end developer |
| Yayi Liu | Photographer, copywriter, front-end developer |

This edition (the book structure, The Places, My Tour, and the new look and emblem) was redesigned by **Nashwa Hamido**.

With thanks to Cathal O'Connor, Ren Paul and Maiyse Abuleil.

Created for academic purposes as part of the MSc in Interactive Digital Media at Trinity College Dublin.
