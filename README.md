# Retellings

**Where history and literature meet.**

Retellings is an accessible website that brings James Joyce's *Dubliners* to life. It traces the places in the stories through a walking tour and a map of locations, alongside Joyce's life and the history behind the city.

- **Website:** [retellingdubliners.com](https://www.retellingdubliners.com/pages/index.html)
- **Project:** MSc Interactive Digital Media team project, Trinity College Dublin (Jan – Mar 2026), module CS7026

## Pages

| Page | Content |
| --- | --- |
| Home | Introduction to Joyce and his Dublin, with an image gallery |
| Life of James Joyce | Joyce's life and work |
| Dubliner's Walking Tour | A walking route through the stories' locations, with audio |
| Dubliner's Locations | Filterable location cards, past and present |
| About Us | The team and the project's accessibility plan |
| Credits & Sources | Every reference and image credit, linked from the text |

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
