'use client';

import React, { FormEvent, useState } from 'react';
import { ArrowDownRight, BellRing, Check, Mail, Tag } from 'lucide-react';

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubscribed(true); };

  return <section className="max-w-[1600px] mx-auto px-3 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8">
    <div className="relative isolate overflow-hidden rounded-2xl border border-[#21453e] bg-[#081218] px-4 py-5 shadow-[0_16px_38px_rgba(3,25,18,.25)] sm:px-8 sm:py-6 lg:px-10">
      <div className="pointer-events-none absolute -left-20 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[#11d47b]/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-8 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full bg-[#0e5d43]/25 blur-3xl lg:block" aria-hidden="true" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-8">
        <div className="max-w-[680px]">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#69e9a7]/30 bg-[#144a3b]/80 text-[#8af7bd] shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_7px_18px_rgba(0,0,0,.18)] sm:h-12 sm:w-12"><Mail className="h-5 w-5" /></span>
            <div><h2 className="text-[23px] font-black tracking-[-.045em] text-white sm:text-[28px]">Never Miss a <span className="text-[#68eaa5]">Price Drop</span></h2><p className="mt-1 max-w-[560px] text-[12px] leading-relaxed text-[#bdd3ca] sm:text-[13px]">Get instant price alerts, exclusive deals and weekly buying guides.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-[610px] flex-col gap-2 sm:flex-row">
            <input required type="email" name="email" aria-label="Email address" placeholder="Enter your email address" className="h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-white px-4 text-[13px] font-medium text-[#172d24] shadow-[inset_0_1px_0_rgba(255,255,255,.7)] outline-none placeholder:text-[#82938c] focus:border-[#00C16A] focus:ring-2 focus:ring-[#00C16A]/30" />
            <button type="submit" className="h-11 shrink-0 rounded-xl bg-[#00bd68] px-5 text-[13px] font-extrabold text-[#032d1a] shadow-[0_6px_16px_rgba(0,193,106,.24)] transition-all hover:-translate-y-px hover:bg-[#42e795] hover:shadow-[0_9px_20px_rgba(0,193,106,.32)] focus:outline-none focus:ring-2 focus:ring-white/70">{subscribed ? 'Alerts Enabled' : 'Get Price Alerts'}</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-semibold text-[#b8d9cc] sm:gap-x-5">{['Free forever', 'No spam', 'Unsubscribe anytime'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#58efa4]" />{item}</span>)}</div>
        </div>
        <div className="relative mx-auto hidden h-[138px] w-[216px] lg:block" aria-hidden="true">
          <div className="absolute inset-x-0 top-1 overflow-hidden rounded-2xl border border-[#76efae]/30 bg-[linear-gradient(145deg,rgba(23,80,65,.94),rgba(5,24,20,.98))] p-4 shadow-[0_14px_30px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.13)]">
            <div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3ae796]/18 text-[#8bf5bd]"><BellRing className="h-4 w-4" /></span><span className="text-[9px] font-black tracking-[.12em] text-[#d6fbe6]">PRICE ALERT</span></div>
            <div className="mt-2.5 flex items-end justify-between gap-3"><div><p className="text-[12px] font-black tracking-[-.025em] text-white">AED 3,499 <span className="text-[#78ecab]">→ AED 2,899</span></p><p className="mt-0.5 flex items-center gap-1 text-[10px] font-extrabold text-[#76efad]"><ArrowDownRight className="h-3.5 w-3.5" /> AED 600</p></div><svg viewBox="0 0 72 32" className="h-8 w-[72px] shrink-0" fill="none"><path d="M2 5c10 0 12 7 20 7s9-2 16 4 8 10 15 10 10-5 17-7" stroke="#69e9a7" strokeWidth="2.5" strokeLinecap="round" /><path d="M62 21l8-5-3 9" fill="#69e9a7" /></svg></div>
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[9px] font-black tracking-[.08em] text-[#dffceb]"><Tag className="h-3.5 w-3.5 text-[#6ef0ad]" />PRICE DROPPED</div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
