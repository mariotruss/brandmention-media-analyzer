export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface DetectedBrand {
  name: string
  confidence: number
  boundingBox?: BoundingBox
}

export interface DetectedInfluencer {
  name: string
  confidence: number
  description?: string
  boundingBox?: BoundingBox
}

export interface ImageFeatures {
  brightness: number
  contrast: number
  saturation: number
  dominantColors: string[]
}

export interface ImageAnalysisResult {
  textExtracted: string[]
  description: string
  features: ImageFeatures
  tags: string[]
  sentiment?: string
}

export interface AnalysisResult {
  hasLogo: boolean
  brands: DetectedBrand[]
  confidence: number
  rawResponse?: string
  hasPeople?: boolean
  influencers?: DetectedInfluencer[]
  imageAnalysis?: ImageAnalysisResult
}

