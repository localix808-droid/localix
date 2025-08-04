'use client'

import { useState } from 'react'
import { 
  generateCustomerPersonas, 
  parseGeneratedPersonas, 
  AIGenerationRequest 
} from '@/lib/ai-service'
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Users,
  User,
  Target,
  TrendingUp,
  Heart,
  MessageSquare,
  ShoppingCart,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AIPersonaGeneratorProps {
  businessName: string
  industry: string
  description?: string
  onPersonasGenerated?: (personas: any[]) => void
}

export default function AIPersonaGenerator({ 
  businessName, 
  industry, 
  description, 
  onPersonasGenerated 
}: AIPersonaGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPersonas, setGeneratedPersonas] = useState<any[]>([])
  const [targetAudience, setTargetAudience] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGeneratePersonas = async () => {
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
        contentType: 'persona'
      }

      const result = await generateCustomerPersonas(request)

      if (result.success && result.content) {
        const parsedPersonas = parseGeneratedPersonas(result.content)
        setGeneratedPersonas(parsedPersonas)
        onPersonasGenerated?.(parsedPersonas)
        toast.success(`Generated ${parsedPersonas.length} personas successfully!`)
      } else {
        toast.error(result.error || 'Failed to generate personas')
      }
    } catch (error) {
      console.error('Error generating personas:', error)
      toast.error('Failed to generate personas. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      toast.success('Persona copied to clipboard!')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const savePersona = (persona: any, index: number) => {
    // This would save to your database
    toast.success(`Persona ${index + 1} saved to database!`)
  }

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-gray-900">AI Persona Generator</h3>
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
              placeholder="Any specific customer characteristics, market insights, or preferences..."
              rows={3}
              className="input"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePersonas}
            disabled={isGenerating}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Personas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Personas
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Personas */}
      {generatedPersonas.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Generated Personas ({generatedPersonas.length})
          </h3>
          
          {generatedPersonas.map((persona, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <h4 className="text-lg font-medium text-gray-900">{persona.name}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Persona {index + 1}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(persona, null, 2), index)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => savePersona(persona, index)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Save persona"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Basic Information</h5>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{persona.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Occupation:</span>
                        <span className="font-medium">{persona.occupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Income:</span>
                        <span className="font-medium">{persona.income}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Demographics</h5>
                    </div>
                    <p className="text-sm text-gray-600">{persona.demographics}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Psychographics</h5>
                    </div>
                    <p className="text-sm text-gray-600">{persona.psychographics}</p>
                  </div>
                </div>

                {/* Behavior & Preferences */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Pain Points</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.painPoints.map((point: string, pointIndex: number) => (
                        <span
                          key={pointIndex}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Goals</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.goals.map((goal: string, goalIndex: number) => (
                        <span
                          key={goalIndex}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Preferred Channels</h5>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferredChannels.map((channel: string, channelIndex: number) => (
                        <span
                          key={channelIndex}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Buying Behavior</h5>
                    </div>
                    <p className="text-sm text-gray-600">{persona.buyingBehavior}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-gray-500" />
                      <h5 className="text-sm font-medium text-gray-700">Benefits from Business</h5>
                    </div>
                    <p className="text-sm text-gray-600">{persona.benefits}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              onClick={handleGeneratePersonas}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate More Personas
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 