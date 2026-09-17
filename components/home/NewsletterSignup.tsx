'use client';

import React, { FormEvent, useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-10 sm:pt-8 sm:pb-12">
    <div className="relative overflow-hidden rounded-xl border border-[#cfe8db] bg-[linear-gradient(110deg,#f7fffa_0%,#ebfbf2_50%,#d9f7e8_100%)] px-5 py-6 shadow-[0_10px_28px_rgba(18,93,57,.08)] sm:px-8 sm:py-7">
      <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-[#58eaa3]/25 blur-2xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3.5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#087f4e] text-white shadow-[0_5px_12px_rgba(5,111,66,.2)]"><Mail className="h-5 w-5" /></span><div><p className="flex items-center gap-1.5 text-[17px] font-black tracking-[-.035em] text-[#15271f]">Get the best deals first <Sparkles className="h-4 w-4 text-[#f0a126]" /></p><p className="mt-1 max-w-[510px] text-[11px] leading-relaxed text-[#587066]">Weekly price drops, smart buying picks and the deals worth knowing about.</p></div></div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-[470px] rounded-lg border border-[#bfdccf] bg-white p-1.5 shadow-sm">
          <input required type="email" name="email" aria-label="Email address" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#173127] outline-none placeholder:text-[#90a198]" />
          <button type="submit" className="h-9 shrink-0 rounded-md bg-[#087f4e] px-4 text-[11px] font-extrabold text-white transition-colors hover:bg-[#056b40]">{subscribed ? 'Subscribed' : 'Subscribe'}</button>
        </form>
      </div>
    </div>
  </section>;
}
