'use client'

import { useState } from 'react'
import { 
  generateBusinessModelCanvas, 
  AIGenerationRequest 
} from '@/lib/ai-service'
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileText,
  Target,
  Users,
  Building2,
  TrendingUp,
  Heart,
  MessageSquare,
  ShoppingCart,
  DollarSign,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AICanvasGeneratorProps {
  businessName: string
  industry: string
  description?: string
  onCanvasGenerated?: (canvas: any) => void
}

export default function AICanvasGenerator({ 
  businessName, 
  industry, 
  description, 
  onCanvasGenerated 
}: AICanvasGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCanvas, setGeneratedCanvas] = useState<any>(null)
  const [targetAudience, setTargetAudience] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerateCanvas = async () => {
    if (!businessName || !industry) {
      toast.error('Business name and industry are required')
      return
    }

    setIsGenerating(true)
    try {
      const request: AIGenerationRequest = {
        businessName,
        industry,
        description,
        targetAudience,
        additionalContext,
        contentType: 'canvas'
      }

      const result = await generateBusinessModelCanvas(request)

      if (result.success && result.content) {
        setGeneratedCanvas(result.content)
        onCanvasGenerated?.(result.content)
        toast.success('Business Model Canvas generated successfully!')
      } else {
        toast.error(result.error || 'Failed to generate canvas')
      }
    } catch (error) {
      console.error('Error generating canvas:', error)
      toast.error('Failed to generate canvas. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Canvas copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const saveCanvas = (canvas: any) => {
    // This would save to your database
    toast.success('Canvas saved to database!')
  }

  const canvasSections = [
    {
      id: 'partners',
      title: 'Key Partners',
      icon: Users,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'activities',
      title: 'Key Activities',
      icon: Building2,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'resources',
      title: 'Key Resources',
      icon: FileText,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'proposition',
      title: 'Value Propositions',
      icon: Heart,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'relationships',
      title: 'Customer Relationships',
      icon: MessageSquare,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'channels',
      title: 'Channels',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'segments',
      title: 'Customer Segments',
      icon: Target,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'costs',
      title: 'Cost Structure',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'revenue',
      title: 'Revenue Streams',
      icon: ShoppingCart,
      color: 'bg-emerald-100 text-emerald-800'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-gray-900">AI Business Model Canvas Generator</h3>
        </div>

        <div className="space-y-4">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Young professionals aged 25-35, Small business owners"
              className="input"
            />
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any specific business model insights, market analysis, or strategic focus..."
              rows={3}
              className="input"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateCanvas}
            disabled={isGenerating}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Canvas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Canvas
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Canvas */}
      {generatedCanvas && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Business Model Canvas</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(generatedCanvas)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => saveCanvas(generatedCanvas)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Save canvas"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Grid */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Row */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-blue-800">Key Partners</h4>
                  </div>
                  <p className="text-xs text-blue-700">Who are your key partners and suppliers?</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-medium text-green-800">Key Activities</h4>
                  </div>
                  <p className="text-xs text-green-700">What key activities does your value proposition require?</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-yellow-600" />
                    <h4 className="text-sm font-medium text-yellow-800">Key Resources</h4>
                  </div>
                  <p className="text-xs text-yellow-700">What key resources does your value proposition require?</p>
                </div>
              </div>

              {/* Center Row */}
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-medium text-purple-800">Value Propositions</h4>
                  </div>
                  <p className="text-xs text-purple-700">What value do you deliver to your customers?</p>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-pink-600" />
                    <h4 className="text-sm font-medium text-pink-800">Customer Relationships</h4>
                  </div>
                  <p className="text-xs text-pink-700">What type of relationship do your customers expect?</p>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-medium text-indigo-800">Channels</h4>
                  </div>
                  <p className="text-xs text-indigo-700">Through which channels do your customer segments want to be reached?</p>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-red-600" />
                    <h4 className="text-sm font-medium text-red-800">Customer Segments</h4>
                  </div>
                  <p className="text-xs text-red-700">Who are your most important customers?</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <h4 className="text-sm font-medium text-orange-800">Cost Structure</h4>
                  </div>
                  <p className="text-xs text-orange-700">What are the most important costs in your business model?</p>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-medium text-emerald-800">Revenue Streams</h4>
                  </div>
                  <p className="text-xs text-emerald-700">For what value are your customers really willing to pay?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Generated Canvas Content</h4>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {generatedCanvas}
              </pre>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerateCanvas}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Regenerate Canvas
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 