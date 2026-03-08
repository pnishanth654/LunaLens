# LunaLens Deployment Guide (Vercel + Render Free Tier)

## 1. Backend on Render

1. Push this repo to GitHub.
2. In Render, click `New +` -> `Blueprint` and select this repo.
3. Render will read [`render.yaml`](render.yaml) and create `lunalens-backend`.
4. After first deploy, open the service and set:
   - `FRONTEND_URL=https://<your-vercel-app>.vercel.app`
   - Optional: `CORS_ORIGINS=https://<your-vercel-app>.vercel.app`
5. Copy your backend URL, e.g. `https://lunalens-backend.onrender.com`.

Notes:
- Free tier sleeps when idle.
- SQLite data is ephemeral on free tier. Use Render Postgres for persistent DB.
- Boulder detection requires model weights:
  - `backend/boulder_detection/best.pt`
  - `backend/boulder_detection/vit_model.pth`
  If you don't commit them, set `YOLO_MODEL_URL` and `VIT_MODEL_URL` in Render.

## 2. Frontend on Vercel

1. Import this repo in Vercel.
2. Set `Root Directory` to `frontend/website`.
3. Framework preset: `Vite`.
4. Add environment variable:
   - `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`
5. Deploy.

## 3. Verify

1. Open Vercel app and test login:
   - `isro123 / isro123@2024`
2. Confirm API health:
   - `GET https://<render-backend>.onrender.com/`
3. If login fails, check Render logs and confirm `FRONTEND_URL`/`CORS_ORIGINS`.
