'use client';

import { useState } from 'react';
import ScanForm from '@/components/scan/ScanForm';
import ScanResult from '@/components/scan/ScanResult';

export default function HomePage() {
  const [scanData, setScanData] = useState<Record<string, unknown> | null>(null);
  const [scanning, setScanning] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 md:pt-40">
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse" />
          <div className="absolute top-[20%] right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-20 mix-blend-screen" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-sm transition-transform hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Free &amp; Open Source
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-8xl leading-tight">
              A greener web,<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                one scan at a time.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 leading-relaxed md:text-xl">
              Did you know the internet emits as much CO₂ as the aviation industry?
              <br className="hidden md:block" />
              Measure your website&apos;s carbon footprint instantaneously.
            </p>

            <div className="mt-12">
              <div className="mx-auto max-w-xl rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-md">
                <ScanForm
                  onScanStart={() => { setScanning(true); setScanData(null); }}
                  onScanComplete={(data) => { setScanData(data); setScanning(false); }}
                />
              </div>
              <p className="mt-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
                powered by wassel essalah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scanning animation */}
      {scanning && (
        <section className="pb-20">
          <div className="mx-auto flex max-w-md flex-col items-center gap-8 text-center bg-white/5 p-12 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <div className="absolute inset-2 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-lg shadow-emerald-500/20" />
              <div className="absolute inset-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-2xl">⚡️</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing your digital footprint...</h3>
              <p className="text-sm text-gray-400">Measuring resources, transfer size, and server response.</p>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>
      )}

      {/* Result */}
      {scanData && !scanning && (
        <section className="pb-32 px-6">
          <ScanResult data={scanData as Record<string, unknown> & { url: string; rating: string }} />
        </section>
      )}

      {/* Content Sections (Only visible when not scanning/showing results) */}
      {!scanData && !scanning && (
        <>
          {/* How it works */}
          <section className="border-t border-white/5 py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold text-white md:text-5xl">How It Works</h2>
                  <p className="mt-4 text-lg text-gray-400">
                    We combine Google&apos;s Lighthouse metrics with established carbon estimation formulas to give you actionable insights.
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: '01',
                    title: 'Analyze',
                    desc: 'We fetch your page and analyze 50+ performance metrics including detailed resource breakdown.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    ),
                    color: 'emerald',
                  },
                  {
                    step: '02',
                    title: 'Calculate',
                    desc: 'Using data transfer size and energy intensity data, we estimate the CO₂ grams emitted per visit.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                    ),
                    color: 'blue',
                  },
                  {
                    step: '03',
                    title: 'Improve',
                    desc: 'Get specific recommendations to reduce both load time and carbon emissions simultaneously.',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    ),
                    color: 'purple',
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="group relative rounded-3xl border border-white/10 bg-white/5 p-10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-${item.color}-500/10 blur-3xl transition-opacity group-hover:bg-${item.color}-500/20`} />

                    <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${item.color}-500/10 text-${item.color}-400 ring-1 ring-${item.color}-500/30`}>
                      {item.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-gray-400">{item.desc}</p>

                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                      Step {item.step} <div className="h-px flex-1 bg-white/10 group-hover:bg-white/30 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Persona benefits with Grid */}
          <section className="py-32 relative overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6">
              <div className="text-center mb-20">
                <h2 className="text-3xl font-bold text-white md:text-5xl">Built for the Modern Web</h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-gray-500">
                  Sustainable web development is a team sport.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: '⚡️',
                    title: 'Developers',
                    color: 'emerald',
                    benefits: [
                      'Optimize JS/CSS bundles',
                      'Reduce server load & costs',
                      'Improve Core Web Vitals',
                    ],
                  },
                  {
                    icon: '🚀',
                    title: 'Founders',
                    color: 'blue',
                    benefits: [
                      'Showcase eco-commitment',
                      'Boost SEO rankings',
                      'Attract conscious customers',
                    ],
                  },
                  {
                    icon: '📊',
                    title: 'Consultants',
                    color: 'purple',
                    benefits: [
                      'Generate audit reports',
                      'Track client progress',
                      'Benchmark vs competitors',
                    ],
                  },
                ].map((persona) => (
                  <div
                    key={persona.title}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-black p-8 transition-colors hover:border-white/20"
                  >
                    <div className={`absolute top-0 right-0 p-8 opacity-10 grayscale group-hover:grayscale-0 transition-all text-9xl select-none pointer-events-none`}>
                      {persona.icon}
                    </div>

                    <div className="relative z-10">
                      <span className="text-4xl shadow-amber-50">{persona.icon}</span>
                      <h3 className="mt-6 text-2xl font-bold text-white">{persona.title}</h3>
                      <ul className="mt-6 space-y-4">
                        {persona.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-sm text-gray-400">
                            <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-${persona.color}-500 shadow-[0_0_8px_currentColor]`} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6">
            <div className="mx-auto max-w-5xl rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-black p-8 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/30 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-4xl font-extrabold text-white md:text-6xl tracking-tight">
                  Ready to make an impact?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
                  Join 1,000+ developers building a faster, cleaner internet. Start scanning your projects today.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="/signup"
                    className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-transform hover:scale-105"
                  >
                    Get Started Free
                  </a>
                  <a
                    href="#"
                    className="w-full sm:w-auto rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    View Leaderboard
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
