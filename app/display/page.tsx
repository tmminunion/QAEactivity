'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Layers,
  Lightbulb,
  Monitor,
  Workflow,
} from 'lucide-react';
import { COLUMNS, ROWS, THEME } from '../data/qaeData';

const ROW_META: Record<string, { icon: typeof BarChart3; desc: string }> = {
  main: { icon: BarChart3, desc: 'Capaian per Fiscal Year' },
  sub: { icon: Layers, desc: 'Rincian bulanan per regu' },
  proses: { icon: Workflow, desc: 'Pareto & kontrol proses' },
  kaizen: { icon: Lightbulb, desc: 'Perbaikan & list problem' },
};

export default function DisplayBoardPage() {
  const router = useRouter();

  // Keyboard shortcuts: 1-7 selects pillar main KPI
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < COLUMNS.length) {
        router.push(`/display/${COLUMNS[idx].slug}/main`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#1a0617] px-4 py-4 text-slate-100 sm:px-6 lg:min-h-dvh">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col max-w-7xl w-full mx-auto">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Beranda QAEactivity
            </Link>
            <h1 className="mt-1 bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
              QAE Management Board
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Quality Assurance Engineering · Pilih pilar dan jenis kertas KPI yang ingin ditampilkan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/monitor"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/25"
            >
              <Monitor className="h-4 w-4" /> Monitor Slideshow
            </Link>
            <div className="hidden items-center gap-2 rounded-xl border border-pink-300/20 bg-white/[0.04] px-3 py-2 text-[11px] text-slate-400 backdrop-blur md:flex">
              <span className="font-semibold text-slate-300">Pintasan</span>
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-200">
                1–{COLUMNS.length}
              </kbd>{' '}
              buka pilar
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {COLUMNS.map((c, ci) => {
            const t = THEME[c.slug];
            return (
              <section
                key={c.key}
                className={`group/card relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-pink-300/20 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl transition duration-300 ${t.ring}`}
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover/card:opacity-100 ${t.glow}`}
                />
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.grad}`} />

                <div className="relative mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${t.grad} text-lg font-black text-white shadow-lg shadow-black/40`}
                  >
                    {c.chip}
                  </div>
                  <div className="min-w-0">
                    <h2 className={`truncate text-xl font-extrabold tracking-wide ${t.text}`}>
                      {c.short}
                    </h2>
                    <p className="truncate text-xs text-slate-400">{c.name}</p>
                  </div>
                  <span className={`ml-auto rounded-lg px-2 py-1 font-mono text-xs font-bold ${t.chip}`}>
                    {ci + 1}
                  </span>
                </div>

                <div className="relative grid min-h-[150px] flex-1 grid-cols-2 grid-rows-2 gap-2.5">
                  {ROWS.map((r) => {
                    const m = ROW_META[r.key];
                    const Icon = m.icon;
                    return (
                      <Link
                        key={r.key}
                        href={`/display/${c.slug}/${r.key}`}
                        className="group/btn relative flex flex-col justify-between overflow-hidden rounded-2xl border border-pink-300/20 bg-[#280b23]/60 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#361130]/80 hover:shadow-xl"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${t.grad} opacity-0 transition-opacity duration-200 group-hover/btn:opacity-15`}
                        />
                        <div className="relative flex items-start justify-between">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${t.grad} text-white shadow-md shadow-black/30`}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white" />
                        </div>
                        <div className="relative mt-2">
                          <div className="text-sm font-bold leading-tight text-white">{r.name}</div>
                          <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                            {m.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
