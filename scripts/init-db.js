#!/usr/bin/env node

/**
 * Database Initialization Script
 * 
 * This script helps you test your Supabase connection and optionally
 * create sample data for development.
 * 
 * Usage:
 * node scripts/init-db.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables!')
  console.error('Please set up your .env.local file with:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!')
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

async function checkTables() {
  console.log('\n📋 Checking database tables...')
  
  const tables = ['users', 'stores', 'products', 'customers', 'orders']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`✅ Table '${table}': OK`)
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`)
    }
  }
}

async function createSampleData() {
  console.log('\n🎯 Creating sample data...')
  
  try {
    // Create a sample user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'demo@example.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: {
        first_name: 'Demo',
        last_name: 'User'
      }
    })
    
    if (userError) {
      console.log('⚠️  Sample user already exists or error:', userError.message)
    } else {
      console.log('✅ Created sample user: demo@example.com')
    }
    
    // Create a sample store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .insert({
        name: 'Demo Store',
        slug: 'demo-store',
        description: 'A sample store for testing',
        category: 'General',
        owner_id: user?.user?.id || '00000000-0000-0000-0000-000000000000',
        plan: 'free',
        status: 'active'
      })
      .select()
      .single()
    
    if (storeError) {
      console.log('⚠️  Sample store already exists or error:', storeError.message)
    } else {
      console.log('✅ Created sample store: Demo Store')
      
      // Create sample products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .insert([
          {
            store_id: store.id,
            name: 'Sample Product 1',
            description: 'This is a sample product',
            category: 'Electronics',
            price: 29.99,
            stock_quantity: 100,
            status: 'active'
          },
          {
            store_id: store.id,
            name: 'Sample Product 2',
            description: 'Another sample product',
            category: 'Clothing',
            price: 49.99,
            stock_quantity: 50,
            status: 'active'
          }
        ])
        .select()
      
      if (productsError) {
        console.log('⚠️  Error creating sample products:', productsError.message)
      } else {
        console.log('✅ Created 2 sample products')
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message)
  }
}

async function main() {
  console.log('🚀 Supabase Database Initialization\n')
  
  // Test connection
  const connected = await testConnection()
  if (!connected) {
    process.exit(1)
  }
  
  // Check tables
  await checkTables()
  
  // Ask if user wants sample data
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  rl.question('\n🤔 Would you like to create sample data? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await createSampleData()
    } else {
      console.log('⏭️  Skipping sample data creation')
    }
    
    console.log('\n🎉 Setup complete!')
    console.log('\nNext steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Test the API endpoints')
    console.log('3. Check the setup guide: scripts/setup-supabase.md')
    
    rl.close()
  })
}

// Run the script
main().catch(console.error) 