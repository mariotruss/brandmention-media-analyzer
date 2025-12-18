# ⚡ Quick Start Guide

Get your Adobe-style Brand Monitoring App running in 3 minutes!

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Google AI API Key ([Get one here](https://aistudio.google.com/app/apikey))

---

## 🚀 Installation

### 1. Navigate to the app directory

```bash
cd brand-monitoring-app
```

### 2. Install dependencies

```bash
npm install
```

This installs:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Google Generative AI SDK
- React Dropzone
- Lucide React Icons

---

## 🔑 Configuration

### Create your environment file

```bash
# Create .env.local file
touch .env.local
```

### Add your Google API key

Open `.env.local` and add:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

**Where to get API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the key and paste above

---

## 🎬 Run the App

### Start development server

```bash
npm run dev
```

You should see:

```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.x:3000
```

### Open in browser

Navigate to: **http://localhost:3000**

---

## 🎯 First Test

### Test with provided images

1. **Upload an image** from the parent `logo/` folder:
   - `corona.jpg` - Beer bottle with Corona logo
   - `bottle.jpg` - Product image

2. **Wait 2-5 seconds** for AI analysis

3. **View results:**
   - ✅ Logo detection status
   - 📦 Bounding boxes on image
   - 📊 Brand cards with confidence scores
   - 📈 Statistics dashboard

---

## 🎨 What You'll See

### Adobe-Inspired Interface

- **Dark Theme** - Professional charcoal background (#1e1e1e)
- **Red Accents** - Vibrant red highlights (#ff0050)
- **Clean Typography** - Inter font family
- **Smooth Animations** - Subtle fade-in effects
- **Card-Based Layout** - Organized sections

### Features

1. **Drag & Drop Upload** - Easy image selection
2. **Real-time Analysis** - AI processing indicator
3. **Visual Detection** - Colored bounding boxes
4. **Confidence Scores** - Per-brand accuracy metrics
5. **Responsive Design** - Works on all devices

---

## 🛠️ Troubleshooting

### Problem: "GOOGLE_API_KEY not configured"

**Solution:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify content
cat .env.local

# Should show:
# GOOGLE_API_KEY=AIza...
```

Restart dev server after adding key:
```bash
# Stop: Ctrl + C
# Start: npm run dev
```

### Problem: Module not found errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or find and kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Problem: Tailwind styles not working

**Solution:**
```bash
# Rebuild Next.js cache
rm -rf .next
npm run dev
```

---

## 📁 Project Structure

```
brand-monitoring-app/
├── app/
│   ├── api/
│   │   └── analyze/          # Logo detection API
│   │       └── route.ts
│   ├── components/           # React components
│   │   ├── Header.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── BrandCard.tsx
│   ├── globals.css           # Adobe-style CSS
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── types.ts              # TypeScript types
├── public/                   # Static assets
├── .env.local                # API keys (YOU CREATE THIS)
├── package.json              # Dependencies
├── tailwind.config.js        # Design tokens
└── next.config.js            # Next.js config
```

---

## 🧪 Testing the App

### Test Case 1: Single Brand Detection

1. Upload image with one clear logo
2. Expected: 90%+ confidence, accurate bounding box

### Test Case 2: Multiple Brands

1. Upload image with 2-3 brand logos
2. Expected: Multiple colored boxes, separate cards

### Test Case 3: No Brands

1. Upload landscape/nature photo
2. Expected: "No Logo Detected" message

---

## 🔥 Hot Tips

### Development

- **Hot Reload Active** - Changes auto-refresh
- **Console Logs** - Check terminal for API logs
- **Browser DevTools** - F12 for debugging

### Customization

Want to change colors? Edit:
```css
/* app/globals.css */
:root {
  --adobe-accent: #ff0050;  /* Change this! */
}
```

### API Usage

- **Free Tier:** 60 requests per minute
- **Rate Limiting:** Built into Gemini API
- **Cost:** Very affordable for testing

---

## 📚 Next Steps

Once running successfully:

1. ✅ Read **DESIGN.md** - Understand the Adobe styling
2. ✅ Check **ARCHITECTURE.md** - Learn the tech stack
3. ✅ Try **DEMO.md** - Practice demo scenarios
4. ✅ Deploy (see README.md) - Share with team

---

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts and add `GOOGLE_API_KEY` in Vercel dashboard.

**Vercel Dashboard:**
1. Project Settings
2. Environment Variables
3. Add `GOOGLE_API_KEY`
4. Redeploy

---

## 📞 Need Help?

- **Check logs:** Terminal output shows errors
- **Browser console:** F12 → Console tab
- **Network tab:** F12 → Network → See API calls
- **Documentation:** README.md and ARCHITECTURE.md

---

## ✨ Success Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with API key
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to localhost:3000
- [ ] Test image uploaded successfully
- [ ] Results displayed with bounding boxes

---

**🎉 Congratulations! Your Adobe-style Brand Monitoring App is ready!**

Now go detect some logos! 🔍

