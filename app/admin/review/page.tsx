import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { ReviewQueueClient } from './ReviewQueueClient';

export const metadata = {
  title: 'Exception & Review Queues | Admin',
};

export default async function ReviewPage() {
  const supabase = getServerSupabase();
  let items: any[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('human_review_queue')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(100);
    items = data || [];
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Human Review & Exception Queues</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Items where automated confidence was below threshold, requiring manual administrator verification.
        </p>
      </div>

      <ReviewQueueClient initialItems={items} />
    </div>
  );
}
