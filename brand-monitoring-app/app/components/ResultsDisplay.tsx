'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle, XCircle, Loader2, Award, Users } from 'lucide-react'
import { AnalysisResult } from '../types'
import BrandCard from './BrandCard'
import InfluencerCard from './InfluencerCard'

interface ResultsDisplayProps {
  mediaUrl: string
  result: AnalysisResult | null
  isAnalyzing: boolean
  mediaType?: 'image' | 'video'
}

export default function ResultsDisplay({ mediaUrl, result, isAnalyzing, mediaType = 'image' }: ResultsDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0 })
  const isVideo = mediaType === 'video'

  useEffect(() => {
    if (!mediaUrl || !canvasRef.current) return
    if (!isVideo && !imageRef.current) return
    if (isVideo && !videoRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const mediaElement = isVideo ? videoRef.current! : imageRef.current!

    const drawMedia = () => {
      if (!ctx) return

      // Set canvas size to match container
      const container = canvas.parentElement
      if (!container) return

      const maxWidth = container.clientWidth
      const maxHeight = 600

      // Calculate scaled dimensions
      let width: number
      let height: number
      
      if (isVideo) {
        width = (mediaElement as HTMLVideoElement).videoWidth
        height = (mediaElement as HTMLVideoElement).videoHeight
      } else {
        width = (mediaElement as HTMLImageElement).naturalWidth
        height = (mediaElement as HTMLImageElement).naturalHeight
      }
      
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      
      width = width * ratio
      height = height * ratio

      canvas.width = width
      canvas.height = height
      setMediaDimensions({ width, height })

      // Draw media (image or video frame)
      ctx.drawImage(mediaElement, 0, 0, width, height)

      // Draw bounding boxes for brands
      if (result?.brands) {
        result.brands.forEach((brand, index) => {
          if (brand.boundingBox) {
            const { x, y, width: boxWidth, height: boxHeight } = brand.boundingBox
            
            // Convert normalized coordinates to canvas coordinates
            const canvasX = Math.round(x * width)
            const canvasY = Math.round(y * height)
            const canvasWidth = Math.round(boxWidth * width)
            const canvasHeight = Math.round(boxHeight * height)

            // Brand colors
            const colors = ['#ef4444', '#ec4899', '#f97316', '#3b82f6', '#06b6d4']
            const color = colors[index % colors.length]

            // Draw bounding box
            ctx.strokeStyle = color
            ctx.lineWidth = 4
            ctx.shadowColor = color
            ctx.shadowBlur = 8
            ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight)
            ctx.shadowBlur = 0

            // Draw label
            const labelText = `${brand.name} (${Math.round(brand.confidence * 100)}%)`
            ctx.font = 'bold 16px Inter, sans-serif'
            const textMetrics = ctx.measureText(labelText)
            const labelPadding = 8
            const labelWidth = textMetrics.width + labelPadding * 2
            const labelHeight = 32
            const labelY = canvasY > labelHeight + 5 ? canvasY - labelHeight : canvasY + canvasHeight + labelHeight

            ctx.fillStyle = color
            ctx.globalAlpha = 0.95
            ctx.fillRect(canvasX, labelY - labelHeight, labelWidth, labelHeight)
            ctx.globalAlpha = 1
            ctx.fillStyle = 'white'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(labelText, canvasX + labelPadding, labelY - labelHeight / 2)
          }
        })
      }

      // Draw bounding boxes for influencers/people
      if (result?.influencers) {
        result.influencers.forEach((influencer, index) => {
          if (influencer.boundingBox) {
            const { x, y, width: boxWidth, height: boxHeight } = influencer.boundingBox
            
            const canvasX = Math.round(x * width)
            const canvasY = Math.round(y * height)
            const canvasWidth = Math.round(boxWidth * width)
            const canvasHeight = Math.round(boxHeight * height)

            // Influencer colors (purples/greens)
            const colors = ['#a855f7', '#6366f1', '#8b5cf6', '#d946ef', '#10b981']
            const color = colors[index % colors.length]

            // Draw bounding box
            ctx.strokeStyle = color
            ctx.lineWidth = 4
            ctx.shadowColor = color
            ctx.shadowBlur = 8
            ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight)
            ctx.shadowBlur = 0

            // Draw label
            const labelText = `${influencer.name} (${Math.round(influencer.confidence * 100)}%)`
            ctx.font = 'bold 16px Inter, sans-serif'
            const textMetrics = ctx.measureText(labelText)
            const labelPadding = 8
            const labelWidth = textMetrics.width + labelPadding * 2
            const labelHeight = 32
            const labelY = canvasY > labelHeight + 5 ? canvasY - labelHeight : canvasY + canvasHeight + labelHeight

            ctx.fillStyle = color
            ctx.globalAlpha = 0.95
            ctx.fillRect(canvasX, labelY - labelHeight, labelWidth, labelHeight)
            ctx.globalAlpha = 1
            ctx.fillStyle = 'white'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            ctx.fillText(labelText, canvasX + labelPadding, labelY - labelHeight / 2)
          }
        })
      }
    }

    if (isVideo) {
      const video = mediaElement as HTMLVideoElement
      // Draw a representative frame from the middle of the video
      const handleLoadedMetadata = () => {
        // Seek to 30% into the video, or 2 seconds in (whichever is earlier)
        // This is more likely to show the content where brands appear
        const targetTime = Math.min(video.duration * 0.3, 2)
        video.currentTime = targetTime
      }
      const handleSeeked = () => {
        drawMedia()
      }
      
      if (video.readyState >= 2) {
        const targetTime = Math.min(video.duration * 0.3, 2)
        video.currentTime = targetTime
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('seeked', handleSeeked)
      }
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        video.removeEventListener('seeked', handleSeeked)
      }
    } else {
      const img = mediaElement as HTMLImageElement
      if (img.complete) {
        drawMedia()
      } else {
        img.onload = drawMedia
      }
    }

    // Redraw on window resize
    const handleResize = () => drawMedia()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mediaUrl, result, isVideo])


  return (
    <div className="space-y-4">
      {/* Media Display with Bounding Boxes */}
      <div className="bg-adobe-surface rounded-lg p-3 border border-adobe-border shadow-adobe">
        <div className="relative">
          {isVideo ? (
            <video 
              ref={videoRef}
              src={mediaUrl}
              className="hidden"
              preload="metadata"
            />
          ) : (
            <img 
              ref={imageRef}
              src={mediaUrl} 
              alt="Uploaded" 
              className="hidden"
            />
          )}
          <canvas 
            ref={canvasRef}
            className="w-full rounded-md"
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-adobe-bg/80 backdrop-blur-sm rounded-md flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="w-12 h-12 mx-auto text-adobe-accent animate-spin" />
                <div className="text-adobe-text font-medium">Analyzing...</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Video Player Controls - shown after analysis */}
        {isVideo && !isAnalyzing && (
          <div className="mt-3">
            <div className="text-adobe-text-secondary text-xs mb-2">
              📹 Full video playback:
            </div>
            <video 
              src={mediaUrl}
              controls
              className="w-full rounded-md"
              preload="auto"
            />
          </div>
        )}
      </div>

      {/* Results Panel */}
      {result && !isAnalyzing && (
        <div className="space-y-4 animate-fade-in">
          {/* Logo Detection Status */}
          <div className={`
            bg-adobe-surface rounded-lg p-5 border 
            ${result.hasLogo ? 'border-green-600' : 'border-red-600'}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {result.hasLogo ? (
                  <CheckCircle className="w-7 h-7 text-green-500" />
                ) : (
                  <XCircle className="w-7 h-7 text-red-500" />
                )}
                <div>
                  <div className="text-adobe-text font-medium text-base">
                    {result.hasLogo ? 'Logo Detected' : 'No Logo Detected'}
                  </div>
                  <div className="text-adobe-text-secondary text-sm">
                    {result.hasLogo 
                      ? `${result.brands.length} brand${result.brands.length !== 1 ? 's' : ''} found`
                      : `No recognizable brands in this ${isVideo ? 'video' : 'image'}`
                    }
                  </div>
                </div>
              </div>
              
              {result.confidence && (
                <div className="text-right">
                  <div className="text-2xl font-semibold text-adobe-accent">
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <div className="text-xs text-adobe-text-secondary">Confidence</div>
                </div>
              )}
            </div>
          </div>

          {/* Detected Brands */}
          {result.brands.length > 0 && (
            <div className="bg-adobe-surface rounded-lg p-5 border border-adobe-border">
              <h3 className="text-adobe-text font-medium mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-adobe-accent" />
                <span>Detected Brands</span>
              </h3>
              
              <div className="space-y-3">
                {result.brands.map((brand, index) => (
                  <BrandCard key={index} brand={brand} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Detected People/Influencers */}
          {result.influencers && result.influencers.length > 0 && (
            <div className="bg-adobe-surface rounded-lg p-5 border border-adobe-border">
              <h3 className="text-adobe-text font-medium mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Detected People & Influencers</span>
              </h3>
              
              <div className="space-y-3">
                {result.influencers.map((influencer, index) => (
                  <InfluencerCard key={index} influencer={influencer} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <details className="bg-adobe-surface rounded-lg p-5 border border-adobe-border">
            <summary className="text-adobe-text font-medium cursor-pointer hover:text-adobe-accent transition-colors">
              🔍 Debug: Bounding Box Coordinates
            </summary>
            <div className="mt-4 space-y-2">
              {result.brands.map((brand, index) => (
                <div key={index} className="bg-adobe-bg p-3 rounded-md border border-adobe-border">
                  <div className="text-adobe-text font-medium mb-2">{brand.name}</div>
                  {brand.boundingBox && (
                    <pre className="text-xs text-adobe-text-secondary">
{`x: ${brand.boundingBox.x.toFixed(3)} (${(brand.boundingBox.x * 100).toFixed(1)}%)
y: ${brand.boundingBox.y.toFixed(3)} (${(brand.boundingBox.y * 100).toFixed(1)}%)
width: ${brand.boundingBox.width.toFixed(3)} (${(brand.boundingBox.width * 100).toFixed(1)}%)
height: ${brand.boundingBox.height.toFixed(3)} (${(brand.boundingBox.height * 100).toFixed(1)}%)`}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </details>

          {/* Raw Response (for debugging) */}
          {result.rawResponse && (
            <details className="bg-adobe-surface rounded-lg p-5 border border-adobe-border">
              <summary className="text-adobe-text font-medium cursor-pointer hover:text-adobe-accent transition-colors">
                View Raw AI Response
              </summary>
              <pre className="mt-4 text-xs text-adobe-text-secondary overflow-auto max-h-40 bg-adobe-bg p-4 rounded-md border border-adobe-border">
                {result.rawResponse}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

