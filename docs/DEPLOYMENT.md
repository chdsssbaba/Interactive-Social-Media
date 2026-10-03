# Render Deployment Guide

This guide provides step-by-step instructions for deploying SphereFeed as a **Static Site** on [Render](https://render.com).

---

## ⚙️ Service Configuration

| Setting | Value |
| :--- | :--- |
| **Service Type** | Static Site |
| **Name** | `spherefeed` (or your preferred name) |
| **Repository** | `https://github.com/chdsssbaba/build-an-interactive-social-media-feed-with-react-and-intersection-observer` |
| **Branch** | `main` |
| **Root Directory** | `.` (Leave empty / project root) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

---

## 🔑 Environment Variables

Under the **Environment** tab in your Render dashboard, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://jsonplaceholder.typicode.com` | Base URL for REST API endpoints |

---

## 🚀 Deployment Steps

1. **Push to GitHub**:
   Ensure all code is committed and pushed to your GitHub repository.
   ```bash
   git push origin main
   ```

2. **Create New Static Site on Render**:
   - Log into [Render Dashboard](https://dashboard.render.com).
   - Click **New +** and select **Static Site**.
   - Connect your GitHub repository.

3. **Configure Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Rewrite Rule (Single Page Application)**:
   In your Render service settings under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

5. **Deploy**:
   - Click **Create Static Site**.
   - Render will automatically trigger the build pipeline, install packages, compile the Vite production bundle, and publish the static assets.

---

## 🛠️ Troubleshooting Common Issues

### 1. Build Fails on Missing Dependency
Ensure `package.json` contains all dependencies in `dependencies` rather than local developer packages. Vite and React must be installed.

### 2. Assets 404 on Refresh
Ensure the SPA Rewrite Rule (`/*` -> `/index.html`) is active in Render's Redirects/Rewrites tab.

### 3. API Requests Blocked by Mixed Content
JSONPlaceholder uses HTTPS (`https://jsonplaceholder.typicode.com`). Ensure `VITE_API_BASE_URL` is configured with `https://`.
