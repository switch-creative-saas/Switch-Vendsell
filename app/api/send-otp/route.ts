import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'
import { generateOTP, getOTPExpiry } from '@/lib/otp'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Generate OTP
  const otp = generateOTP()
  const expires_at = getOTPExpiry().toISOString()

  // Store OTP in Supabase
  const { error: dbError } = await supabase.from('user_otps').insert({
    email,
    otp,
    expires_at,
  })
  if (dbError) {
    return NextResponse.json({ error: 'Failed to store OTP' }, { status: 500 })
  }

  // Send OTP via Resend
  try {
    await resend.emails.send({
      from: 'Switch VendSell <noreply@switch.store>',
      to: email,
      subject: 'Your Switch VendSell OTP Code',
      html: `<h2>Your OTP Code</h2><p><strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 })
  }
} 