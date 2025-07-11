import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json()
  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
  }

  // Get the latest OTP for this email
  const { data: otpRow, error } = await supabase
    .from('user_otps')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !otpRow) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
  }

  // Check expiry
  if (new Date(otpRow.expires_at) < new Date()) {
    return NextResponse.json({ error: 'OTP expired' }, { status: 400 })
  }

  // Mark user as verified in users table
  const { error: updateError } = await supabase
    .from('users')
    .update({ verified: true })
    .eq('email', email)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 })
  }

  // Delete used OTP
  await supabase.from('user_otps').delete().eq('id', otpRow.id)

  return NextResponse.json({ success: true })
} 