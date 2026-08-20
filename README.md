# TGF ASSOCIATION — Rampuram (Softwarebois Reimagined)

A festival community archive and website celebrating Ganesh Chaturthi in Rampuram, Pendurthi (Visakhapatnam) with annual idol galleries, Nimarjanam memories, Laddu auction ledger, youth gang, donations via UPI, and visitor comments.

---

## 🚀 How to Upload to GitHub & Make It Live

### Option 1: GitHub Pages (Automatic with GitHub Actions)

1. **Create a new repository on GitHub:**
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `tgf-association` or `softwarebois-reimagined`).
   - Set visibility to **Public** (recommended for free GitHub Pages).
   - Click **Create repository**.

2. **Upload your code to GitHub:**
   - Using Git in your terminal/command prompt:
     ```bash
     cd "C:\Users\abhifrooti\Downloads\softwarebois-reimagined (1)"
     git init
     git add .
     git commit -m "Initial commit of TGF Association"
     git branch -M main
     git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
     git push -u origin main
     ```
   - Or using **GitHub Desktop** / dragging files into GitHub web.

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub.
   - Click **Settings** ⚙️ → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - The included workflow `.github/workflows/deploy.yml` will automatically build and publish your site!
   - Your live URL will be: `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

---

### Option 2: Deploy to Vercel (Fastest & 1-Click Free)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
5. Click **Deploy**. Your site will be live instantly on a free `.vercel.app` URL with SSL!

---

### Option 3: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Select your repository.
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
5. Click **Deploy Site**.

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready static bundle will be built to `dist/public`.

4. **Full-stack local server:**
   ```bash
   npm run dev:server
   ```

---

## 📁 Project Structure

- `client/` - React 19 frontend with Tailwind CSS, Lucide icons, and Radix UI components
  - `client/public/assets/` - SVG & image assets for festival idols, hero artwork, and logos
  - `client/src/pages/Home.tsx` - Main TGF Association festival archive page
  - `client/src/pages/CommentsAdmin.tsx` - Comments moderation dashboard
- `server/` - Express + tRPC backend API server
- `shared/` - Shared constants, error handlers, and TypeScript types
- `drizzle/` - Database schemas and migrations for visitor comments and users
- `.github/workflows/deploy.yml` - Automated GitHub Pages build & deployment workflow