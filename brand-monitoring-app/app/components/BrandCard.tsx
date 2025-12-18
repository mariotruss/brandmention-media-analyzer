'use client'

import { Tag, TrendingUp } from 'lucide-react'
import { DetectedBrand } from '../types'

interface BrandCardProps {
  brand: DetectedBrand
  index: number
}

export default function BrandCard({ brand, index }: BrandCardProps) {
  const colors = [
    { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', bar: 'bg-red-500' },
    { bg: 'bg-pink-500/10', border: 'border-pink-500/50', text: 'text-pink-400', bar: 'bg-pink-500' },
    { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', bar: 'bg-orange-500' },
    { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', bar: 'bg-blue-500' },
    { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', bar: 'bg-cyan-500' },
  ]
  
  const color = colors[index % colors.length]
  const confidencePercent = Math.round(brand.confidence * 100)

  return (
    <div className={`
      ${color.bg} rounded-md p-4 border ${color.border}
      hover:scale-[1.02] transition-transform duration-200
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Tag className={`w-4 h-4 ${color.text}`} />
              <span className="text-adobe-text font-medium">{brand.name}</span>
            </div>
            {brand.boundingBox && (
              <div className="text-xs text-adobe-text-secondary mt-1">
                Position: ({Math.round(brand.boundingBox.x * 100)}%, {Math.round(brand.boundingBox.y * 100)}%)
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-4 h-4 ${color.text}`} />
          <div className="text-right">
            <div className={`font-semibold ${color.text}`}>
              {confidencePercent}%
            </div>
            <div className="text-xs text-adobe-text-secondary">confidence</div>
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3 bg-adobe-bg rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full ${color.bar} transition-all duration-500`}
          style={{ width: `${confidencePercent}%` }}
        />
      </div>
    </div>
  )
}

