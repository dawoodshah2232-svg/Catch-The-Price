import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, targetPrice, alertType, email, country } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('watchlists').insert({
        product_id: productId,
        target_price: targetPrice || null,
        alert_type: alertType || 'any_drop',
        email: email || null,
      });

      if (error) {
        console.error('Supabase watchlist error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Price drop tracker activated successfully',
      alert: {
        productId,
        targetPrice,
        alertType,
        country,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error handling alert subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
