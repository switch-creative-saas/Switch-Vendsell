import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'
import { AuthService } from '@/lib/auth'
import { validateEnv } from '@/lib/config'

export async function GET(request: NextRequest) {
  try {
    validateEnv()
    
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    
    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      )
    }

    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this store
    const hasAccess = await AuthService.hasStoreAccess(user.id, storeId)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const products = await DatabaseService.getProductsByStore(storeId)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    validateEnv()
    
    const user = await AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      store_id,
      name,
      description,
      category,
      price,
      compare_price,
      cost,
      sku,
      stock_quantity,
      weight,
      tags,
      images,
      is_digital,
      track_inventory,
      allow_backorder,
      requires_shipping,
      taxable,
      status
    } = body

    // Validate required fields
    if (!store_id || !name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: store_id, name, category, price' },
        { status: 400 }
      )
    }

    // Check if user has access to this store
    const hasAccess = await AuthService.hasStoreAccess(user.id, store_id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const product = await DatabaseService.createProduct({
      store_id,
      name,
      description,
      category,
      price: parseFloat(price),
      compare_price: compare_price ? parseFloat(compare_price) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      sku,
      stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
      weight: weight ? parseFloat(weight) : undefined,
      tags: tags || [],
      images: images || [],
      is_digital: is_digital || false,
      track_inventory: track_inventory !== false,
      allow_backorder: allow_backorder || false,
      requires_shipping: requires_shipping !== false,
      taxable: taxable !== false,
      status: status || 'draft'
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.code === '23503') { // Foreign key constraint violation
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 