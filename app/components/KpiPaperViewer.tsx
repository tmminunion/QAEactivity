'use client';

import React, { useMemo, useState } from 'react';
import {
  COLUMNS,
  MONTHS,
  POCKETS,
  THEME,
  type ColumnSlug,
  type PocketData,
  type RowKey,
} from '../data/qaeData';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Layers,
  Sparkles,
  Car,
} from 'lucide-react';

interface KpiPaperViewerProps {
  col: ColumnSlug;
  row: RowKey;
  compact?: boolean;
}

type ModelKey = 'innova' | 'fortuner' | 'zenix';

const MODEL_META: {
  key: ModelKey;
  label: string;
  color: string;
  dotClass: string;
  textClass: string;
  cardClass: string;
}[] = [
  {
    key: 'innova',
    label: 'Innova',
    color: '#38bdf8',
    dotClass: 'bg-sky-400',
    textClass: 'text-sky-300',
    cardClass: 'border-sky-500/25 bg-sky-500/[0.06]',
  },
  {
    key: 'fortuner',
    label: 'Fortuner',
    color: '#f59e0b',
    dotClass: 'bg-amber-400',
    textClass: 'text-amber-300',
    cardClass: 'border-amber-500/25 bg-amber-500/[0.06]',
  },
  {
    key: 'zenix',
    label: 'Zenix',
    color: '#a78bfa',
    dotClass: 'bg-violet-400',
    textClass: 'text-violet-300',
    cardClass: 'border-violet-500/25 bg-violet-500/[0.06]',
  },
];

