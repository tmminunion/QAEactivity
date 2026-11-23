'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, Sparkles, Users } from 'lucide-react';
import { ACTIVITY_PROGRAMS } from '../../data/qaeData';

export default function ActivityDetailPage() {
  const params = useParams<{ slug: string }>();
  const program =
    ACTIVITY_PROGRAMS.find((a) => a.slug === params.slug) ?? ACTIVITY_PROGRAMS[0];

  return (
    <main className="min-h-dvh bg-[#070b14] text-slate-100 px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke QAEactivity Hub
            </Link>
            <div className="mt-2 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${program.gradient} text-white font-black text-base shadow-lg`}
              >
                {program.code}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{program.title}</h1>
                <p className={`text-xs font-semibold ${program.accent}`}>{program.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ACTIVITY_PROGRAMS.map((a) => (
              <Link
                key={a.slug}
                href={`/activity/${a.slug}`}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  a.slug === program.slug
                    ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {a.code}
              </Link>
            ))}
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300 flex flex-wrap items-center justify-between gap-3">
          <span>{program.desc}</span>
          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-mono font-bold text-cyan-300">
            {program.highlight}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {program.records.map((rec) => (
            <div
              key={rec.id}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{rec.id}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      rec.status === 'Selesai'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : rec.status === 'On Progress'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    }`}
                  >
                    {rec.status === 'Selesai' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {rec.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">{rec.theme}</h3>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{rec.team}</span>
                  <span>·</span>
                  <span className="text-slate-300 font-semibold">PIC: {rec.pic}</span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-mono font-bold text-white">{rec.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${program.gradient}`}
                    style={{ width: `${rec.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Dampak:</span>
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-300">
                    <Sparkles className="w-3 h-3" /> {rec.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
