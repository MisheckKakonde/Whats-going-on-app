# LocalPulse

Local event discovery and hangout coordinator prototype.

## GitHub Pages Deployment

The 404 error (`/src/main.tsx not found`) occurs when GitHub Pages serves the raw uncompiled repository root instead of the compiled production bundle (`dist/`).

### How to deploy:

#### Option 1: Automated Deployment via GitHub Actions (Recommended)
1. Go to your GitHub repository.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push your commits to `main` (or go to the **Actions** tab and trigger the "Deploy to GitHub Pages" workflow).
5. GitHub will automatically run `npm run build` and deploy the output to `https://misheckkakonde.github.io/<repository-name>/`.

#### Option 2: Deploy using `gh-pages` branch
If you prefer running deployment from your local terminal:
```bash
npm run deploy
```
Then in GitHub repository **Settings** > **Pages**, set **Source** to `Deploy from a branch` and choose `gh-pages` / `/(root)`.
