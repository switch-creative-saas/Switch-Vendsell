import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { phone, message } = await req.json();

  // Replace with your actual values or set in .env.local
  const accessToken = process.env.WHATSAPP_CLOUD_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;

  if (!phone || !message) {
    return NextResponse.json({ error: 'Missing phone or message' }, { status: 400 });
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'text',
    text: { body: message },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
} 