import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "test_key"
const PAYSTACK_BASE_URL = "https://api.paystack.co"

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { orderId, email, amount, currency = "NGN" } = await request.json()

    // Validate required fields
    if (!orderId || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get order details from database
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        currency,
        reference: `${order.order_number}-${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback`,
        metadata: {
          order_id: orderId,
          order_number: order.order_number,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 400 })
    }

    // Save payment transaction
    const { error: transactionError } = await supabase.from("payment_transactions").insert({
      order_id: orderId,
      store_id: order.store_id,
      reference: paystackData.data.reference,
      gateway: "paystack",
      amount: amount,
      currency,
      status: "pending",
      gateway_response: paystackData.data,
    })

    if (transactionError) {
      console.error("Error saving transaction:", transactionError)
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
    })
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Webhook handler for Paystack
export async function PUT(request: NextRequest) {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    // Verify webhook signature
    const crypto = require("crypto")
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const { reference, amount, currency, status } = event.data

      // Update payment transaction
      const { error: updateError } = await supabase
        .from("payment_transactions")
        .update({
          status: status === "success" ? "paid" : "failed",
          gateway_response: event.data,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", reference)

      if (updateError) {
        console.error("Error updating transaction:", updateError)
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
      }

      // Update order status if payment successful
      if (status === "success") {
        const { data: transaction } = await supabase
          .from("payment_transactions")
          .select("order_id")
          .eq("reference", reference)
          .single()

        if (transaction) {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.order_id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Paystack webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
