'use client';

import React, { FormEvent, useState } from 'react';
import { BarChart3, Check, Mail, Tag } from 'lucide-react';

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
        <div className="relative mx-auto hidden h-[138px] w-[205px] lg:block" aria-hidden="true">
          <div className="absolute inset-x-0 top-1 rounded-2xl border border-[#76efae]/25 bg-[linear-gradient(145deg,rgba(24,85,68,.88),rgba(8,28,24,.94))] p-4 shadow-[0_14px_30px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.12)]">
            <div className="flex items-center justify-between"><span className="rounded-lg bg-[#3ae796]/18 p-1.5 text-[#73efb0]"><BarChart3 className="h-4 w-4" /></span><span className="text-[9px] font-black tracking-[.12em] text-[#7eeeb3]">PRICE ALERT</span></div>
            <div className="mt-3 flex items-end gap-1.5"><span className="h-5 w-2.5 rounded-full bg-[#1d6751]" /><span className="h-8 w-2.5 rounded-full bg-[#278b68]" /><span className="h-6 w-2.5 rounded-full bg-[#2bae7b]" /><span className="h-11 w-2.5 rounded-full bg-[#4ce69b] shadow-[0_0_12px_rgba(76,230,155,.38)]" /><span className="h-8 w-2.5 rounded-full bg-[#33b47e]" /></div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-2.5 text-[10px] font-bold text-white"><Tag className="h-3.5 w-3.5 text-[#6ef0ad]" />Price drop detected</div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
