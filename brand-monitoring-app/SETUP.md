# 🚀 Quick Setup Guide

Follow these steps to get your Brand Monitoring App up and running!

## Step 1: Install Dependencies

Open your terminal in the `brand-monitoring-app` directory and run:

```bash
npm install
```

This will install all necessary packages including:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Generative AI SDK
- React Dropzone
- Lucide Icons

## Step 2: Get Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key

⚠️ **Important**: Keep your API key secret and never commit it to version control!

## Step 3: Create Environment File

Create a new file named `.env.local` in the root of the `brand-monitoring-app` directory:

```bash
# In the brand-monitoring-app directory
touch .env.local
```

Add your API key to this file:

```env
GOOGLE_API_KEY=AIzaSy...your-actual-key-here
```

## Step 4: Run the Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:

```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

## Step 5: Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Brand Monitoring dashboard! 🎉

## Step 6: Test the App

1. **Upload an image** with a brand logo (try the Corona or bottle images from the `logo` folder)
2. **Wait for analysis** (should take 2-5 seconds)
3. **View results** with bounding boxes and detected brands

## Troubleshooting

### Problem: "GOOGLE_API_KEY not configured"

**Solution**: Make sure you created the `.env.local` file with your API key and restart the dev server.

### Problem: "Module not found" errors

**Solution**: Run `npm install` again to ensure all dependencies are installed.

### Problem: Port 3000 is already in use

**Solution**: Either stop the other process using port 3000, or run Next.js on a different port:

```bash
npm run dev -- -p 3001
```

### Problem: API returns errors

**Solution**: 
1. Check that your API key is valid
2. Make sure you have credits/quota available in your Google AI Studio account
3. Try with a different image (JPG, PNG under 10MB)

## Next Steps

- Try uploading different images with various brand logos
- Experiment with images containing multiple brands
- Check the confidence scores for different detections
- View the raw AI response for debugging

## Development Tips

- The app uses **hot reload** - changes to code will automatically refresh
- Check the browser console for any JavaScript errors
- The API route logs are visible in the terminal where you ran `npm run dev`
- Use the "View Raw AI Response" section to debug detection issues

## Building for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

This creates an optimized production build.

---

Need help? Check the main README.md or open an issue on GitHub!

