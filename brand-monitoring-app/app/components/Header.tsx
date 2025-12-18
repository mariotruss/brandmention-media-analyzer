import { Search, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-adobe-surface border-b border-adobe-border shadow-adobe">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-adobe-accent p-2 rounded-md">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-adobe-text">Brand Monitor</h1>
              <p className="text-xs text-adobe-text-secondary">AI-Powered Logo Detection</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 bg-adobe-surface-light px-4 py-2 rounded-md border border-adobe-border">
            <Sparkles className="w-4 h-4 text-adobe-accent" />
            <span className="text-sm text-adobe-text-secondary">Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </header>
  )
}

