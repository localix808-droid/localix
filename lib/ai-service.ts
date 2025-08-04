// AI Service for Google AI API integration
const GOOGLE_AI_API_KEY = 'AIzaSyBGdnMGI2uoehiq9F_zmXktlxpKb-RtdRQ'
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'

export interface AIGenerationRequest {
  businessName: string
  industry: string
  description?: string
  targetAudience?: string
  platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  contentType?: 'post' | 'persona' | 'canvas'
  additionalContext?: string
}

export interface AIGenerationResponse {
  success: boolean
  content?: string
  error?: string
}

/**
 * Generate social media posts using Google AI
 */
export async function generateSocialMediaPosts(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  try {
    const prompt = `
Create 5 engaging social media posts for ${request.businessName}, a ${request.industry} business.

Business Description: ${request.description || 'Not provided'}
Target Audience: ${request.targetAudience || 'General audience'}
Platform: ${request.platform || 'All platforms'}
Additional Context: ${request.additionalContext || ''}

Requirements:
- Each post should be engaging and relevant to the target audience
- Include relevant hashtags
- Keep posts under 280 characters for Twitter compatibility
- Make them platform-appropriate
- Include call-to-actions where appropriate
- Mix of promotional, educational, and engaging content

Format each post as:
1. [Post content with hashtags]
2. [Post content with hashtags]
...and so on.

Make the content authentic, valuable, and engaging for the target audience.
`

    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        content: data.candidates[0].content.parts[0].text
      }
    } else {
      throw new Error('No content generated from AI')
    }
  } catch (error: any) {
    console.error('AI generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate content'
    }
  }
}

/**
 * Generate customer personas using Google AI
 */
export async function generateCustomerPersonas(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  try {
    const prompt = `
Create 3 detailed customer personas for ${request.businessName}, a ${request.industry} business.

Business Description: ${request.description || 'Not provided'}
Target Audience: ${request.targetAudience || 'General audience'}
Additional Context: ${request.additionalContext || ''}

For each persona, include:
1. Name and Age
2. Occupation and Income Level
3. Demographics (location, education, etc.)
4. Psychographics (interests, values, lifestyle)
5. Pain Points and Challenges
6. Goals and Aspirations
7. Preferred Communication Channels
8. Buying Behavior
9. How they would benefit from this business

Format as:
Persona 1: [Name]
- Age: [Age]
- Occupation: [Occupation]
- Income: [Income Level]
- Demographics: [Details]
- Psychographics: [Interests, values, lifestyle]
- Pain Points: [List of challenges]
- Goals: [What they want to achieve]
- Preferred Channels: [How they like to be reached]
- Buying Behavior: [How they make decisions]
- Benefits: [How this business helps them]

Repeat for 3 personas. Make them realistic and diverse.
`

    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        content: data.candidates[0].content.parts[0].text
      }
    } else {
      throw new Error('No content generated from AI')
    }
  } catch (error: any) {
    console.error('AI generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate content'
    }
  }
}

/**
 * Generate business model canvas using Google AI
 */
export async function generateBusinessModelCanvas(request: AIGenerationRequest): Promise<AIGenerationResponse> {
  try {
    const prompt = `
Create a comprehensive Business Model Canvas for ${request.businessName}, a ${request.industry} business.

Business Description: ${request.description || 'Not provided'}
Target Audience: ${request.targetAudience || 'General audience'}
Additional Context: ${request.additionalContext || ''}

Fill out each section of the Business Model Canvas:

1. KEY PARTNERS
- Who are your key partners and suppliers?
- What key resources are you acquiring from partners?

2. KEY ACTIVITIES
- What key activities does your value proposition require?
- What are the most important activities for your business?

3. KEY RESOURCES
- What key resources does your value proposition require?
- What resources are most important for your business?

4. VALUE PROPOSITIONS
- What value do you deliver to your customers?
- What problems do you solve?
- What customer needs do you satisfy?

5. CUSTOMER RELATIONSHIPS
- What type of relationship do your customers expect?
- How do you maintain relationships with customers?

6. CHANNELS
- Through which channels do your customer segments want to be reached?
- How are you reaching them now?

7. CUSTOMER SEGMENTS
- Who are your most important customers?
- What are the different customer segments?

8. COST STRUCTURE
- What are the most important costs in your business model?
- Which key resources/activities are most expensive?

9. REVENUE STREAMS
- For what value are your customers really willing to pay?
- How do you currently generate revenue?

Provide detailed, specific answers for each section based on the business information provided.
`

    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        content: data.candidates[0].content.parts[0].text
      }
    } else {
      throw new Error('No content generated from AI')
    }
  } catch (error: any) {
    console.error('AI generation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate content'
    }
  }
}

