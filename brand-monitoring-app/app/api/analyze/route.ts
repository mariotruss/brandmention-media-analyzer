import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

// Analysis modes: 'logo' (default), 'features', 'combined'
export async function POST(request: NextRequest) {
  try {
    const { image, mimeType, analysisMode = 'logo' } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No media file provided' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Use Gemini 2.0 Flash for vision tasks (supports both images and videos)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Determine if this is a video or image
    const isVideo = mimeType?.startsWith('video/')
    const mediaType = isVideo ? 'video' : 'image'

    // Comprehensive prompt for logo detection and influencer identification
    const prompt = `Analyze this ${mediaType} and detect:
1. Any brand logos or trademarks present${isVideo ? ' (across all frames)' : ''}
2. Any people visible, and if they are well-known influencers, celebrities, or public figures, identify them

Please provide a detailed JSON response with the following structure:
{
  "hasLogo": boolean (true if any logo/brand is detected),
  "brands": [
    {
      "name": "Brand Name",
      "confidence": 0.95 (value between 0 and 1),
      "boundingBox": {
        "x": normalized x position (0-1) - left edge of logo,
        "y": normalized y position (0-1) - top edge of logo,
        "width": normalized width (0-1) - horizontal span,
        "height": normalized height (0-1) - vertical span
      }
    }
  ],
  "hasPeople": boolean (true if any person is detected),
  "influencers": [
    {
      "name": "Influencer/Celebrity Name or 'Unknown Person'",
      "confidence": 0.85 (value between 0 and 1 - confidence in identification),
      "description": "Brief description (e.g., 'Social media influencer', 'Actor', 'Athlete', or 'Person in video')",
      "boundingBox": {
        "x": normalized x position (0-1) - left edge,
        "y": normalized y position (0-1) - top edge,
        "width": normalized width (0-1) - horizontal span,
        "height": normalized height (0-1) - vertical span
      }
    }
  ],
  "confidence": overall confidence score (0-1),
  "description": "Brief description of what was found"
}

CRITICAL Instructions for Bounding Boxes:
- Draw boxes around THE LOGO/TEXT ONLY, NOT the entire product/bottle/packaging
- Focus on the brand name or logo graphic itself
- x, y should be the TOP-LEFT corner of the logo (not the product)
- width, height should TIGHTLY fit around just the logo/text area
- Each unique brand should appear ONLY ONCE (don't detect same brand multiple times)
- Use normalized coordinates (0-1) where:
  * x=0 is left edge, x=1 is right edge
  * y=0 is top edge, y=1 is bottom edge
- Example: A logo on a bottle might be: {"x": 0.35, "y": 0.45, "width": 0.15, "height": 0.08}

Brand Detection Instructions:
- Detect ALL UNIQUE brand logos/trademarks visible${isVideo ? ' throughout the video' : ' in the image'}
- Each brand should appear only ONCE (even if multiple products with same brand${isVideo ? ' or multiple frames' : ''})
- If same brand appears multiple times, choose the most prominent/clear instance
- Include confidence scores based on logo visibility and clarity
- Common brands: Corona, Heineken, Coca-Cola, Pepsi, Nike, Adidas, Apple, Samsung, etc.
- If no logos are found, set hasLogo to false and provide empty brands array

People/Influencer Detection Instructions:
- Detect if there are any people visible in the ${mediaType}
- If people are detected, try to identify if they are well-known influencers, celebrities, or public figures
- For recognized people: provide their name, confidence, and a brief description (their profession/field)
- For unrecognized people: use "Unknown Person" as name with lower confidence, description like "Person in ${mediaType}"
- Include bounding boxes around people's faces or upper body
- Consider: Social media influencers, YouTubers, actors, athletes, musicians, models, etc.
- If no people are found, set hasPeople to false and provide empty influencers array${isVideo ? '\n- For videos, analyze key frames and aggregate results across the video' : ''}

Respond ONLY with valid JSON, no additional text.`

    const mediaPart = {
      inlineData: {
        data: image,
        mimeType: mimeType || 'image/jpeg',
      },
    }

    const result = await model.generateContent([prompt, mediaPart])
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from the response
    let analysisResult
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisResult = JSON.parse(cleanedText)
      
      // Deduplicate brands - keep only the one with highest confidence
      if (analysisResult.brands && Array.isArray(analysisResult.brands)) {
        const brandMap = new Map<string, any>()
        analysisResult.brands.forEach((brand: any) => {
          const brandName = brand.name.toLowerCase().trim()
          const existing = brandMap.get(brandName)
          if (!existing || brand.confidence > existing.confidence) {
            brandMap.set(brandName, brand)
          }
        })
        analysisResult.brands = Array.from(brandMap.values())
      }
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      console.error('Failed to parse JSON:', text)
      
      // Try to extract information from text response
      const hasLogo = text.toLowerCase().includes('logo') || 
                     text.toLowerCase().includes('brand') ||
                     text.toLowerCase().includes('corona') ||
                     text.toLowerCase().includes('heineken')
      
      // Simple brand extraction
      const brands: any[] = []
      const commonBrands = [
        'Corona', 'Heineken', 'Coca-Cola', 'Pepsi', 'Nike', 'Adidas', 
        'Apple', 'Samsung', 'McDonald', 'Starbucks', 'Amazon', 'Google',
        'Microsoft', 'BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda'
      ]
      
      commonBrands.forEach(brand => {
        if (text.toLowerCase().includes(brand.toLowerCase())) {
          brands.push({
            name: brand,
            confidence: 0.8,
            boundingBox: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }
          })
        }
      })

      analysisResult = {
        hasLogo,
        brands,
        hasPeople: false,
        influencers: [],
        confidence: brands.length > 0 ? 0.75 : 0.3,
        rawResponse: text,
        description: text.substring(0, 200)
      }
    }

    // If combined mode or features mode, add image analysis
    if (analysisMode === 'features' || analysisMode === 'combined') {
      const featuresPrompt = `Analyze this ${mediaType} and provide detailed feature extraction:

Please provide a detailed JSON response with the following structure:
{
  "textExtracted": ["array of any text/words visible in the image"],
  "description": "A detailed description of the image content, style, and composition",
  "features": {
    "brightness": 0.0 to 1.0 (estimate),
    "contrast": 0.0 to 1.0 (estimate),
    "saturation": 0.0 to 1.0 (estimate),
    "dominantColors": ["array of dominant colors as hex codes or color names"]
  },
  "tags": ["array of relevant tags/keywords describing the image"],
  "sentiment": "positive/negative/neutral - overall mood of the image"
}

Focus on:
- Any visible text, brand names, slogans, or signage
- Visual style and aesthetics
- Color palette and composition
- Objects, people, and settings
- Overall mood and sentiment

Respond ONLY with valid JSON, no additional text.`

      try {
        const featuresResult = await model.generateContent([featuresPrompt, mediaPart])
        const featuresResponse = await featuresResult.response
        const featuresText = featuresResponse.text()
        
        // Parse features response
        const cleanedFeaturesText = featuresText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const imageAnalysis = JSON.parse(cleanedFeaturesText)
        analysisResult.imageAnalysis = imageAnalysis
      } catch (featuresError) {
        console.error('Failed to parse image features:', featuresError)
        // Continue without image analysis if it fails
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error: any) {
    console.error('Error analyzing media:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze media' },
      { status: 500 }
    )
  }
}

