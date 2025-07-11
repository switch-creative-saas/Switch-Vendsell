import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
// import { validateEnv } from '@/lib/config'
// import { DatabaseService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // validateEnv()
    
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // const stores = await DatabaseService.getStoresByOwner(user.id)
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // validateEnv()
    
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, category, logo_url, banner_url, theme_color, custom_domain } = body

    // Validate required fields
    if (!name || !slug || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, category' },
        { status: 400 }
      )
    }

    // const store = await DatabaseService.createStore({
    //   name,
    //   slug,
    //   description,
    //   category,
    //   logo_url,
    //   banner_url,
    //   theme_color,
    //   custom_domain,
    //   owner_id: user.id,
    //   plan: 'free',
    //   status: 'active'
    // })

    return NextResponse.json({ id: 'temp-id', ...body }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating store:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { error: 'Store with this slug or domain already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 