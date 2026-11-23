'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Printer,
  RotateCcw,
  Wrench,
  LayoutGrid,
} from 'lucide-react';

type EvalState = 'OK' | 'Δ' | 'NG';

interface ControlCheck {
  id: string;
  text: string;
  eval: EvalState;
}

interface ControlRow {
  no: number;
  itemControl: string;
  pointPenting: string[];
  pointKontrol: ControlCheck[];
  efectBodyFitting: string[];
  mastering: string;
}

const INITIAL_ROWS: ControlRow[] = [
  {
    no: 1,
    itemControl: 'Start Pemasangan Dolly ke Body',
    pointPenting: [
      '1.1 Setting Dolly ke Body mulai Garis Merah Lantai Belakang',
      '1.2 Setting hand tool rocker model 560 B',
    ],
    pointKontrol: [
      { id: '1.2.1', text: '1.2.1 Pastikan pin hand tool tidak aus', eval: 'OK' },
      { id: '1.2.2', text: '1.2.2 Pastikan urethane kondisi ok (tidak miring / aus)', eval: 'Δ' },
      { id: '1.2.3', text: '1.2.3 Pastikan frame hand tool tidak touching ke inner', eval: 'OK' },
    ],
    efectBodyFitting: ['a. Door berubah Naik/Turun jika Posisi Start berbeda-beda'],
    mastering: 'Cek garis merah lantai & kondisi pin awal shift',
  },
  {
    no: 2,
    itemControl: 'Dorong H.tool Vacuum & Clamp Rocker',
    pointPenting: [
      '2.1 Locator Urethane W Bawah "0" Terhadap Body',
      '2.2 Dorong Dolly Pakai Kaki',
    ],
    pointKontrol: [
      { id: '2.1.1', text: '2.1.1 Locator Urethane Tidak Aus / Rusak', eval: 'OK' },
      {
        id: '2.2.1',
        text: '2.2.1 Clamp Rocker Berbentuk V Dengan Lebar V Bawahnya LH 5 mm',
        eval: 'OK',
      },
      { id: '2.2.2', text: '2.2.2 Posisi surface rocker berada di luar', eval: 'Δ' },
    ],
    efectBodyFitting: [
      'a. Menentukan Naik/Turunnya Door x Rocker Model 660 & 650',
      'b. Menentukan Flate Tidaknya Hinge x Body Area Bawah',
    ],
    mastering: 'Verifikasi celah V clamp 5 mm',
  },
  {
    no: 3,
    itemControl: 'Setting Magnet',
    pointPenting: [
      '3.1 Setting Door Manual Setelah Unvacuum Door Arah L&H',
      '3.2 Setting Magnet di Posisi yang benar:',
      '   • 560 : dibawah karakter fr door',
      '   • 650 : diatas karakter fr door',
      '   • 660 : dibawah karakter fr door',
      'note : jika gap sempit bawah, magnet bisa diturunin atau sebaliknya',
    ],
    pointKontrol: [
      { id: '3.1.1', text: '3.1.1 Mji Memastikan Posisi Door Tidak Terganggal (Free)', eval: 'OK' },
      { id: '3.2.1', text: '3.2.1 Urethane Magnet Tidak Aus', eval: 'OK' },
      { id: '3.2.2', text: '3.2.2 Urethane Magnet Tidak Mengganjal Profil Body', eval: 'OK' },
      { id: '3.2.3', text: '3.2.3 Magnet Tidak Pecah / Kondisi Rata', eval: 'OK' },
      { id: '3.2.4', text: '3.2.4 Shim x Urethane Tidak Kendor', eval: 'OK' },
    ],
    efectBodyFitting: [
      'a. Menentukan Maju/Mundur Door',
      'b. Membuat Door Area Belakang Naik/Turun',
    ],
    mastering: 'Pastikan shim & magnet rata menempel',
  },
  {
    no: 4,
    itemControl: 'Clamp L door',
    pointPenting: ['4.1 Pastikan Hinge X Body Flate Sebelum Melakukan Clamp L'],
    pointKontrol: [
      { id: '4.1.1', text: '4.1.1 Urethane Clamp x Door Touching', eval: 'Δ' },
      { id: '4.1.2', text: '4.1.2 Urethane Tidak Gota-Gota & Aus', eval: 'OK' },
      { id: '4.1.3', text: '4.1.3 Wgs Clamp L Zero', eval: 'OK' },
      {
        id: '4.1.4',
        text: '4.1.4 Urethane L Berbentuk V Untuk Model 560B Dan Berbentuk Kotak Untuk Model 640A',
        eval: 'OK',
      },
    ],
    efectBodyFitting: ['a. Membuat Door Area Belakang Naik/Turun'],
    mastering: 'Cek bentuk urethane V (560B) / Kotak (640A)',
  },
  {
    no: 5,
    itemControl: 'Pasang bolt hinge',
    pointPenting: ['5.1 Pastikan Tightening Bolt Sesuai Urutan'],
    pointKontrol: [{ id: '5.1.1', text: '5.1.1 Nut tidak N/C x hinge', eval: 'OK' }],
    efectBodyFitting: [
      'a. Membuat Door Maju/Mundur',
      'b. Menentukan Maju/Mundur Door',
    ],
    mastering: 'Urutan tightening: 1 → 2 → 3 → 4',
  },
];

