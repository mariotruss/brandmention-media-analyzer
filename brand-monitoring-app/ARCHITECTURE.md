# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Brand Monitoring App                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │   ImageUpload  │  │ ResultsDisplay │  │  BrandCard    │ │
│  │   Component    │  │   Component    │  │  Component    │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Route Layer                    │
│                   /api/analyze/route.ts                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Gemini AI API                      │
│                  (gemini-2.0-flash-exp)                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   └── page.tsx (Main Page)
│       ├── Header
│       ├── ImageUpload
│       │   └── React Dropzone
│       └── ResultsDisplay
│           ├── Canvas (Bounding Boxes)
│           └── BrandCard(s)
│               └── Confidence Meters
```

## Data Flow

### 1. Image Upload Flow

```
User Action (Upload/Drop)
    │
    ├──> ImageUpload Component
    │        │
    │        ├──> Convert to Base64
    │        └──> Call Parent Handler
    │
    └──> Main Page (page.tsx)
             │
             └──> handleImageUpload()
                      │
                      └──> Set Loading State
```

### 2. API Analysis Flow

```
Frontend (page.tsx)
    │
    ├──> POST /api/analyze
    │        ↓
    │    Request Body:
    │    {
    │      image: "base64_string",
    │      mimeType: "image/jpeg"
    │    }
    │
    └──> API Route (route.ts)
             │
             ├──> Initialize Gemini AI
             │
             ├──> Send Image + Prompt
             │
             └──> Gemini AI Processing
                      │
                      ├──> Detect Logos
                      ├──> Identify Brands
                      ├──> Calculate Bounding Boxes
                      └──> Return JSON
                           │
                           └──> Parse & Format Response
                                    │
                                    └──> Return to Frontend
```

### 3. Results Display Flow

```
API Response Received
    │
    ├──> Update State (setAnalysisResult)
    │
    └──> ResultsDisplay Component
             │
             ├──> Load Image on Canvas
             │
             ├──> Draw Bounding Boxes
             │        │
             │        ├──> Calculate Coordinates
             │        ├──> Draw Rectangles
             │        └──> Draw Labels
             │
             └──> Render Brand Cards
                      │
                      ├──> Display Brand Name
                      ├──> Show Confidence Score
                      └──> Render Progress Bar
```

## Key Technologies & Their Roles

### Frontend Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI component library |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Utility-first styling |
| **React Dropzone** | File upload interface |
| **Lucide React** | Icon components |
| **Canvas API** | Drawing bounding boxes |

### Backend Stack

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless API endpoints |
| **Google Generative AI** | SDK for Gemini AI |
| **Gemini 2.0 Flash** | Vision AI model |

## State Management

The app uses React's built-in state management:

```typescript
// Main state variables
const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
const [isAnalyzing, setIsAnalyzing] = useState(false)
const [uploadedImage, setUploadedImage] = useState<string | null>(null)
```

### State Flow:

1. **Initial State**: All null/false
2. **Upload Triggered**: `isAnalyzing = true`, `uploadedImage = URL`
3. **API Call**: Processing...
4. **Response Received**: `analysisResult = data`, `isAnalyzing = false`
5. **Reset**: All back to initial state

## Type System

### Core Types

```typescript
interface DetectedBrand {
  name: string
  confidence: number
  boundingBox?: BoundingBox
}

interface BoundingBox {
  x: number        // Normalized 0-1
  y: number        // Normalized 0-1
  width: number    // Normalized 0-1
  height: number   // Normalized 0-1
}

interface AnalysisResult {
  hasLogo: boolean
  brands: DetectedBrand[]
  confidence: number
  rawResponse?: string
}
```

## Canvas Rendering Algorithm

```typescript
// 1. Load image
img.onload = () => {
  // 2. Calculate scaled dimensions
  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
  canvas.width = img.width * ratio
  canvas.height = img.height * ratio
  
  // 3. Draw image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  
  // 4. For each detected brand:
  brands.forEach(brand => {
    // Convert normalized coordinates to canvas pixels
    const x = brand.boundingBox.x * canvas.width
    const y = brand.boundingBox.y * canvas.height
    const w = brand.boundingBox.width * canvas.width
    const h = brand.boundingBox.height * canvas.height
    
    // Draw rectangle and label
    ctx.strokeRect(x, y, w, h)
    ctx.fillText(brand.name, x, y)
  })
}
```

## API Prompt Engineering

The API uses a carefully crafted prompt to get structured JSON responses:

```typescript
const prompt = `Analyze this image and detect any brand logos...

Provide JSON with:
- hasLogo: boolean
- brands: array with name, confidence, boundingBox
- confidence: overall score
- description: brief summary

Respond ONLY with valid JSON.`
```

## Security Considerations

1. **API Key Protection**: Stored in `.env.local`, never exposed to client
2. **Server-side Processing**: All AI calls happen on the server
3. **File Type Validation**: Only images accepted
4. **Error Handling**: Graceful fallbacks for API failures

## Performance Optimizations

1. **Base64 Encoding**: Efficient image transfer
2. **Canvas Rendering**: Hardware-accelerated drawing
3. **Lazy Loading**: Components load only when needed
4. **Response Caching**: Browser caches static assets
5. **Optimized Images**: Next.js automatic image optimization

## Scalability Considerations

### Current Architecture
- **Serverless Functions**: Auto-scales with demand
- **Stateless Design**: No server-side session management
- **CDN-Ready**: Static assets can be served from CDN

### Future Enhancements
- Database integration for result history
- User authentication system
- Batch processing capabilities
- WebSocket for real-time updates
- Redis caching for repeated images

## Deployment Architecture

```
User Browser
    │
    ├──> Vercel Edge Network (CDN)
    │        │
    │        ├──> Static Assets (JS, CSS)
    │        └──> HTML Pages
    │
    └──> Vercel Serverless Functions
             │
             └──> /api/analyze
                      │
                      └──> Google Gemini AI
```

## Error Handling Strategy

```
API Call
    │
    ├──> Success Path
    │        └──> Display Results
    │
    └──> Error Path
             │
             ├──> Network Error
             │        └──> Show "Connection failed" message
             │
             ├──> API Error (500)
             │        └──> Show "Analysis failed" message
             │
             └──> Invalid Response
                      └──> Show fallback with partial data
```

## Testing Strategy

### Unit Tests (Future)
- Component rendering
- State management
- Utility functions

### Integration Tests (Future)
- API endpoint testing
- Image upload flow
- Results display

### E2E Tests (Future)
- Complete user journey
- Error scenarios
- Different image types

---

Built with modern web technologies for optimal performance and user experience.

