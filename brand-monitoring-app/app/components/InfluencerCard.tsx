'use client'

import { User, TrendingUp } from 'lucide-react'
import { DetectedInfluencer } from '../types'

interface InfluencerCardProps {
  influencer: DetectedInfluencer
  index: number
}

export default function InfluencerCard({ influencer, index }: InfluencerCardProps) {
  const colors = [
    { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', bar: 'bg-purple-500' },
    { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', bar: 'bg-indigo-500' },
    { bg: 'bg-violet-500/10', border: 'border-violet-500/50', text: 'text-violet-400', bar: 'bg-violet-500' },
    { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/50', text: 'text-fuchsia-400', bar: 'bg-fuchsia-500' },
    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  ]
  
  const color = colors[index % colors.length]
  const confidencePercent = Math.round(influencer.confidence * 100)

  return (
    <div className={`
      ${color.bg} rounded-md p-4 border ${color.border}
      hover:scale-[1.02] transition-transform duration-200
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <User className={`w-4 h-4 ${color.text}`} />
              <span className="text-adobe-text font-medium">{influencer.name}</span>
            </div>
            {influencer.description && (
              <div className="text-xs text-adobe-text-secondary mt-1">
                {influencer.description}
              </div>
            )}
            {influencer.boundingBox && (
              <div className="text-xs text-adobe-text-secondary mt-1">
                Position: ({Math.round(influencer.boundingBox.x * 100)}%, {Math.round(influencer.boundingBox.y * 100)}%)
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