/**
 * Parse generated posts into individual post objects
 */
export function parseGeneratedPosts(content: string): Array<{ content: string; hashtags: string[] }> {
  const posts: Array<{ content: string; hashtags: string[] }> = []
  
  // Split content by numbered lines
  const lines = content.split('\n').filter(line => line.trim())
  
  let currentPost = ''
  let currentHashtags: string[] = []
  
  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      // Save previous post if exists
      if (currentPost.trim()) {
        posts.push({
          content: currentPost.trim(),
          hashtags: currentHashtags
        })
      }
      
      // Start new post
      currentPost = line.replace(/^\d+\.\s*/, '')
      currentHashtags = extractHashtags(currentPost)
    } else if (line.trim()) {
      currentPost += ' ' + line.trim()
      currentHashtags = extractHashtags(currentPost)
    }
  }
  
  // Add the last post
  if (currentPost.trim()) {
    posts.push({
      content: currentPost.trim(),
      hashtags: currentHashtags
    })
  }
  
  return posts
}

/**
 * Extract hashtags from text
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g
  return text.match(hashtagRegex) || []
}

/**
 * Parse generated personas into structured data
 */
export function parseGeneratedPersonas(content: string): Array<{
  name: string
  age: string
  occupation: string
  income: string
  demographics: string
  psychographics: string
  painPoints: string[]
  goals: string[]
  preferredChannels: string[]
  buyingBehavior: string
  benefits: string
}> {
  const personas: any[] = []
  
  // Split by persona sections
  const sections = content.split(/Persona \d+:/).filter(section => section.trim())
  
  for (const section of sections) {
    const lines = section.split('\n').filter(line => line.trim())
    const persona: any = {
      painPoints: [],
      goals: [],
      preferredChannels: []
    }
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('- Age:')) {
        persona.age = trimmedLine.replace('- Age:', '').trim()
      } else if (trimmedLine.startsWith('- Occupation:')) {
        persona.occupation = trimmedLine.replace('- Occupation:', '').trim()
      } else if (trimmedLine.startsWith('- Income:')) {
        persona.income = trimmedLine.replace('- Income:', '').trim()
      } else if (trimmedLine.startsWith('- Demographics:')) {
        persona.demographics = trimmedLine.replace('- Demographics:', '').trim()
      } else if (trimmedLine.startsWith('- Psychographics:')) {
        persona.psychographics = trimmedLine.replace('- Psychographics:', '').trim()
      } else if (trimmedLine.startsWith('- Pain Points:')) {
        persona.painPoints = trimmedLine.replace('- Pain Points:', '').trim().split(',').map(p => p.trim())
      } else if (trimmedLine.startsWith('- Goals:')) {
        persona.goals = trimmedLine.replace('- Goals:', '').trim().split(',').map(g => g.trim())
      } else if (trimmedLine.startsWith('- Preferred Channels:')) {
        persona.preferredChannels = trimmedLine.replace('- Preferred Channels:', '').trim().split(',').map(c => c.trim())
      } else if (trimmedLine.startsWith('- Buying Behavior:')) {
        persona.buyingBehavior = trimmedLine.replace('- Buying Behavior:', '').trim()
      } else if (trimmedLine.startsWith('- Benefits:')) {
        persona.benefits = trimmedLine.replace('- Benefits:', '').trim()
      } else if (trimmedLine && !persona.name) {
        persona.name = trimmedLine
      }
    }
    
    if (persona.name) {
      personas.push(persona)
    }
  }
  
  return personas
} 