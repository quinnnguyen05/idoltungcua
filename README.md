# Blue Hour — A Tribute to Ju Jingyi

A cinematic, responsive fan tribute website built with React + Vite. Includes the supplied video, soundtrack, and 11 gallery images.

## Features
- Full-screen cinematic video hero with layered gradients and film-grain texture
- Editorial typography, animated marquee, reveal-on-scroll transitions, and slow zoom
- Soundtrack player with progress seeking, volume toggle, mini-player, and animated visualizer
- 11-image responsive gallery with lightbox, keyboard navigation, and captions
- Responsive navigation and reduced-motion support
- GitHub Pages deployment workflow

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Create a GitHub repository and push the full project contents to the `main` branch.
2. In repository Settings → Pages, set **Build and deployment → Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys the site on pushes to `main`.
4. Check the Actions tab for the deployment status and Pages URL.

The Vite base is configured as `./` so local preview and project-page asset paths work without hardcoding a repository name.

## Media
- `public/media/ju-jingyi-film.mp4`: supplied video
- `public/media/blue-hour.mp3`: supplied soundtrack
- `public/media/gallery/`: 11 supplied gallery images

This is an unofficial fan-made tribute. Ensure you have permission to publish any media you use publicly.
