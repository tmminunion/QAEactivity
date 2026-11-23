'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Wifi,
  Battery,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Award,
  DollarSign,
  Users,
  Lightbulb,
  Target,
  Wrench,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Activity,
  ClipboardCheck,
  Folder,
  Monitor,
  X,
  Minus,
  Maximize2,
  LayoutGrid,
  List,
  Volume2,
  VolumeX,
  Zap,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileCheck2,
  Compass,
} from 'lucide-react';
import { ACTIVITY_PROGRAMS, VOICE_FEED } from './data/qaeData';

export default function QAEActivityHubPage() {
  useEffect(() => {
    document.title = 'QAEactivity — Quality Assurance KPI Hub';
  }, []);

  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dayStr = now.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(`${dayStr}  ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [isPillarsMinimized, setIsPillarsMinimized] = useState(false);
  const [isKaizenMinimized, setIsKaizenMinimized] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilter, setSearchFilter] = useState('');

  const [spotlightQuery, setSpotlightQuery] = useState('');
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsAboutModalOpen(false);
        setIsControlCenterOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => spotlightInputRef.current?.focus(), 50);
    } else {
      setSpotlightQuery('');
    }
  }, [isSpotlightOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.macos-menu-bar') && !target.closest('.macos-menu-dropdown')) {
        setActiveMenu(null);
      }
      if (!target.closest('.control-center-container')) {
        setIsControlCenterOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  // 1. 6 Pilar KPI QAE
  const kpiCards = [
    {
      code: 'Q',
      title: 'Quality',
      subTitle: 'Quality Assurance',
      desc: 'First Pass Yield, In-Process DPU, Poka-Yoke Gate & Zero Claim',
      highlight: 'FPY 99.85% • 0 Claim',
      badge: 'Built-in Quality',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      gradient: 'from-sky-500 via-blue-600 to-indigo-600',
      accent: 'text-sky-400',
      glow: 'hover:shadow-sky-500/20 hover:border-sky-500/50',
      href: '/display/quality/main',
      icon: Award,
    },
    {
      code: 'A',
      title: 'Audit',
      subTitle: 'Audit & Compliance',
      desc: 'Layered Process Audit (LPA), IATF 16949 & On-Time Close Temuan',
      highlight: 'Skor 98.0% • 100% Close',
      badge: 'IATF Ready',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      gradient: 'from-indigo-500 via-violet-600 to-purple-600',
      accent: 'text-indigo-400',
      glow: 'hover:shadow-indigo-500/20 hover:border-indigo-500/50',
      href: '/display/audit/main',
      icon: FileCheck2,
    },
    {
      code: 'E',
      title: 'Engineering',
      subTitle: 'MSA & Kalibrasi',
      desc: 'Kalibrasi CMM & Checking Fixture, Gage R&R < 10% & Cpk ≥ 1.67',
      highlight: '100% Cal • Cpk 1.78',
      badge: 'Metrology',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      gradient: 'from-cyan-500 via-teal-500 to-emerald-600',
      accent: 'text-pink-400',
      glow: 'hover:shadow-pink-500/20 hover:border-pink-500/50',
      href: '/display/engineering/main',
      icon: Compass,
    },
    {
      code: 'S',
      title: 'Safety',
      subTitle: 'Safety & Ergonomi',
      desc: 'Zero Accident Lab & Q-Gate, KYT Harian & Eliminasi Pinch Point',
      highlight: '1.428 Hari LTI Free',
      badge: 'Zero Accident',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      accent: 'text-emerald-400',
      glow: 'hover:shadow-emerald-500/20 hover:border-emerald-500/50',
      href: '/display/safety/main',
      icon: ShieldCheck,
    },
    {
      code: 'C',
      title: 'Cost',
      subTitle: 'Cost of Quality (COPQ)',
      desc: 'Reduksi Biaya Scrap, Rework Man-Hour & In-House Calibration',
      highlight: 'Saving Rp 42.8 Jt',
      badge: 'Lean COPQ',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      gradient: 'from-rose-500 via-orange-500 to-amber-500',
      accent: 'text-rose-400',
      glow: 'hover:shadow-rose-500/20 hover:border-rose-500/50',
      href: '/display/cost/main',
      icon: DollarSign,
    },
    {
      code: 'HR',
      title: 'HR & Skill',
      subTitle: 'Sertifikasi & QCC',
      desc: 'Matriks Kompetensi Inspector (Tanoko), Limit Sample Dojo & QCC',
      highlight: '98% Certified',
      badge: 'Dojo Ready',
      badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      gradient: 'from-fuchsia-600 via-purple-600 to-violet-600',
      accent: 'text-fuchsia-400',
      glow: 'hover:shadow-fuchsia-500/20 hover:border-fuchsia-500/50',
      href: '/display/hr-dev/main',
      icon: Users,
    },
  ];

  // 2. Aktivitas QAE
  const activityIcons: Record<string, typeof Lightbulb> = {
    QCC: Target,
    SGA: Lightbulb,
    '5R': Sparkles,
    SW: ClipboardCheck,
    LPA: Activity,
  };

  // 3. Quick Tools QAE
  const quickTools = [
    {
      title: 'Control Body Fitting',
      sub: 'Lembar Kontrol Dolly 1A (640A & 560B)',
      href: '/productivity/body-fitting',
      icon: Wrench,
      color: 'from-blue-500 to-cyan-600',
      badge: 'Productivity',
    },
    {
      title: 'Hoshin Statement',
      sub: 'Kebijakan Tahunan & Target QAE FY26',
      href: '/display/hoshin/main',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      badge: 'Hoshin',
    },
    {
      title: 'Department Action Plan',
      sub: 'Jadwal & PIC KRA Quality Engineering',
      href: '/display/hoshin/sub',
      icon: ClipboardCheck,
      color: 'from-sky-500 to-blue-600',
      badge: 'Action Plan',
    },
    {
      title: 'QAE KPI Tree',
      sub: 'Penurunan Main → Sub → Proses KPI',
      href: '/display/hoshin/proses',
      icon: LayoutGrid,
      color: 'from-indigo-500 to-violet-600',
      badge: 'KPI Tree',
    },
    {
      title: 'Strategy Board',
      sub: 'Peta Strategi Perbaikan QAE',
      href: '/display/hoshin/kaizen',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Strategy',
    },
    {
      title: 'Pareto Defect Quality',
      sub: 'Stratifikasi Spatter, Gap, & Nut',
      href: '/display/quality/proses',
      icon: Activity,
      color: 'from-rose-500 to-pink-600',
      badge: 'Pareto',
    },
    {
      title: 'List Problem & Kaizen',
      sub: 'Tracking Countermeasure Q-Gate',
      href: '/display/quality/kaizen',
      icon: Wrench,
      color: 'from-cyan-500 to-teal-600',
      badge: 'Kaizen',
    },
  ];

  const filteredKpi = useMemo(() => {
    if (!searchFilter.trim()) return kpiCards;
    const q = searchFilter.toLowerCase();
    return kpiCards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.subTitle.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const filteredKaizen = useMemo(() => {
    if (!searchFilter.trim()) return ACTIVITY_PROGRAMS;
    const q = searchFilter.toLowerCase();
    return ACTIVITY_PROGRAMS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  const allSearchable = useMemo(() => {
    const items = [
      ...kpiCards.map((k) => ({
        type: 'Pilar KPI',
        title: `${k.code} - ${k.title} (${k.subTitle})`,
        desc: k.desc,
        href: k.href,
        icon: k.icon,
      })),
      ...ACTIVITY_PROGRAMS.map((a) => ({
        type: 'Aktivitas QAE',
        title: `${a.code} - ${a.title}`,
        desc: a.desc,
        href: `/activity/${a.slug}`,
        icon: activityIcons[a.code] || Sparkles,
      })),
      ...quickTools.map((t) => ({
        type: 'Board & Hoshin',
        title: t.title,
        desc: t.sub,
        href: t.href,
        icon: t.icon,
      })),
    ];

    if (!spotlightQuery.trim()) return items;
    const q = spotlightQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [spotlightQuery]);

  return (
    <div className="min-h-screen bg-[#1a0617] text-slate-100 font-sans selection:bg-pink-500 selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Ambient Desktop Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-pink-600/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[480px] h-[480px] rounded-full bg-emerald-600/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* TOP MENU BAR (macOS Style)                                */}
      {/* ========================================================= */}
      <header className="macos-menu-bar sticky top-0 z-50 h-8 bg-[#1a0617]/75 backdrop-blur-2xl border-b border-pink-300/15 px-3 flex items-center justify-between text-xs select-none shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              playBeep();
              setIsAboutModalOpen(true);
            }}
            className="flex items-center justify-center p-0.5 rounded hover:bg-white/10 transition cursor-pointer"
            title="Tentang QAEactivity"
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white shadow-sm shadow-pink-500/30">
              QA
            </div>
          </button>

          <Link
            href="/"
            className="font-extrabold text-white tracking-tight px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
          >
            QAEactivity
          </Link>

          {/* Menu: Navigasi */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'nav' ? null : 'nav')}
              className={`px-2 py-0.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ${
                activeMenu === 'nav' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Navigasi
            </button>
            {activeMenu === 'nav' && (
              <div className="macos-menu-dropdown absolute top-full left-0 mt-1 w-56 bg-[#280b23]/95 backdrop-blur-2xl border border-pink-300/25 rounded-xl shadow-2xl py-1 z-50 text-slate-200">
                <Link
                  href="/"
                  onClick={() => setActiveMenu(null)}
                  className="px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 flex items-center justify-between transition text-xs font-semibold"
                >
                  <span>QAE Hub (Beranda)</span>
                  <span className="text-[10px] opacity-70">⌘1</span>
                </Link>
                <Link
                  href="/display"
                  onClick={() => setActiveMenu(null)}
                  className="px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 flex items-center justify-between transition text-xs"
                >
                  <span>Display KPI Board (TV)</span>
                  <span className="text-[10px] opacity-70">⌘2</span>
                </Link>
                <Link
                  href="/monitor"
                  onClick={() => setActiveMenu(null)}
                  className="px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 flex items-center justify-between transition text-xs"
                >
                  <span>Monitor Slideshow</span>
                  <span className="text-[10px] opacity-70">⌘3</span>
                </Link>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button
                  onClick={() => {
                    setActiveMenu(null);
                    setIsAboutModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 transition text-xs"
                >
                  Tentang QAEactivity...
                </button>
              </div>
            )}
          </div>

          {/* Menu: Pilar KPI */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setActiveMenu(activeMenu === 'pillars' ? null : 'pillars')}
              className={`px-2 py-0.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ${
                activeMenu === 'pillars' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Pilar KPI
            </button>
            {activeMenu === 'pillars' && (
              <div className="macos-menu-dropdown absolute top-full left-0 mt-1 w-52 bg-[#280b23]/95 backdrop-blur-2xl border border-pink-300/25 rounded-xl shadow-2xl py-1 z-50 text-slate-200">
                {kpiCards.map((k) => (
                  <Link
                    key={k.code}
                    href={k.href}
                    onClick={() => setActiveMenu(null)}
                    className="px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 flex items-center gap-2 transition text-xs"
                  >
                    <span className="font-bold font-mono text-[11px] w-6 text-pink-400">{k.code}</span>
                    <span>{k.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Menu: Aktivitas */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setActiveMenu(activeMenu === 'act' ? null : 'act')}
              className={`px-2 py-0.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer ${
                activeMenu === 'act' ? 'bg-white/15 text-white' : ''
              }`}
            >
              Aktivitas
            </button>
            {activeMenu === 'act' && (
              <div className="macos-menu-dropdown absolute top-full left-0 mt-1 w-56 bg-[#280b23]/95 backdrop-blur-2xl border border-pink-300/25 rounded-xl shadow-2xl py-1 z-50 text-slate-200">
                {ACTIVITY_PROGRAMS.map((a) => (
                  <Link
                    key={a.code}
                    href={`/activity/${a.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="px-3 py-1.5 hover:bg-pink-500 hover:text-white rounded-lg mx-1 flex items-center gap-2 transition text-xs"
                  >
                    <span className="font-bold font-mono text-[11px] w-8 text-pink-400">{a.code}</span>
                    <span className="truncate">{a.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status Icons */}
        <div className="flex items-center gap-2 sm:gap-3 text-white/80">
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            FPY: 99.85% • 0 Claim
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-white/70">
            <span>100%</span>
            <Battery className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
          </div>

          <Wifi className="w-3.5 h-3.5 text-white/80 hidden xs:block" />

          <button
            onClick={() => {
              playBeep();
              setIsSpotlightOpen(true);
            }}
            className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            title="Spotlight Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono text-[10px] opacity-60">⌘K</span>
          </button>

          <div className="relative control-center-container">
            <button
              onClick={() => {
                playBeep();
                setIsControlCenterOpen(!isControlCenterOpen);
              }}
              className={`p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer ${
                isControlCenterOpen ? 'bg-white/20 text-white' : ''
              }`}
              title="Control Center"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {isControlCenterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#280b23]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 z-50 text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-pink-300/20">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-pink-400" />
                    QAEactivity Control Center
                  </div>
                  <span className="text-[10px] font-mono text-pink-400">FY 2026</span>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="bg-[#361130]/80 rounded-xl p-2.5 border border-pink-300/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Status Q-Gate</div>
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Zero Outflow Active
                      </div>
                    </div>
                    <Link
                      href="/display"
                      className="px-2 py-1 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-[10px] transition"
                    >
                      Board
                    </Link>
                  </div>

                  <div className="bg-[#361130]/80 rounded-xl p-2.5 border border-pink-300/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-pink-400" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">Sound FX</div>
                        <div className="text-[10px] text-slate-400">Klik Interaktif</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        soundEnabled ? 'bg-pink-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          soundEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="font-medium text-[11px] tracking-tight text-white/90 font-mono whitespace-nowrap">
            {currentTime || 'Sen, 23 Nov 16:46'}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* DESKTOP WORKSPACE                                         */}
      {/* ========================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex flex-col gap-6">
        {/* TOP HEADER & SEARCH BAR */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.04] backdrop-blur-xl border border-pink-300/15 rounded-2xl p-3 sm:p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-pink-500/25 flex-shrink-0">
              QAE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg text-white tracking-tight">
                  QAEactivity Display
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  DUMMY DATA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Quality Assurance Engineering · KPI Board & Aktivitas Kaizen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pilar, kaizen, atau modul..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#280b23]/80 border border-pink-300/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                playBeep();
                setViewMode(viewMode === 'grid' ? 'list' : 'grid');
              }}
              className="p-2 rounded-xl bg-[#280b23]/80 hover:bg-[#361130] border border-pink-300/20 text-slate-300 hover:text-white transition cursor-pointer"
              title={viewMode === 'grid' ? 'Tampilan List' : 'Tampilan Grid'}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            </button>
          </div>
        </section>

        {/* HERO CARDS: DISPLAY & MONITOR */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Display',
              sub: 'Display KPI · QAE Management Board',
              desc: 'Papan KPI 7 Pilar × 4 Kantong (Main / Sub / Proses / Kaizen) untuk layar manajemen QAE.',
              href: '/display',
              icon: LayoutGrid,
              gradient: 'from-sky-500 via-blue-600 to-indigo-600',
              accent: 'text-sky-400',
            },
            {
              title: 'Monitor',
              sub: 'Monitor Display · Slide Show TV',
              desc: 'Slide show otomatis seluruh grafik & pareto KPI QAE untuk TV area kerja.',
              href: '/monitor',
              icon: Monitor,
              gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
              accent: 'text-emerald-400',
            },
          ]
            .filter(
              (m) =>
                !searchFilter ||
                `${m.title} ${m.sub} ${m.desc}`.toLowerCase().includes(searchFilter.toLowerCase())
            )
            .map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={playBeep}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-pink-300/20 bg-white/[0.04] p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:border-pink-400/40"
                >
                  <div
                    className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${m.gradient} opacity-20 blur-xl transition-opacity group-hover:opacity-40`}
                  />
                  <div
                    className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-tr ${m.gradient} text-white shadow-lg shadow-black/40 transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <h3 className="text-lg font-extrabold text-white transition-colors group-hover:text-pink-400">
                      {m.title}
                    </h3>
                    <div className={`text-xs font-semibold ${m.accent}`}>{m.sub}</div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                      {m.desc}
                    </p>
                  </div>
                  <ArrowRight className="relative z-10 h-5 w-5 flex-shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-pink-400" />
                </Link>
              );
            })}
        </section>

        {/* WINDOW 1: 6 PILAR KPI QAE */}
        <section className="bg-[#280b23]/70 backdrop-blur-2xl border border-pink-300/20 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          <div className="bg-[#1a0617]/80 border-b border-pink-300/15 px-4 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2 group/traffic">
              <button
                onClick={() => {
                  playBeep();
                  setIsPillarsMinimized(!isPillarsMinimized);
                }}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="Toggle"
              >
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
              <button
                onClick={() => {
                  playBeep();
                  setIsPillarsMinimized(!isPillarsMinimized);
                }}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="Minimalkan"
              >
                <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
              <button
                onClick={() => {
                  playBeep();
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                }}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="View Mode"
              >
                <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <Folder className="w-3.5 h-3.5 text-pink-400" />
              <span>6 Pilar KPI QAE (Q - A - E - S - C - HR)</span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                ~/QAEactivity/Pillars
              </span>
            </div>

            <span className="text-[11px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
              {filteredKpi.length} Pilar
            </span>
          </div>

          {!isPillarsMinimized && (
            <div className="p-4 sm:p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {filteredKpi.map((kpi) => (
                    <Link
                      key={kpi.code}
                      href={kpi.href}
                      onClick={playBeep}
                      className={`group relative bg-white/[0.04] hover:bg-white/[0.08] border border-pink-300/20 ${kpi.glow} rounded-2xl p-4 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md cursor-pointer hover:-translate-y-1`}
                    >
                      <div
                        className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${kpi.gradient} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity`}
                      />
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${kpi.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/40 group-hover:scale-105 transition-transform flex-shrink-0 border border-white/20`}
                          >
                            {kpi.code}
                          </div>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${kpi.badgeColor}`}
                          >
                            {kpi.badge}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-white group-hover:text-pink-400 transition-colors">
                            {kpi.title}
                          </h3>
                          <div className={`text-xs font-semibold ${kpi.accent}`}>{kpi.subTitle}</div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {kpi.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-300/20 flex items-center justify-between relative z-10">
                        <div className="text-[11px] font-mono font-bold text-slate-300">
                          {kpi.highlight}
                        </div>
                        <div className="w-7 h-7 rounded-xl bg-white/10 group-hover:bg-pink-500 text-slate-300 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredKpi.map((kpi) => (
                    <Link
                      key={kpi.code}
                      href={kpi.href}
                      onClick={playBeep}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-pink-300/20 hover:border-pink-400/40 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${kpi.gradient} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}
                        >
                          {kpi.code}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-white group-hover:text-pink-400 transition flex items-center gap-2">
                            <span>{kpi.title}</span>
                            <span className="text-xs text-slate-400 font-normal">
                              ({kpi.subTitle})
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{kpi.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${kpi.badgeColor}`}
                        >
                          {kpi.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300 hidden md:inline">
                          {kpi.highlight}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-400 group-hover:translate-x-0.5 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* WINDOW 2: AKTIVITAS QAE */}
        <section className="bg-[#280b23]/70 backdrop-blur-2xl border border-pink-300/20 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          <div className="bg-[#1a0617]/80 border-b border-pink-300/15 px-4 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2 group/traffic">
              <button
                onClick={() => {
                  playBeep();
                  setIsKaizenMinimized(!isKaizenMinimized);
                }}
                className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="Toggle"
              >
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
              <button
                onClick={() => {
                  playBeep();
                  setIsKaizenMinimized(!isKaizenMinimized);
                }}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="Minimalkan"
              >
                <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
              <button
                onClick={() => {
                  playBeep();
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                }}
                className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center cursor-pointer transition shadow-sm"
                title="View Mode"
              >
                <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover/traffic:opacity-100" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Aktivitas QAE (QCC, SGA, 5R, SW Observasi, LPA)</span>
            </div>

            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {filteredKaizen.length} Program
            </span>
          </div>

          {!isKaizenMinimized && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {filteredKaizen.map((act) => {
                  const Icon = activityIcons[act.code] || Sparkles;
                  return (
                    <Link
                      key={act.code}
                      href={`/activity/${act.slug}`}
                      onClick={playBeep}
                      className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-pink-300/20 hover:border-pink-400/40 rounded-2xl p-4 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-md cursor-pointer hover:-translate-y-1"
                    >
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-black/40 group-hover:scale-105 transition-transform flex-shrink-0 border border-white/20`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-white/5 text-slate-300 border-pink-300/25">
                            {act.badge}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-pink-400">
                              {act.code}
                            </span>
                            <h3 className="font-extrabold text-sm text-white group-hover:text-pink-400 transition-colors">
                              {act.title}
                            </h3>
                          </div>
                          <div className={`text-[11px] font-medium ${act.accent} mt-0.5`}>
                            {act.subtitle}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {act.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-300/20 flex items-center justify-between relative z-10">
                        <span className="text-[11px] font-mono font-bold text-slate-300">
                          {act.highlight}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-400 group-hover:translate-x-1 transition-transform">
                          Buka
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* DESKTOP WIDGETS: VOICE OF QAE + QUICK APP */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Widget 1: Voice of QAE / Genba Feed */}
          <div className="bg-[#280b23]/70 backdrop-blur-2xl border border-pink-300/20 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-pink-300/20">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-fuchsia-400" />
                  <span className="font-extrabold text-sm text-white">Voice of QAE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                  Genba Feed
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {VOICE_FEED.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-2xl border border-pink-300/20 bg-white/[0.03] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-pink-300">
                        {v.id} · {v.area}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          v.status === 'Closed'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {v.status === 'Closed' ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Clock className="w-2.5 h-2.5" />
                        )}
                        {v.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white">{v.problem}</p>
                    <p className="text-[11px] text-slate-400">CM: {v.action}</p>
                    <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                      <span>
                        {v.author} (Shift {v.shift})
                      </span>
                      <span>{v.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Widget 2: QAE Quick App Dx */}
          <div className="lg:col-span-2 bg-[#280b23]/70 backdrop-blur-2xl border border-pink-300/20 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-pink-300/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-400" />
                  <span className="font-extrabold text-sm text-white">QAE Quick App Dx</span>
                </div>
                <span className="text-xs text-slate-400">Akses Cepat Papan Hoshin & Pareto</span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.title}
                      href={tool.href}
                      onClick={playBeep}
                      className="group p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-pink-300/20 hover:border-pink-400/40 transition flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-pink-300/20">
                          {tool.badge}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="font-bold text-xs text-white group-hover:text-pink-400 transition truncate">
                          {tool.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {tool.sub}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pink-300/20 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>QAEactivity Management System &bull; FY 2026/2027</span>
              <div className="flex items-center gap-3">
                <Link href="/display" className="hover:text-pink-400 transition font-semibold">
                  Management Board
                </Link>
                <span>&bull;</span>
                <Link href="/monitor" className="hover:text-emerald-400 transition font-semibold">
                  Monitor Slideshow
                </Link>
                <span>&bull;</span>
                <Link href="/activity/qcc" className="hover:text-amber-400 transition font-semibold">
                  QCC Circle
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-pink-300/20 bg-[#1a0617]/80 backdrop-blur-xl py-5 mt-6 text-center text-xs text-slate-500 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left text-slate-400">
            <strong className="text-slate-200">QAEactivity</strong> &bull; Quality Assurance Engineering KPI Board (Dummy Data Edition)
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <Link href="/display/quality/main" className="hover:text-pink-400 transition">
              Quality
            </Link>
            <span>&bull;</span>
            <Link href="/display/audit/main" className="hover:text-pink-400 transition">
              Audit
            </Link>
            <span>&bull;</span>
            <Link href="/display/engineering/main" className="hover:text-pink-400 transition">
              Engineering
            </Link>
            <span>&bull;</span>
            <Link href="/display/safety/main" className="hover:text-pink-400 transition">
              Safety
            </Link>
            <span>&bull;</span>
            <Link href="/display/cost/main" className="hover:text-pink-400 transition">
              Cost
            </Link>
            <span>&bull;</span>
            <Link href="/monitor" className="hover:text-emerald-400 transition font-semibold">
              TV Monitor
            </Link>
          </div>
        </div>
      </footer>

      {/* SPOTLIGHT SEARCH MODAL (⌘K) */}
      {isSpotlightOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSpotlightOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[#280b23]/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-pink-300/20">
              <Search className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <input
                ref={spotlightInputRef}
                type="text"
                placeholder="Spotlight Search — Cari pilar KPI, Pareto, QCC, Hoshin..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-md">
                ESC
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
              {allSearchable.length > 0 ? (
                allSearchable.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => {
                        playBeep();
                        setIsSpotlightOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-500/10 border border-transparent hover:border-pink-500/20 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#361130] text-pink-400 flex items-center justify-center border border-pink-300/20 flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-pink-400 transition">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                        {item.type}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ditemukan hasil untuk &ldquo;{spotlightQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {isAboutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAboutModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-[#280b23]/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 relative select-none">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-pink-500/20 border border-white/20 mb-4 font-black text-2xl tracking-tighter">
                QAE
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">QAEactivity OS</h2>
              <div className="text-xs text-pink-400 font-semibold mt-0.5">
                Version 2026 (Board KPI Edition)
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Board KPI Quality Assurance Engineering dengan tampilan ala UBnetwork dan data dummy terstruktur.
              </p>

              <div className="w-full bg-[#1a0617]/60 rounded-2xl p-3.5 border border-pink-300/20 mt-5 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pilar KPI:</span>
                  <span className="font-bold text-white">Hoshin · Q · A · E · S · C · HR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Regu Produksi:</span>
                  <span className="font-bold text-pink-400">RED &amp; WHITE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode Data:</span>
                  <span className="font-bold text-emerald-400">Dummy Data (Siap Pakai)</span>
                </div>
              </div>

              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition shadow-md shadow-pink-500/20 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