const DOOR_OPTIONS = ['FRONT DOOR RH', 'REAR DOOR RH', 'FRONT DOOR LH', 'REAR DOOR LH'] as const;

export default function ControlBodyFittingPage() {
  const [doorArea, setDoorArea] = useState<(typeof DOOR_OPTIONS)[number]>('FRONT DOOR RH');
  const [docNo, setDocNo] = useState('BF-1A-001');
  const [modelName, setModelName] = useState('640A & 560B');
  const [picName, setPicName] = useState('R. Pratama');
  const [rows, setRows] = useState<ControlRow[]>(INITIAL_ROWS);

  const cycleEval = (rowNo: number, checkId: string) => {
    const order: EvalState[] = ['OK', 'Δ', 'NG'];
    setRows((prev) =>
      prev.map((r) =>
        r.no === rowNo
          ? {
              ...r,
              pointKontrol: r.pointKontrol.map((c) =>
                c.id === checkId
                  ? { ...c, eval: order[(order.indexOf(c.eval) + 1) % order.length] }
                  : c
              ),
            }
          : r
      )
    );
  };

  const updateMastering = (rowNo: number, val: string) => {
    setRows((prev) => prev.map((r) => (r.no === rowNo ? { ...r, mastering: val } : r)));
  };

  const stats = useMemo(() => {
    const all = rows.flatMap((r) => r.pointKontrol);
    return {
      total: all.length,
      ok: all.filter((c) => c.eval === 'OK').length,
      warn: all.filter((c) => c.eval === 'Δ').length,
      ng: all.filter((c) => c.eval === 'NG').length,
    };
  }, [rows]);

  return (
    <main className="min-h-dvh bg-[#070b14] text-slate-100 px-3 py-4 sm:px-6 print:bg-white print:text-slate-900 print:p-0">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Action Bar (Hidden on Print) */}
        <header className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/75 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Link
              href="/productivity"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Productivity
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Hub
            </Link>
          </div>

          {/* Door Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {DOOR_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDoorArea(d)}
                className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  doorArea === d
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRows(INITIAL_ROWS)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
              title="Reset Evaluasi"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Cetak A3/A4
            </button>
          </div>
        </header>

        {/* Live Evaluation Summary Bar (Hidden on Print) */}
        <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold">Total Point Kontrol</div>
              <div className="text-xl font-black text-white font-mono">{stats.total}</div>
            </div>
            <Wrench className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-300 font-semibold">Status OK</div>
              <div className="text-xl font-black text-white font-mono">{stats.ok}</div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-amber-300 font-semibold">Perlu Perhatian (Δ)</div>
              <div className="text-xl font-black text-white font-mono">{stats.warn}</div>
            </div>
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-rose-300 font-semibold">Status NG</div>
              <div className="text-xl font-black text-white font-mono">{stats.ng}</div>
            </div>
            <XCircle className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* ======================================================= */}
        {/* DIGITAL PAPER SHEET: CONTROL DOLLY BODY FITTING         */}
        {/* ======================================================= */}
        <section className="rounded-2xl border border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden print:border-slate-900 print:shadow-none">
          {/* Official Sheet Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-slate-900">
            {/* Left Company & Section */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r-2 border-slate-900 p-3 text-[11px] leading-snug font-bold">
              <div>PT TOYOTA MOTOR MFG INDONESIA</div>
              <div>PRESS &amp; WELDING DIVISION</div>
              <div>ENG SERV DEPARTMENT</div>
              <div>QUALITY ACC ENG SECTION</div>
            </div>

            {/* Code 1A */}
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r-2 border-slate-900 flex items-center justify-center p-2 bg-slate-100">
              <span className="text-2xl font-black tracking-tight">1A</span>
            </div>

            {/* Center Title */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r-2 border-slate-900 flex flex-col items-center justify-center p-3 text-center bg-slate-50">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide uppercase">
                CONTROL DOLLY BODY FITTING
              </h1>
              <span className="mt-0.5 text-xs font-extrabold tracking-widest text-sky-700 uppercase">
                {doorArea}
              </span>
            </div>

            {/* Right Metadata */}
            <div className="md:col-span-3 p-2.5 text-xs space-y-1 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">NO</span>
                <span>:</span>
                <input
                  value={docNo}
                  onChange={(e) => setDocNo(e.target.value)}
                  className="flex-1 bg-transparent border-b border-slate-300 focus:border-sky-600 focus:outline-none font-mono font-bold text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">Model</span>
                <span>:</span>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="flex-1 bg-transparent border-b border-slate-300 focus:border-sky-600 focus:outline-none font-mono font-bold text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-bold">PIC</span>
                <span>:</span>
                <input
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="flex-1 bg-transparent border-b border-slate-300 focus:border-sky-600 focus:outline-none font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Visual Diagram & Reference Matrix Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-slate-100 border-b-2 border-slate-900">
            {/* Callout Map (1-5) */}
            <div className="lg:col-span-8 rounded-xl border border-slate-300 bg-white p-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Peta Titik Kontrol Dolly Body Fitting (Point 1 – 5)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { no: '1', label: 'Start Garis Merah & Hand Tool', ref: '1.1 – 1.2.3' },
                  { no: '2', label: 'Locator Urethane W & Clamp Rocker V (5mm)', ref: '2.1.1 – 2.2.2' },
                  { no: '3', label: 'Setting Magnet & Shim', ref: '3.2.1 – 3.2.4' },
                  { no: '4', label: 'Clamp L Door (V: 560B / Kotak: 640A)', ref: '4.1.1 – 4.1.4' },
                  { no: '5', label: 'Tightening Bolt Hinge (1→2→3→4)', ref: '5.1.1' },
                ].map((pt) => (
                  <div
                    key={pt.no}
                    className="rounded-lg border border-slate-300 bg-slate-50 p-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                        {pt.no}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-sky-700">
                        {pt.ref}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold leading-tight text-slate-800">
                      {pt.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table 5.1.1 Model Matrix */}
            <div className="lg:col-span-4 rounded-xl border border-slate-300 bg-white p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                  5.1.1
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  Posisi Setting Model (560 / 650 / 660)
                </span>
              </div>
              <table className="w-full text-[11px] border-collapse border border-slate-400 text-center">
                <thead className="bg-slate-200 font-bold">
                  <tr>
                    <th className="border border-slate-400 px-1.5 py-1" colSpan={2}>
                      FR DOOR RH
                    </th>
                    <th className="border border-slate-400 px-1.5 py-1">560</th>
                    <th className="border border-slate-400 px-1.5 py-1">650</th>
                    <th className="border border-slate-400 px-1.5 py-1">660</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold" rowSpan={2}>
                      UPPER
                    </td>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold">L</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold text-sky-700">
                      front
                    </td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold">F</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold" rowSpan={2}>
                      LOWER
                    </td>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold">L</td>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold text-sky-700">
                      front
                    </td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-1.5 py-1 font-bold">H</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                    <td className="border border-slate-400 px-1.5 py-1">center</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Main Control Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-200 text-slate-900 font-black uppercase text-[11px] border-b-2 border-slate-900">
                  <th className="border-r border-slate-400 px-2 py-2.5 w-10 text-center">NO</th>
                  <th className="border-r border-slate-400 px-3 py-2.5 w-44 text-left">
                    ITEM CONTROL
                  </th>
                  <th className="border-r border-slate-400 px-3 py-2.5 w-72 text-left">
                    POINT PENTING
                  </th>
                  <th className="border-r border-slate-400 px-3 py-2.5 w-80 text-left">
                    POINT KONTROL
                  </th>
                  <th className="border-r border-slate-400 px-2 py-2.5 w-20 text-center">
                    EVALUASI
                  </th>
                  <th className="border-r border-slate-400 px-3 py-2.5 w-64 text-left">
                    EFECT BODY FITTING
                  </th>
                  <th className="px-3 py-2.5 w-48 text-left">MASTERING</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-400">
                {rows.map((row) => (
                  <tr key={row.no} className="align-top hover:bg-sky-50/40 transition">
                    <td className="border-r border-slate-400 px-2 py-3 text-center font-black text-sm">
                      {row.no}
                    </td>
                    <td className="border-r border-slate-400 px-3 py-3 font-extrabold text-slate-900">
                      {row.itemControl}
                    </td>
                    <td className="border-r border-slate-400 px-3 py-3 space-y-1 text-slate-800">
                      {row.pointPenting.map((pt, i) => (
                        <div
                          key={i}
                          className={
                            pt.startsWith('note')
                              ? 'mt-1 rounded bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] italic text-amber-900'
                              : 'leading-snug'
                          }
                        >
                          {pt}
                        </div>
                      ))}
                    </td>
                    <td className="border-r border-slate-400 p-0">
                      <div className="divide-y divide-slate-300">
                        {row.pointKontrol.map((c) => (
                          <div key={c.id} className="px-3 py-2 leading-snug text-slate-800">
                            {c.text}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border-r border-slate-400 p-0">
                      <div className="divide-y divide-slate-300">
                        {row.pointKontrol.map((c) => (
                          <div key={c.id} className="px-2 py-1.5 flex items-center justify-center">
                            <button
                              onClick={() => cycleEval(row.no, c.id)}
                              title="Klik untuk ubah status (OK / Δ / NG)"
                              className={`w-12 rounded py-0.5 font-mono text-[11px] font-black border transition cursor-pointer ${
                                c.eval === 'OK'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                                  : c.eval === 'Δ'
                                    ? 'bg-amber-100 text-amber-800 border-amber-400'
                                    : 'bg-rose-100 text-rose-800 border-rose-400'
                              }`}
                            >
                              {c.eval}
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border-r border-slate-400 px-3 py-3 space-y-1 text-slate-800">
                      {row.efectBodyFitting.map((ef, i) => (
                        <div key={i} className="leading-snug">
                          {ef}
                        </div>
                      ))}
                    </td>
                    <td className="px-3 py-3">
                      <textarea
                        value={row.mastering}
                        onChange={(e) => updateMastering(row.no, e.target.value)}
                        rows={2}
                        className="w-full rounded border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 focus:border-sky-600 focus:bg-white focus:outline-none print:border-none print:bg-transparent print:p-0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
