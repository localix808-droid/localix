const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env')
const envContent = fs.readFileSync(envPath, 'utf8')

const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment variables loaded:')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔍 Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  Connection successful, but tables don\'t exist yet')
        console.log('   Error:', error.message)
        console.log('   💡 Run the database schema first: database-schema.sql')
      } else if (error.message.includes('JWT')) {
        console.log('❌ Authentication error - check your anon key')
        console.log('   Error:', error.message)
      } else {
        console.log('❌ Connection failed')
        console.log('   Error:', error.message)
      }
    } else {
      console.log('✅ Database connection successful!')
      console.log('   Data:', data)
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
  }
}

testConnection() 