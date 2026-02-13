'use client';

import { useState } from 'react';
import ScanForm from '@/components/scan/ScanForm';
import ScanResult from '@/components/scan/ScanResult';

export default function HomePage() {
  const [scanData, setScanData] = useState<Record<string, unknown> | null>(null);
  const [scanning, setScanning] = useState(false);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-24 md:pt-32">
        {/* Background accents */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free &amp; Open Source
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
              Measure Your<br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Website&apos;s Carbon
              </span>
              <br />Footprint
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
              Instantly analyze any URL. Know your energy consumption, CO₂ emissions,
              and discover how to build a more sustainable web.
            </p>

            <div className="mt-10">
              <ScanForm
                onScanStart={() => { setScanning(true); setScanData(null); }}
                onScanComplete={(data) => { setScanData(data); setScanning(false); }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scanning animation */}
      {scanning && (
        <section className="pb-20">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <div className="absolute inset-4 rounded-full bg-emerald-500/10" />
            </div>
            <p className="text-sm text-gray-400">Analyzing website...</p>
            <p className="text-xs text-gray-600">This may take 15–30 seconds</p>
          </div>
        </section>
      )}

      {/* Result */}
      {scanData && !scanning && (
        <section className="pb-20">
          <ScanResult data={scanData as Record<string, unknown> & { url: string; rating: string }} />
        </section>
      )}

      {/* How it works */}
      {!scanData && !scanning && (
        <>
          <section className="border-t border-white/5 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="text-center text-3xl font-extrabold text-white">How It Works</h2>
              <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
                Three steps to understand your website&apos;s environmental impact
              </p>

              <div className="mt-14 grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: '01',
                    title: 'Enter URL',
                    desc: 'Paste any public URL and hit Scan. We run a full Lighthouse analysis server-side.',
                    accent: 'from-emerald-400/20 to-transparent',
                  },
                  {
                    step: '02',
                    title: 'Get Your Score',
                    desc: 'Receive an Éco-Score (0–100), CO₂ estimate, energy usage, and resource breakdown.',
                    accent: 'from-yellow-400/20 to-transparent',
                  },
                  {
                    step: '03',
                    title: 'Compare & Improve',
                    desc: 'See how you rank against benchmarks. Track progress over time with your dashboard.',
                    accent: 'from-red-400/20 to-transparent',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-white/10"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
                    <div className="relative">
                      <span className="text-5xl font-black text-white/5">{item.step}</span>
                      <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Persona benefits */}
          <section className="border-t border-white/5 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="text-center text-3xl font-extrabold text-white">Built For You</h2>
              <p className="mx-auto mt-3 max-w-lg text-center text-gray-500">
                Whether you&apos;re a developer, founder, or consultant
              </p>

              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {[
                  {
                    emoji: '🧑‍💻',
                    title: 'Developers',
                    benefits: [
                      'Technical resource breakdown (JS, CSS, Images)',
                      'Lighthouse performance integration',
                      'Track optimization progress',
                    ],
                  },
                  {
                    emoji: '🏢',
                    title: 'Startup Founders',
                    benefits: [
                      'Simple Green / Moderate / Heavy rating',
                      'Shareable public scan results',
                      'Benchmark against competitors',
                    ],
                  },
                  {
                    emoji: '🌍',
                    title: 'Sustainability Consultants',
                    benefits: [
                      'Historical scan comparison',
                      'Evolution charts over time',
                      'Structured data for reports',
                    ],
                  },
                ].map((persona) => (
                  <div
                    key={persona.title}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-8"
                  >
                    <span className="text-4xl">{persona.emoji}</span>
                    <h3 className="mt-4 text-lg font-bold text-white">{persona.title}</h3>
                    <ul className="mt-4 space-y-2">
                      {persona.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-white/5 py-20">
            <div className="mx-auto max-w-2xl text-center px-6">
              <h2 className="text-3xl font-extrabold text-white">
                Start scanning now.
              </h2>
              <p className="mt-4 text-gray-500">
                Create a free account to save your scans, track progress, and share results.
              </p>
              <a
                href="/signup"
                className="mt-8 inline-block rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]"
              >
                Get Started Free
              </a>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
