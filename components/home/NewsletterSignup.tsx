'use client';

import React, { FormEvent, useState } from 'react';
import { BarChart3, Check, Mail, ShoppingBag, Tag } from 'lucide-react';

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubscribed(true); };

  return <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-8 sm:pb-12">
    <div className="relative isolate overflow-hidden rounded-2xl border border-[#21453e] bg-[#081218] px-4 py-6 shadow-[0_18px_45px_rgba(3,25,18,.22)] sm:px-8 sm:py-9 lg:px-12 lg:py-11">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#11d47b]/18 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-8 top-1/2 hidden h-52 w-52 -translate-y-1/2 rounded-full border border-[#64efa8]/10 bg-[#0c2d26]/45 blur-[1px] lg:block" aria-hidden="true" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-center">
        <div className="max-w-[760px]">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#69e9a7]/30 bg-[#144a3b]/80 text-[#8af7bd] shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_8px_22px_rgba(0,0,0,.2)] sm:h-14 sm:w-14"><Mail className="h-5 w-5 sm:h-6 sm:w-6" /></span>
            <div><h2 className="text-[23px] font-black tracking-[-.045em] text-white sm:text-[30px]">Never Miss a Price Drop</h2><p className="mt-1.5 sm:mt-2 max-w-[600px] text-[12px] leading-relaxed text-[#b5cec4] sm:text-[14px]">Get instant price alerts, exclusive deals and weekly buying guides.</p></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-[660px] flex-col gap-2 rounded-xl border border-white/15 bg-white/[.08] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-sm sm:flex-row">
            <input required type="email" name="email" aria-label="Email address" placeholder="Enter your email address" className="h-12 min-w-0 flex-1 rounded-lg border border-transparent bg-white px-4 text-[13px] font-medium text-[#172d24] outline-none placeholder:text-[#82938c] focus:border-[#00C16A] focus:ring-2 focus:ring-[#00C16A]/20" />
            <button type="submit" className="h-12 shrink-0 rounded-lg bg-[#00bd68] px-6 text-[13px] font-extrabold text-[#032d1a] shadow-[0_6px_16px_rgba(0,193,106,.25)] transition-all hover:-translate-y-px hover:bg-[#37df8a] hover:shadow-[0_9px_20px_rgba(0,193,106,.32)] focus:outline-none focus:ring-2 focus:ring-white/70">{subscribed ? 'Alerts Enabled' : 'Get Alerts'}</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[#b8d9cc]">{['Free forever', 'No spam', 'Unsubscribe anytime'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#58efa4]" />{item}</span>)}</div>
        </div>
        <div className="relative mx-auto hidden h-[210px] w-[250px] lg:block" aria-hidden="true">
          <div className="absolute right-2 top-3 h-[182px] w-[170px] rounded-[30px] border border-[#76efae]/25 bg-[linear-gradient(145deg,rgba(24,85,68,.8),rgba(9,31,27,.85))] p-5 shadow-[0_18px_35px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.12)]">
            <div className="flex items-center justify-between"><span className="rounded-lg bg-[#3ae796]/18 p-2 text-[#73efb0]"><BarChart3 className="h-5 w-5" /></span><span className="text-[10px] font-black tracking-[.12em] text-[#7eeeb3]">PRICE ALERT</span></div>
            <div className="mt-5 flex items-end gap-1.5"><span className="h-7 w-3 rounded-full bg-[#1d6751]" /><span className="h-11 w-3 rounded-full bg-[#278b68]" /><span className="h-8 w-3 rounded-full bg-[#2bae7b]" /><span className="h-16 w-3 rounded-full bg-[#4ce69b] shadow-[0_0_15px_rgba(76,230,155,.4)]" /><span className="h-12 w-3 rounded-full bg-[#33b47e]" /></div>
            <div className="mt-4 h-px bg-white/10" /><div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-white"><Tag className="h-4 w-4 text-[#6ef0ad]" />Price drop detected</div>
          </div>
          <div className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8cf4bc]/25 bg-[#0e4034] text-[#82f2b7] shadow-[0_10px_22px_rgba(0,0,0,.28)]"><ShoppingBag className="h-6 w-6" /></div>
        </div>
      </div>
    </div>
  </section>;
}
