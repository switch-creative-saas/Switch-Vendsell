import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
// import { validateEnv } from '@/lib/config'
// import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // validateEnv()
    
    // const store = await DatabaseService.getStore(params.id)
    // if (!store) {
    //   return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    // }

    return NextResponse.json({ id: params.id, name: 'Sample Store' })
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // validateEnv()
    
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this store
    const hasAccess = await AuthService.hasStoreAccess(user.id, params.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updates = {
      name: body.name,
      description: body.description,
      category: body.category,
      logo_url: body.logo_url,
      banner_url: body.banner_url,
      theme_color: body.theme_color,
      custom_domain: body.custom_domain,
      plan: body.plan,
      status: body.status
    }

    // Remove undefined values
    Object.keys(updates).forEach(key => 
      updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates]
    )

    // const store = await DatabaseService.updateStore(params.id, updates)
    return NextResponse.json({ id: params.id, ...updates })
  } catch (error: any) {
    console.error('Error updating store:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // validateEnv()
    
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this store
    const hasAccess = await AuthService.hasStoreAccess(user.id, params.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // await DatabaseService.deleteStore(params.id)
    return NextResponse.json({ message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 