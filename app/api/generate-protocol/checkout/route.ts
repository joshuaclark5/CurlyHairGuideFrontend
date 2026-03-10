import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Server Secret Key Missing" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // ✅ LIVE PRICE ID
          price: 'price_1T9G6uPCkUsgy2hxlROZGMLJ',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      // 🚀 THE FIX: This enables the "Add promotion code" link for your 100% off test
      allow_promotion_codes: true, 
      // ✅ Dynamic URL based on environment (Local vs Production)
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/analyze?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/analyze`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('STRIPE ERROR:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}