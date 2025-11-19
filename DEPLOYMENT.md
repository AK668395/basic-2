# 🚀 Deploy Your StyleSage AI App

## Quick Deploy to Vercel (Frontend + API)

1. **Go to Vercel:** https://vercel.com
2. **Click "New Project"**
3. **Import your GitHub repo:** `AK668395/basic-2`
4. **Vercel will auto-detect Next.js**
5. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
   DATABASE_URL=your_postgres_db_url
   REDIS_URL=your_redis_url
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_key
   ```

## Backend API Deployment (Railway)

1. **Go to Railway:** https://railway.app
2. **Connect your GitHub repo**
3. **Set environment variables** (same as above)
4. **Deploy** - Railway will handle everything

## Alternative: Netlify (Frontend Only)

1. **Go to Netlify:** https://netlify.com
2. **Drag and drop your `apps/web` folder**
3. **Set environment variables**

## Environment Variables Needed

```env
# API Keys
OPENAI_API_KEY=sk-your-openai-key

# Database
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://user:pass@host:port

# Authentication
JWT_SECRET=your-secret-key-here

# App URLs
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🎯 After Deployment

Your app will be live at:
- Frontend: `https://your-app.vercel.app`
- API: `https://your-app.railway.app`

Users can now:
- Upload outfit photos
- Get AI-powered ratings (1-10)
- Receive style suggestions
- Create accounts
- View history