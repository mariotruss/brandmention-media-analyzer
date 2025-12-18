'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Video, RefreshCw, Loader2 } from 'lucide-react'

interface MediaUploadProps {
  onMediaUpload: (file: File) => void
  isAnalyzing: boolean
  onReset: () => void
  hasResult: boolean
}

export default function MediaUpload({ 
  onMediaUpload, 
  isAnalyzing,
  onReset,
  hasResult 
}: MediaUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onMediaUpload(acceptedFiles[0])
    }
  }, [onMediaUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mpeg', '.mpg', '.flv', '.wmv', '.3gpp']
    },
    multiple: false,
    disabled: isAnalyzing
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-300 bg-adobe-surface
          ${isDragActive 
            ? 'border-adobe-accent bg-adobe-surface-light scale-[1.02]' 
            : 'border-adobe-border hover:border-adobe-accent'
          }
          ${isAnalyzing ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-16 h-16 mx-auto text-adobe-accent animate-spin" />
              <div className="text-adobe-text font-medium">Analyzing Media...</div>
              <div className="text-adobe-text-secondary text-sm">
                AI is detecting brands and logos
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center gap-2">
                <div className="bg-adobe-accent p-4 rounded-lg">
                  {isDragActive ? (
                    <Upload className="w-12 h-12 text-white" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="bg-adobe-accent/80 p-4 rounded-lg">
                  <Video className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-adobe-text text-lg font-medium">
                  {isDragActive ? 'Drop your media here' : 'Upload Image or Video'}
                </div>
                <div className="text-adobe-text-secondary text-sm">
                  Drag & drop or click to select
                </div>
                <div className="text-adobe-text-secondary text-xs">
                  Images: JPG, PNG, WebP, GIF • Videos: MP4, MOV, AVI, WebM
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {hasResult && !isAnalyzing && (
        <button
          onClick={onReset}
          className="w-full bg-adobe-accent hover:bg-adobe-accent-hover text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-adobe"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Analyze New Media</span>
        </button>
      )}

      <div className="bg-adobe-surface rounded-lg p-5 border border-adobe-border">
        <h3 className="text-adobe-text font-medium mb-3 flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-adobe-accent" />
          <span>How it works</span>
        </h3>
        <ul className="space-y-2 text-adobe-text-secondary text-sm">
          <li className="flex items-start space-x-2">
            <span className="text-adobe-accent mt-1">•</span>
            <span>Upload an image or video containing brand logos</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-adobe-accent mt-1">•</span>
            <span>AI analyzes and identifies all visible brands across frames</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-adobe-accent mt-1">•</span>
            <span>View results with bounding boxes and confidence scores</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

