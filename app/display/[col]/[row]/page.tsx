'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Monitor, Printer, LayoutGrid } from 'lucide-react';
import KpiPaperViewer from '../../../components/KpiPaperViewer';
import { COLUMNS, ROWS, type ColumnSlug, type RowKey } from '../../../data/qaeData';

export default function DisplayDetailPage() {
  const params = useParams<{ col: string; row: string }>();
  const validCol = COLUMNS.some((c) => c.slug === params.col)
    ? (params.col as ColumnSlug)
    : 'quality';
  const validRow = ROWS.some((r) => r.key === params.row)
    ? (params.row as RowKey)
    : 'main';

  return (
    <main className="min-h-dvh bg-[#1c1c1c] text-slate-100 px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Navigation Bar */}
        <header className="no-print flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#252525]/70 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/display"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Board KPI
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Hub
            </Link>
          </div>

          {/* Row Pocket Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ROWS.map((r) => (
              <Link
                key={r.key}
                href={`/display/${validCol}/${r.key}`}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  validRow === r.key
                    ? 'bg-[#0078d4] text-white shadow-md shadow-[#0078d4]/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {r.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak
            </button>
            <Link
              href="/monitor"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              <Monitor className="h-3.5 w-3.5" /> Monitor
            </Link>
          </div>
        </header>

        {/* Pillar Switcher Strip */}
        <div className="no-print flex flex-wrap items-center gap-2">
          {COLUMNS.map((c) => (
            <Link
              key={c.slug}
              href={`/display/${c.slug}/${validRow}`}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                validCol === c.slug
                  ? 'border-[#4cc2ff]/60 bg-[#0078d4]/15 text-[#60cdff]'
                  : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {c.short}
            </Link>
          ))}
        </div>

        {/* Active KPI Paper */}
        <KpiPaperViewer col={validCol} row={validRow} />
      </div>
    </main>
  );
}
