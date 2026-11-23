import Link from 'next/link';
import { ArrowLeft, ArrowRight, Wrench, BarChart3, Layers } from 'lucide-react';

export default function ProductivityHubPage() {
  const modules = [
    {
      title: 'Control Dolly Body Fitting',
      sub: 'Lembar Kontrol 1A · Front/Rear Door RH & LH (Model 640A & 560B)',
      href: '/productivity/body-fitting',
      icon: Wrench,
      grad: 'from-cyan-500 to-blue-600',
      badge: 'Body Fitting',
    },
    {
      title: 'Display KPI Board',
      sub: 'QAE Management Board (Main / Sub / Proses / Kaizen)',
      href: '/display',
      icon: BarChart3,
      grad: 'from-indigo-500 to-violet-600',
      badge: 'KPI Board',
    },
    {
      title: 'Action Plan & Hoshin',
      sub: 'Master Plan Aktivitas QAE FY 2026/2027',
      href: '/display/hoshin/sub',
      icon: Layers,
      grad: 'from-amber-500 to-orange-600',
      badge: 'Hoshin',
    },
  ];

  return (
    <main className="min-h-dvh bg-[#1a0617] text-slate-100 px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke QAEactivity Hub
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            Productivity &amp; Body Fitting
          </h1>
          <p className="text-sm text-slate-400">
            Modul kontrol proses, body fitting dolly, dan produktivitas QAE
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group rounded-3xl border border-pink-300/20 bg-white/[0.04] p-5 hover:bg-white/[0.08] hover:border-pink-400/40 transition flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${m.grad} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {m.badge}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white group-hover:text-pink-400 transition">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{m.sub}</p>
                </div>
                <div className="flex items-center justify-end text-xs font-bold text-pink-400">
                  Buka <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
