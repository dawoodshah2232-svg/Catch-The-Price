import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

async function getAuthedClient() {
  const supabase = await createAuthServerClient();
  if (!supabase) return { supabase: null, user: null };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch notifications
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    // If notifications table isn't created yet or error, fallback to alert_events
    const { data: alertEvents } = await supabase
      .from('alert_events')
      .select('id, alert_type, message, sent_at, created_at, product_id, products(id,name,slug,image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const fallbackItems = (alertEvents || []).map((e: any) => ({
      id: e.id,
      user_id: user.id,
      type: e.alert_type === 'below_amount' ? 'PRICE_TARGET_REACHED' : 'PRICE_DROP',
      title: 'Price Alert Triggered',
      message: e.message || 'Price dropped on tracked product.',
      link_url: e.products?.slug ? `/ae/product/${e.products.slug}` : undefined,
      product_id: e.product_id,
      data: {},
      is_read: Boolean(e.sent_at),
      created_at: e.created_at,
    }));

    const unreadCount = fallbackItems.filter((i: any) => !i.is_read).length;
    return NextResponse.json({ notifications: fallbackItems, unreadCount });
  }

  const items = notifications || [];
  const unreadCount = items.filter((n) => !n.is_read).length;

  return NextResponse.json({ notifications: items, unreadCount });
}

export async function PATCH(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (body.all === true) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: now })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return NextResponse.json({ error: 'Could not mark all notifications as read' }, { status: 500 });
    }
    return NextResponse.json({ success: true, markedAll: true });
  }

  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) {
    return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: now })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Could not mark notification as read' }, { status: 500 });
  }

  return NextResponse.json({ success: true, id });
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Could not delete notification' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
