// Test script for Gemini API
const GOOGLE_AI_API_KEY = 'AIzaSyBGdnMGI2uoehiq9F_zmXktlxpKb-RtdRQ'
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'

async function testGeminiAPI() {
  try {
    console.log('🧪 Testing Gemini API connection...')
    
    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Please respond with "Gemini API is working correctly!"'
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      console.log('✅ Gemini API is working correctly!')
      console.log('📝 Response:', data.candidates[0].content.parts[0].text)
      return true
    } else {
      console.log('❌ No content generated from AI')
      console.log('📊 Response data:', JSON.stringify(data, null, 2))
      return false
    }
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message)
    return false
  }
}

// Run the test
testGeminiAPI().then(success => {
  if (success) {
    console.log('🎉 Gemini API integration is ready to use!')
  } else {
    console.log('⚠️  Please check your API key and network connection')
  }
}) 