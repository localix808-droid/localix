'use client'

import { useState } from 'react'
import { 
  generateSocialMediaPosts, 
  parseGeneratedPosts, 
  AIGenerationRequest 
} from '@/lib/ai-service'
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  Calendar,
  MessageSquare,
  Hash,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AIPostGeneratorProps {
  businessName: string
  industry: string
  description?: string
  onPostGenerated?: (posts: Array<{ content: string; hashtags: string[] }>) => void
}

export default function AIPostGenerator({ 
  businessName, 
  industry, 
  description, 
  onPostGenerated 
}: AIPostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<Array<{ content: string; hashtags: string[] }>>([])
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'instagram' | 'twitter' | 'linkedin'>('facebook')
  const [targetAudience, setTargetAudience] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: MessageSquare },
    { id: 'instagram', name: 'Instagram', icon: MessageSquare },
    { id: 'twitter', name: 'Twitter', icon: MessageSquare },
    { id: 'linkedin', name: 'LinkedIn', icon: MessageSquare },
  ]

  const handleGeneratePosts = async () => {
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
        platform: selectedPlatform,
        additionalContext,
        contentType: 'post'
      }

      const result = await generateSocialMediaPosts(request)

      if (result.success && result.content) {
        const parsedPosts = parseGeneratedPosts(result.content)
        setGeneratedPosts(parsedPosts)
        onPostGenerated?.(parsedPosts)
        toast.success(`Generated ${parsedPosts.length} posts successfully!`)
      } else {
        toast.error(result.error || 'Failed to generate posts')
      }
    } catch (error) {
      console.error('Error generating posts:', error)
      toast.error('Failed to generate posts. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      toast.success('Post copied to clipboard!')
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const schedulePost = (post: { content: string; hashtags: string[] }, index: number) => {
    // This would integrate with your scheduling system
    toast.success(`Post ${index + 1} scheduled for later!`)
  }

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-gray-900">AI Post Generator</h3>
        </div>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Platform
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id as any)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      selectedPlatform === platform.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

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
              placeholder="Any specific topics, promotions, or tone preferences..."
              rows={3}
              className="input"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePosts}
            disabled={isGenerating}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Posts...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Posts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Generated Posts ({generatedPosts.length})
          </h3>
          
          {generatedPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Post {index + 1}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                    {selectedPlatform}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(post.content, index)}
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
                    onClick={() => schedulePost(post, index)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Schedule post"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((hashtag, hashtagIndex) => (
                      <span
                        key={hashtagIndex}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {hashtag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              onClick={handleGeneratePosts}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate More Posts
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 