export default function KpiPaperViewer({ col, row, compact = false }: KpiPaperViewerProps) {
  const pocket: PocketData = POCKETS[col]?.[row] ?? POCKETS.quality.main;
  const colMeta = COLUMNS.find((c) => c.slug === col) ?? COLUMNS[0];
  const theme = THEME[col] ?? THEME.quality;

  const [shiftFilter, setShiftFilter] = useState<'all' | 'red' | 'white'>('all');
  const [modelFilter, setModelFilter] = useState<'all' | ModelKey>('all');
  const [kaizenFilter, setKaizenFilter] = useState<'all' | 'Selesai' | 'Proses' | 'Belum'>('all');

  const isModelSeries = Boolean(pocket.series?.models);

  const chartModel = useMemo(() => {
    if (!pocket.series) return null;
    const s = pocket.series;

    const allSeriesArrays: (number | null)[][] = s.models
      ? [s.models.innova, s.models.fortuner, s.models.zenix]
      : [s.red ?? [], s.white ?? []];

    const vals = [
      ...allSeriesArrays.flat().filter((v): v is number => v !== null),
      s.target,
    ];
    const minRaw = Math.min(...vals);
    const maxRaw = Math.max(...vals);
    const span = Math.max(maxRaw - minRaw, s.dec > 0 ? 0.1 : 2);
    const yMin = Math.max(0, minRaw - span * 0.25);
    const yMax = Math.min(s.unit === '%' ? 100.5 : Infinity, maxRaw + span * 0.25);

    const W = 760;
    const H = 250;
    const padL = 52;
    const padR = 24;
    const padT = 22;
    const padB = 34;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const xAt = (i: number) => padL + (i / (MONTHS.length - 1)) * plotW;
    const yAt = (v: number) => padT + ((yMax - v) / (yMax - yMin || 1)) * plotH;

    const buildPath = (arr: (number | null)[]) => {
      let d = '';
      arr.forEach((v, i) => {
        if (v === null) return;
        const cmd = d === '' ? 'M' : 'L';
        d += `${cmd}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)} `;
      });
      return d.trim();
    };

    const latestOf = (arr?: (number | null)[]) =>
      arr ? [...arr].reverse().find((v) => v !== null) ?? null : null;

    return {
      W,
      H,
      padL,
      padR,
      padT,
      padB,
      yMin,
      yMax,
      xAt,
      yAt,
      targetY: yAt(s.target),
      // Shift mode
      redPath: buildPath(s.red ?? []),
      whitePath: buildPath(s.white ?? []),
      latestRed: latestOf(s.red),
      latestWhite: latestOf(s.white),
      // Model mode (Innova, Fortuner, Zenix)
      modelPaths: s.models
        ? {
            innova: buildPath(s.models.innova),
            fortuner: buildPath(s.models.fortuner),
            zenix: buildPath(s.models.zenix),
          }
        : null,
      latestModels: s.models
        ? {
            innova: latestOf(s.models.innova),
            fortuner: latestOf(s.models.fortuner),
            zenix: latestOf(s.models.zenix),
          }
        : null,
    };
  }, [pocket.series]);

  const isTargetMet = (val: number | null, target: number, lower: boolean) => {
    if (val === null) return null;
    return lower ? val <= target : val >= target;
  };

  const filteredKaizenItems = useMemo(() => {
    if (!pocket.items) return [];
    if (kaizenFilter === 'all') return pocket.items;
    return pocket.items.filter((i) => i.status === kaizenFilter);
  }, [pocket.items, kaizenFilter]);

  return (
    <div className="w-full rounded-xl border border-white/[0.12] bg-[#252525]/85 text-slate-100 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Top Paper Header Strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.grad}`} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#1c1c1c]/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${theme.grad} text-base font-black text-white shadow-lg`}
          >
            {colMeta.chip}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${theme.text}`}>
                {colMeta.short} · {row.toUpperCase()} KPI
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                FY 2026/2027
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {pocket.title}
            </h2>
            <p className="text-xs text-slate-400">{pocket.subtitle}</p>
          </div>
        </div>

        {/* Interactive Filter Controls */}
        {(pocket.template === 'main' || pocket.template === 'sub') && isModelSeries && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#252525]/90 p-1 text-xs">
            <button
              onClick={() => setModelFilter('all')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer ${
                modelFilter === 'all'
                  ? 'bg-[#0078d4] text-white'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Semua Model
            </button>
            {MODEL_META.map((m) => (
              <button
                key={m.key}
                onClick={() => setModelFilter(m.key)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer ${
                  modelFilter === m.key
                    ? 'bg-[#0078d4] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}

        {(pocket.template === 'main' || pocket.template === 'sub') && !isModelSeries && (
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#252525]/90 p-1 text-xs">
            {(['all', 'red', 'white'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setShiftFilter(mode)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer ${
                  shiftFilter === mode
                    ? 'bg-[#0078d4] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {mode === 'all' ? 'Semua Regu' : mode === 'red' ? 'Regu Red' : 'Regu White'}
              </button>
            ))}
          </div>
        )}

        {pocket.template === 'kaizen' && (
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#252525]/90 p-1 text-xs">
            {(['all', 'Selesai', 'Proses', 'Belum'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setKaizenFilter(st)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer ${
                  kaizenFilter === st
                    ? 'bg-[#0078d4] text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body Content by Template */}
      <div className={compact ? 'p-4 sm:p-5 space-y-4' : 'p-5 sm:p-6 space-y-6'}>
        {/* 1A. MODEL-BASED MAIN KPI (INNOVA / FORTUNER / ZENIX - OK RATIO) */}
        {(pocket.template === 'main' || pocket.template === 'sub') &&
          isModelSeries &&
          pocket.series?.models &&
          chartModel?.modelPaths &&
          chartModel.latestModels && (
            <div className="space-y-5">
              {/* 4 Summary Cards: Target + Innova + Fortuner + Zenix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Target OK Ratio
                    </div>
                    <div className="mt-1 text-2xl font-black text-white font-mono">
                      {pocket.series.lower ? '≤ ' : '≥ '}
                      {pocket.series.target.toFixed(pocket.series.dec)} {pocket.series.unit}
                    </div>
                  </div>
                  <Target className="w-7 h-7 text-[#4cc2ff] opacity-80" />
                </div>

                {MODEL_META.map((m) => {
                  const val = chartModel.latestModels![m.key];
                  const ok = isTargetMet(val, pocket.series!.target, pocket.series!.lower);
                  return (
                    <div
                      key={m.key}
                      className={`rounded-lg border p-3.5 flex items-center justify-between ${m.cardClass}`}
                    >
                      <div>
                        <div
                          className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${m.textClass}`}
                        >
                          <Car className="w-3.5 h-3.5" />
                          OK Ratio · {m.label}
                        </div>
                        <div className="mt-1 text-2xl font-black text-white font-mono">
                          {val !== null ? `${val.toFixed(pocket.series!.dec)}${pocket.series!.unit}` : '-'}
                        </div>
                      </div>
                      {ok ? (
                        <TrendingUp className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-7 h-7 text-amber-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SVG Multi-Model Chart */}
              <div className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/70 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    {MODEL_META.filter((m) => modelFilter === 'all' || modelFilter === m.key).map(
                      (m) => (
                        <span
                          key={m.key}
                          className={`flex items-center gap-1.5 font-semibold ${m.textClass}`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${m.dotClass}`} /> {m.label}
                        </span>
                      )
                    )}
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                      <span className="h-0.5 w-4 border-t-2 border-dashed border-emerald-400" /> Target (
                      {pocket.series.target}
                      {pocket.series.unit})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    Breakdown per Model (Innova · Fortuner · Zenix)
                  </span>
                </div>

                <svg
                  viewBox={`0 0 ${chartModel.W} ${chartModel.H}`}
                  className="w-full h-auto max-h-[280px] overflow-visible"
                >
                  {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                    const val = chartModel.yMin + t * (chartModel.yMax - chartModel.yMin);
                    const y = chartModel.yAt(val);
                    return (
                      <g key={t}>
                        <line
                          x1={chartModel.padL}
                          y1={y}
                          x2={chartModel.W - chartModel.padR}
                          y2={y}
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="1"
                        />
                        <text
                          x={chartModel.padL - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 text-[10px] font-mono"
                        >
                          {val.toFixed(pocket.series!.dec)}
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={chartModel.padL}
                    y1={chartModel.targetY}
                    x2={chartModel.W - chartModel.padR}
                    y2={chartModel.targetY}
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />

                  {MODEL_META.filter((m) => modelFilter === 'all' || modelFilter === m.key).map(
                    (m, mIdx) => {
                      const arr = pocket.series!.models![m.key];
                      const pathD = chartModel.modelPaths![m.key];
                      const labelOffset = mIdx === 0 ? -9 : mIdx === 1 ? 15 : -17;
                      return (
                        <g key={m.key}>
                          <path
                            d={pathD}
                            fill="none"
                            stroke={m.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {arr.map((v, i) =>
                            v !== null ? (
                              <g key={`${m.key}-${i}`}>
                                <circle
                                  cx={chartModel.xAt(i)}
                                  cy={chartModel.yAt(v)}
                                  r="4.5"
                                  fill={m.color}
                                  stroke="#0f172a"
                                  strokeWidth="2"
                                />
                                {(modelFilter !== 'all' || i === 0 || i === 7) && (
                                  <text
                                    x={chartModel.xAt(i)}
                                    y={chartModel.yAt(v) + labelOffset}
                                    textAnchor="middle"
                                    fill={m.color}
                                    className="text-[10px] font-mono font-bold"
                                  >
                                    {v.toFixed(pocket.series!.dec)}
                                  </text>
                                )}
                              </g>
                            ) : null
                          )}
                        </g>
                      );
                    }
                  )}

                  {MONTHS.map((m, i) => (
                    <text
                      key={m}
                      x={chartModel.xAt(i)}
                      y={chartModel.H - 8}
                      textAnchor="middle"
                      className="fill-slate-400 text-[11px] font-mono"
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Monthly Data Table by Model */}
              <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
                <table className="w-full text-center text-xs font-mono">
                  <thead className="bg-[#1c1c1c]/80 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 text-left font-sans">Model / Bulan</th>
                      {MONTHS.map((m) => (
                        <th key={m} className="px-2 py-2">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#252525]/50">
                    {MODEL_META.filter((m) => modelFilter === 'all' || modelFilter === m.key).map(
                      (m) => (
                        <tr key={m.key}>
                          <td className={`px-3 py-2 text-left font-sans font-bold ${m.textClass}`}>
                            {m.label}
                          </td>
                          {pocket.series!.models![m.key].map((v, i) => {
                            const ok = isTargetMet(v, pocket.series!.target, pocket.series!.lower);
                            return (
                              <td
                                key={i}
                                className={`px-2 py-2 ${
                                  ok === null
                                    ? 'text-slate-600'
                                    : ok
                                      ? 'text-emerald-300 font-bold'
                                      : 'text-amber-300 font-bold'
                                }`}
                              >
                                {v !== null ? v.toFixed(pocket.series!.dec) : '—'}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* 1B. SHIFT-BASED SUB KPI (RED / WHITE) */}
        {(pocket.template === 'main' || pocket.template === 'sub') &&
          !isModelSeries &&
          pocket.series &&
          chartModel && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Target FY26
                    </div>
                    <div className="mt-1 text-2xl font-black text-white font-mono">
                      {pocket.series.lower ? '≤ ' : '≥ '}
                      {pocket.series.target.toFixed(pocket.series.dec)} {pocket.series.unit}
                    </div>
                  </div>
                  <Target className="w-7 h-7 text-[#4cc2ff] opacity-80" />
                </div>

                <div className="rounded-lg border border-rose-500/25 bg-rose-500/[0.06] p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                      Aktual Terakhir · Regu Red
                    </div>
                    <div className="mt-1 text-2xl font-black text-white font-mono">
                      {chartModel.latestRed !== null
                        ? `${chartModel.latestRed.toFixed(pocket.series.dec)} ${pocket.series.unit}`
                        : '-'}
                    </div>
                  </div>
                  {isTargetMet(chartModel.latestRed, pocket.series.target, pocket.series.lower) ? (
                    <TrendingUp className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-amber-400" />
                  )}
                </div>

                <div className="rounded-lg border border-sky-500/25 bg-sky-500/[0.06] p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-300">
                      Aktual Terakhir · Regu White
                    </div>
                    <div className="mt-1 text-2xl font-black text-white font-mono">
                      {chartModel.latestWhite !== null
                        ? `${chartModel.latestWhite.toFixed(pocket.series.dec)} ${pocket.series.unit}`
                        : '-'}
                    </div>
                  </div>
                  {isTargetMet(chartModel.latestWhite, pocket.series.target, pocket.series.lower) ? (
                    <TrendingUp className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-amber-400" />
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/70 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4">
                    {(shiftFilter === 'all' || shiftFilter === 'red') && (
                      <span className="flex items-center gap-1.5 font-semibold text-rose-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Regu Red
                      </span>
                    )}
                    {(shiftFilter === 'all' || shiftFilter === 'white') && (
                      <span className="flex items-center gap-1.5 font-semibold text-sky-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Regu White
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                      <span className="h-0.5 w-4 border-t-2 border-dashed border-emerald-400" /> Target (
                      {pocket.series.target})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    Satuan: {pocket.series.unit} (
                    {pocket.series.lower ? 'Makin Kecil Makin Baik' : 'Makin Besar Makin Baik'})
                  </span>
                </div>

                <svg
                  viewBox={`0 0 ${chartModel.W} ${chartModel.H}`}
                  className="w-full h-auto max-h-[280px] overflow-visible"
                >
                  {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                    const val = chartModel.yMin + t * (chartModel.yMax - chartModel.yMin);
                    const y = chartModel.yAt(val);
                    return (
                      <g key={t}>
                        <line
                          x1={chartModel.padL}
                          y1={y}
                          x2={chartModel.W - chartModel.padR}
                          y2={y}
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="1"
                        />
                        <text
                          x={chartModel.padL - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 text-[10px] font-mono"
                        >
                          {val.toFixed(pocket.series!.dec)}
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={chartModel.padL}
                    y1={chartModel.targetY}
                    x2={chartModel.W - chartModel.padR}
                    y2={chartModel.targetY}
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />

                  {(shiftFilter === 'all' || shiftFilter === 'red') && (
                    <>
                      <path
                        d={chartModel.redPath}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {(pocket.series.red ?? []).map((v, i) =>
                        v !== null ? (
                          <g key={`r-${i}`}>
                            <circle
                              cx={chartModel.xAt(i)}
                              cy={chartModel.yAt(v)}
                              r="4.5"
                              fill="#f43f5e"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            <text
                              x={chartModel.xAt(i)}
                              y={chartModel.yAt(v) - 9}
                              textAnchor="middle"
                              className="fill-rose-200 text-[10px] font-mono font-bold"
                            >
                              {v.toFixed(pocket.series!.dec)}
                            </text>
                          </g>
                        ) : null
                      )}
                    </>
                  )}

                  {(shiftFilter === 'all' || shiftFilter === 'white') && (
                    <>
                      <path
                        d={chartModel.whitePath}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {(pocket.series.white ?? []).map((v, i) =>
                        v !== null ? (
                          <g key={`w-${i}`}>
                            <circle
                              cx={chartModel.xAt(i)}
                              cy={chartModel.yAt(v)}
                              r="4.5"
                              fill="#38bdf8"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            <text
                              x={chartModel.xAt(i)}
                              y={chartModel.yAt(v) + 15}
                              textAnchor="middle"
                              className="fill-sky-200 text-[10px] font-mono font-bold"
                            >
                              {v.toFixed(pocket.series!.dec)}
                            </text>
                          </g>
                        ) : null
                      )}
                    </>
                  )}

                  {MONTHS.map((m, i) => (
                    <text
                      key={m}
                      x={chartModel.xAt(i)}
                      y={chartModel.H - 8}
                      textAnchor="middle"
                      className="fill-slate-400 text-[11px] font-mono"
                    >
                      {m}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
                <table className="w-full text-center text-xs font-mono">
                  <thead className="bg-[#1c1c1c]/80 text-slate-300">
                    <tr>
                      <th className="px-3 py-2 text-left font-sans">Regu / Bulan</th>
                      {MONTHS.map((m) => (
                        <th key={m} className="px-2 py-2">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-[#252525]/50">
                    {(shiftFilter === 'all' || shiftFilter === 'red') && (
                      <tr>
                        <td className="px-3 py-2 text-left font-sans font-bold text-rose-300">Red</td>
                        {(pocket.series.red ?? []).map((v, i) => {
                          const ok = isTargetMet(v, pocket.series!.target, pocket.series!.lower);
                          return (
                            <td
                              key={i}
                              className={`px-2 py-2 ${
                                ok === null
                                  ? 'text-slate-600'
                                  : ok
                                    ? 'text-emerald-300 font-bold'
                                    : 'text-amber-300 font-bold'
                              }`}
                            >
                              {v !== null ? v.toFixed(pocket.series!.dec) : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                    {(shiftFilter === 'all' || shiftFilter === 'white') && (
                      <tr>
                        <td className="px-3 py-2 text-left font-sans font-bold text-sky-300">
                          White
                        </td>
                        {(pocket.series.white ?? []).map((v, i) => {
                          const ok = isTargetMet(v, pocket.series!.target, pocket.series!.lower);
                          return (
                            <td
                              key={i}
                              className={`px-2 py-2 ${
                                ok === null
                                  ? 'text-slate-600'
                                  : ok
                                    ? 'text-emerald-300 font-bold'
                                    : 'text-amber-300 font-bold'
                              }`}
                            >
                              {v !== null ? v.toFixed(pocket.series!.dec) : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* 2. PROSES KPI (PARETO) */}
        {pocket.template === 'proses' && pocket.causes && (
          <div className="space-y-4">
            <div className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <BarChart3 className="w-4 h-4 text-[#4cc2ff]" />
                  Stratifikasi Pareto Penyebab Utama
                </span>
                <span className="font-mono">
                  Total: {pocket.causes.reduce((a, b) => a + b.v, 0).toFixed(1)}
                </span>
              </div>

              {(() => {
                const total = pocket.causes!.reduce((a, b) => a + b.v, 0) || 1;
                const maxVal = Math.max(...pocket.causes!.map((c) => c.v), 1);
                let cum = 0;
                return (
                  <div className="space-y-3">
                    {pocket.causes!.map((c, idx) => {
                      cum += c.v;
                      const pct = Math.round((c.v / total) * 100);
                      const cumPct = Math.round((cum / total) * 100);
                      const widthPct = Math.max(6, Math.round((c.v / maxVal) * 100));
                      return (
                        <div key={c.n} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">
                              {idx + 1}. {c.n}
                            </span>
                            <span className="font-mono text-slate-300">
                              <strong className="text-white">{c.v}</strong> ({pct}% · Kum{' '}
                              {cumPct}%)
                            </span>
                          </div>
                          <div className="h-3.5 w-full rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${theme.grad}`}
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {pocket.conclusion && (
              <div className="rounded-lg border border-[#0078d4]/30 bg-[#0078d4]/10 p-4 text-xs sm:text-sm text-sky-100">
                <span className="font-bold text-[#60cdff]">Kesimpulan Pareto: </span>
                {pocket.conclusion}
              </div>
            )}
          </div>
        )}

        {/* 3. KAIZEN / LIST PROBLEM */}
        {pocket.template === 'kaizen' && pocket.items && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1c1c1c]/80 text-slate-300 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-3">No</th>
                    <th className="px-3 py-3">Problem / Temuan</th>
                    <th className="px-3 py-3">Countermeasure / Kaizen</th>
                    <th className="px-3 py-3">Before → After</th>
                    <th className="px-3 py-3">PIC</th>
                    <th className="px-3 py-3">Due</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#252525]/40">
                  {filteredKaizenItems.map((item) => (
                    <tr key={item.no} className="hover:bg-white/[0.03] transition">
                      <td className="px-3 py-3 font-mono font-bold text-slate-400">{item.no}</td>
                      <td className="px-3 py-3 font-semibold text-white">{item.problem}</td>
                      <td className="px-3 py-3 text-slate-300">{item.countermeasure}</td>
                      <td className="px-3 py-3 font-mono text-[11px]">
                        <span className="text-rose-300">{item.beforeVal || '-'}</span>
                        <span className="mx-1 text-slate-500">→</span>
                        <span className="text-emerald-300 font-bold">{item.afterVal || '-'}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{item.pic}</td>
                      <td className="px-3 py-3 font-mono text-slate-400 whitespace-nowrap">
                        {item.due}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                            item.status === 'Selesai'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : item.status === 'Proses'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {item.status === 'Selesai' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : item.status === 'Proses' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. HOSHIN MAIN */}
        {pocket.template === 'hoshin-main' && pocket.hoshinMain && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Company Hoshin
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{pocket.hoshinMain.coy}</p>
              </div>
              <div className="rounded-lg border border-[#0078d4]/30 bg-[#0078d4]/10 p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#60cdff]">
                  QAE Direction &amp; Target
                </div>
                <p className="mt-1 text-sm font-semibold text-white">{pocket.hoshinMain.dir}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Refleksi FY25
                </h3>
                {pocket.hoshinMain.reflection.map((r) => (
                  <div key={r.title} className="space-y-1">
                    <div className="text-xs font-bold text-amber-300">{r.title}</div>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-0.5">
                      {r.lines.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/60 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Strategi Utama FY26
                </h3>
                {pocket.hoshinMain.strategy.map((s) => (
                  <div key={s.heading} className="space-y-1">
                    <div className="text-xs font-bold text-[#60cdff]">{s.heading}</div>
                    <ul className="list-disc pl-4 text-xs text-slate-300 space-y-0.5">
                      {s.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pocket.hoshinMain.kpi.map((k) => (
                <div
                  key={k.label}
                  className={`rounded-lg border p-3.5 ${
                    k.hl
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-white/[0.08] bg-white/[0.03]'
                  }`}
                >
                  <div className="text-sm font-black text-white">{k.label}</div>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-300">
                    {k.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. HOSHIN ACTION PLAN */}
        {pocket.template === 'hoshin-plan' && pocket.actionPlan && (
          <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c]/80 text-slate-300 text-[11px] uppercase">
                <tr>
                  <th className="px-3 py-3">No</th>
                  <th className="px-3 py-3">KRA / Pilar</th>
                  <th className="px-3 py-3">KPI</th>
                  <th className="px-3 py-3">Target</th>
                  <th className="px-3 py-3">Aktual</th>
                  <th className="px-3 py-3">Aktivitas Utama</th>
                  <th className="px-3 py-3">PIC</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#252525]/40">
                {pocket.actionPlan.map((rowItem) => (
                  <tr key={rowItem.no} className="hover:bg-white/[0.03]">
                    <td className="px-3 py-3 font-mono text-slate-400">{rowItem.no}</td>
                    <td className="px-3 py-3 font-bold text-amber-300">{rowItem.kra}</td>
                    <td className="px-3 py-3 font-semibold text-white">{rowItem.kpiName}</td>
                    <td className="px-3 py-3 font-mono text-emerald-300">{rowItem.target}</td>
                    <td className="px-3 py-3 font-mono text-[#60cdff]">{rowItem.current}</td>
                    <td className="px-3 py-3 text-slate-300">{rowItem.activity}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-slate-200">{rowItem.pic}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                          rowItem.status === 'Done'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : rowItem.status === 'On Track'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {rowItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. HOSHIN KPI TREE */}
        {pocket.template === 'hoshin-tree' && pocket.kpiTree && (
          <div className="space-y-3">
            {pocket.kpiTree.map((node) => (
              <div
                key={node.pillar}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg border border-white/[0.08] bg-[#1c1c1c]/60 p-4 items-center"
              >
                <div className="md:col-span-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-black text-sm text-white">{node.pillar}</span>
                </div>
                <div className="md:col-span-3 rounded-xl bg-amber-500/10 border border-amber-500/25 p-2.5 text-xs font-bold text-amber-200 whitespace-pre-line">
                  {node.main}
                </div>
                <div className="md:col-span-3 rounded-xl bg-sky-500/10 border border-sky-500/25 p-2.5 text-xs text-sky-200 space-y-1">
                  {node.sub.map((s) => (
                    <div key={s}>• {s}</div>
                  ))}
                </div>
                <div className="md:col-span-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-200 space-y-1">
                  {node.process.map((p) => (
                    <div key={p}>✓ {p}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 7. HOSHIN STRATEGY BOARD */}
        {pocket.template === 'hoshin-strategy' && pocket.strategyGroups && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pocket.strategyGroups.map((g) => (
              <div
                key={g.letter}
                className="rounded-lg border border-white/[0.08] bg-[#1c1c1c]/60 p-4 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-white">
                    {g.letter}
                  </span>
                  <span className="font-extrabold text-sm text-white">{g.title}</span>
                </div>
                <ul className="space-y-1.5 pl-2 text-xs text-slate-300">
                  {g.lines.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note / GL Comment */}
        {pocket.comment && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between gap-2">
            <span>
              <strong className="text-slate-100">Catatan GL / QAE:</strong> {pocket.comment}
            </span>
            <span className="font-mono text-[10px] text-slate-500 shrink-0">Dummy Data · QAEactivity</span>
          </div>
        )}
      </div>
    </div>
  );
}
