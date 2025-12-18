'use client'

import { useState } from 'react'
import MediaUpload from './components/MediaUpload'
import ResultsDisplay from './components/ResultsDisplay'
import Header from './components/Header'
import { AnalysisResult } from './types'

type AnalysisMode = 'logo' | 'features' | 'combined'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('combined')

  const handleMediaUpload = async (file: File) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    // Determine media type
    const isVideo = file.type.startsWith('video/')
    setMediaType(isVideo ? 'video' : 'image')
    
    // Create preview URL
    const mediaUrl = URL.createObjectURL(file)
    setUploadedMedia(mediaUrl)

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      
      // Call API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64.split(',')[1], // Remove data:image/...;base64, prefix
          mimeType: file.type,
          analysisMode: analysisMode
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing media:', error)
      alert('Failed to analyze media. Please check your API key and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setUploadedMedia(null)
  }

  return (
    <main className="min-h-screen bg-adobe-bg">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-semibold text-adobe-text mb-3 tracking-tight">
              AI-Powered Brand Monitoring
            </h1>
            <p className="text-lg text-adobe-text-secondary max-w-2xl mx-auto">
              Upload images or videos to detect and identify brand logos with advanced AI technology
            </p>
            
            {/* Analysis Mode Selector */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setAnalysisMode('logo')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  analysisMode === 'logo'
                    ? 'bg-adobe-accent text-white'
                    : 'bg-adobe-surface text-adobe-text-secondary border border-adobe-border hover:border-adobe-accent'
                }`}
              >
                🎯 Logo Detection
              </button>
              <button
                onClick={() => setAnalysisMode('features')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  analysisMode === 'features'
                    ? 'bg-adobe-accent text-white'
                    : 'bg-adobe-surface text-adobe-text-secondary border border-adobe-border hover:border-adobe-accent'
                }`}
              >
                🔍 Feature Extraction
              </button>
              <button
                onClick={() => setAnalysisMode('combined')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  analysisMode === 'combined'
                    ? 'bg-adobe-accent text-white'
                    : 'bg-adobe-surface text-adobe-text-secondary border border-adobe-border hover:border-adobe-accent'
                }`}
              >
                ✨ Combined Analysis
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <MediaUpload 
                onMediaUpload={handleMediaUpload}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
                hasResult={!!analysisResult}
              />
            </div>

            {/* Results Section */}
            <div>
              {uploadedMedia && (
                <ResultsDisplay
                  mediaUrl={uploadedMedia}
                  result={analysisResult}
                  isAnalyzing={isAnalyzing}
                  mediaType={mediaType}
                />
              )}
            </div>
          </div>

          {/* Stats Section */}
          {analysisResult && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
              <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border adobe-card">
                <div className="text-3xl font-semibold text-adobe-accent mb-1">
                  {analysisResult.brands.length}
                </div>
                <div className="text-adobe-text-secondary text-sm">Brands Detected</div>
              </div>
              
              <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border adobe-card">
                <div className="text-3xl font-semibold text-purple-400 mb-1">
                  {analysisResult.influencers?.length || 0}
                </div>
                <div className="text-adobe-text-secondary text-sm">People Found</div>
              </div>
              
              <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border adobe-card">
                <div className="text-3xl font-semibold text-adobe-accent mb-1">
                  {analysisResult.hasLogo ? 'Yes' : 'No'}
                </div>
                <div className="text-adobe-text-secondary text-sm">Logo Present</div>
              </div>
              
              <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border adobe-card">
                <div className="text-3xl font-semibold text-adobe-accent mb-1">
                  {analysisResult.confidence ? `${Math.round(analysisResult.confidence * 100)}%` : 'N/A'}
                </div>
                <div className="text-adobe-text-secondary text-sm">Confidence</div>
              </div>
            </div>
          )}

          {/* Image Analysis Section (TUM Image Analyzer Style) */}
          {analysisResult?.imageAnalysis && (
            <div className="mt-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-adobe-text mb-4 flex items-center gap-2">
                <span>🔍</span> Feature Extraction Results
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">TUM Image Analyzer</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description */}
                <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border">
                  <h3 className="text-sm font-medium text-adobe-text-secondary mb-3 uppercase tracking-wide">
                    📝 Description
                  </h3>
                  <p className="text-adobe-text leading-relaxed">
                    {analysisResult.imageAnalysis.description}
                  </p>
                </div>

                {/* Extracted Text */}
                <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border">
                  <h3 className="text-sm font-medium text-adobe-text-secondary mb-3 uppercase tracking-wide">
                    📖 Extracted Text (OCR)
                  </h3>
                  {analysisResult.imageAnalysis.textExtracted?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.imageAnalysis.textExtracted.map((text, i) => (
                        <span key={i} className="bg-adobe-border px-3 py-1 rounded-full text-sm text-adobe-text">
                          {text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-adobe-text-secondary italic">No text detected</p>
                  )}
                </div>

                {/* Visual Features */}
                <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border">
                  <h3 className="text-sm font-medium text-adobe-text-secondary mb-3 uppercase tracking-wide">
                    🎨 Visual Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-adobe-text-secondary text-sm">Brightness</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-adobe-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${(analysisResult.imageAnalysis.features?.brightness || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-adobe-text text-sm w-10">
                          {Math.round((analysisResult.imageAnalysis.features?.brightness || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-adobe-text-secondary text-sm">Contrast</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-adobe-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${(analysisResult.imageAnalysis.features?.contrast || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-adobe-text text-sm w-10">
                          {Math.round((analysisResult.imageAnalysis.features?.contrast || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-adobe-text-secondary text-sm">Saturation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-adobe-border rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pink-400 rounded-full"
                            style={{ width: `${(analysisResult.imageAnalysis.features?.saturation || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-adobe-text text-sm w-10">
                          {Math.round((analysisResult.imageAnalysis.features?.saturation || 0) * 100)}%
                        </span>
                      </div>
                    </div>
                    {analysisResult.imageAnalysis.features?.dominantColors && (
                      <div className="mt-3">
                        <span className="text-adobe-text-secondary text-sm">Dominant Colors</span>
                        <div className="flex gap-2 mt-2">
                          {analysisResult.imageAnalysis.features.dominantColors.map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-lg border border-adobe-border shadow-sm"
                              style={{ backgroundColor: color.startsWith('#') ? color : color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags & Sentiment */}
                <div className="bg-adobe-surface rounded-lg p-6 border border-adobe-border">
                  <h3 className="text-sm font-medium text-adobe-text-secondary mb-3 uppercase tracking-wide">
                    🏷️ Tags & Sentiment
                  </h3>
                  {analysisResult.imageAnalysis.sentiment && (
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        analysisResult.imageAnalysis.sentiment === 'positive' 
                          ? 'bg-green-500/20 text-green-400'
                          : analysisResult.imageAnalysis.sentiment === 'negative'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {analysisResult.imageAnalysis.sentiment === 'positive' ? '😊' : 
                         analysisResult.imageAnalysis.sentiment === 'negative' ? '😔' : '😐'}
                        {analysisResult.imageAnalysis.sentiment}
                      </span>
                    </div>
                  )}
                  {analysisResult.imageAnalysis.tags && (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.imageAnalysis.tags.map((tag, i) => (
                        <span key={i} className="bg-adobe-accent/20 text-adobe-accent px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

