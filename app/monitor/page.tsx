'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Tv,
} from 'lucide-react';
import KpiPaperViewer from '../components/KpiPaperViewer';
import { COLUMNS, type ColumnSlug, type RowKey } from '../data/qaeData';

const SLIDES: { col: ColumnSlug; row: RowKey; label: string }[] = [
  { col: 'quality', row: 'main', label: 'Quality · Main KPI (FPY)' },
  { col: 'quality', row: 'proses', label: 'Quality · Pareto Defect' },
  { col: 'audit', row: 'main', label: 'Audit · Skor LPA Internal' },
  { col: 'engineering', row: 'main', label: 'Engineering · Kalibrasi On-Time' },
  { col: 'safety', row: 'main', label: 'Safety · Zero Accident' },
  { col: 'cost', row: 'main', label: 'Cost · COPQ Reduction' },
  { col: 'hr-dev', row: 'main', label: 'HR-Dev · Skill Matrix' },
  { col: 'hoshin', row: 'kaizen', label: 'Hoshin · Strategy Board' },
];

export default function MonitorSlideshowPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [intervalSec, setIntervalSec] = useState(8);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [playing, intervalSec]);

  const current = useMemo(() => SLIDES[index], [index]);
  const colMeta = COLUMNS.find((c) => c.slug === current.col);

  return (
    <main className="min-h-dvh bg-[#181818] text-slate-100 flex flex-col px-4 py-4 sm:px-6">
      {/* Top TV Control Bar */}
      <header className="max-w-7xl w-full mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#252525]/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Tv className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-2">
                QAEactivity TV Monitor
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                  <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${playing ? 'animate-pulse' : ''}`} />
                  {playing ? 'AUTO' : 'PAUSED'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Slide {index + 1} / {SLIDES.length} · {colMeta?.name} ({current.label})
              </div>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="rounded-xl border border-white/[0.08] bg-white/5 p-2 text-slate-200 hover:bg-white/10 cursor-pointer"
            title="Slide Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0078d4] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1888e0] transition cursor-pointer"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Jeda' : 'Putar'}
          </button>

          <button
            onClick={() => setIndex((prev) => (prev + 1) % SLIDES.length)}
            className="rounded-xl border border-white/[0.08] bg-white/5 p-2 text-slate-200 hover:bg-white/10 cursor-pointer"
            title="Slide Berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <select
            value={intervalSec}
            onChange={(e) => setIntervalSec(Number(e.target.value))}
            className="rounded-xl border border-white/[0.08] bg-[#1c1c1c] px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
          >
            <option value={5}>5 dtk</option>
            <option value={8}>8 dtk</option>
            <option value={15}>15 dtk</option>
          </select>
        </div>
      </header>

      {/* Main Slide Content */}
      <div className="max-w-7xl w-full mx-auto flex-1">
        <KpiPaperViewer col={current.col} row={current.row} compact />
      </div>

      {/* Bottom Slide Indicator Dots */}
      <div className="max-w-7xl w-full mx-auto mt-4 flex flex-wrap items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={`${s.col}-${s.row}`}
            onClick={() => setIndex(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition cursor-pointer ${
              i === index
                ? 'bg-[#0078d4] text-white font-bold'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {i + 1}. {s.label.split(' · ')[0]}
          </button>
        ))}
      </div>
    </main>
  );
}
