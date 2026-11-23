// Data Dummy Terstruktur untuk QAEactivity (Quality Assurance Engineering KPI Board)
// Struktur mengikuti GL Management Board UBnetwork: 7 Kolom Pilar x 4 Baris Kantong (Main, Sub, Proses, Kaizen)
// Main KPI menggunakan breakdown per Model (Innova, Fortuner, Zenix) untuk OK Ratio.

export const MONTHS = [
  'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar',
];

export const COLUMNS = [
  { key: 'hoshin', slug: 'hoshin', short: 'HOSHIN', chip: 'H', name: 'Kebijakan Tahunan QAE' },
  { key: 'q', slug: 'quality', short: 'QUALITY', chip: 'Q', name: 'Quality Assurance' },
  { key: 'a', slug: 'audit', short: 'AUDIT', chip: 'A', name: 'Audit & Compliance' },
  { key: 'e', slug: 'engineering', short: 'ENG', chip: 'E', name: 'QAE Engineering' },
  { key: 's', slug: 'safety', short: 'SAFETY', chip: 'S', name: 'Safety & Ergonomi' },
  { key: 'c', slug: 'cost', short: 'COST', chip: 'C', name: 'Cost of Quality' },
  { key: 'hr', slug: 'hr-dev', short: 'HR-DEV', chip: 'HR', name: 'Skill & Sertifikasi' },
] as const;

export const ROWS = [
  { key: 'main', short: 'Main', name: 'Main KPI' },
  { key: 'sub', short: 'Sub', name: 'Sub KPI' },
  { key: 'proses', short: 'Proses', name: 'Proses KPI' },
  { key: 'kaizen', short: 'Kaizen', name: 'Kaizen / List Problem' },
] as const;

export type ColumnSlug = (typeof COLUMNS)[number]['slug'];
export type RowKey = (typeof ROWS)[number]['key'];
export type TemplateType =
  | 'main'
  | 'sub'
  | 'proses'
  | 'kaizen'
  | 'hoshin-main'
  | 'hoshin-plan'
  | 'hoshin-tree'
  | 'hoshin-strategy';

export interface SeriesData {
  unit: string;
  target: number;
  dec: number;
  lower: boolean;
  red?: (number | null)[];
  white?: (number | null)[];
  models?: {
    innova: (number | null)[];
    fortuner: (number | null)[];
    zenix: (number | null)[];
  };
}

export interface ParetoCause {
  n: string;
  v: number;
}

export interface KaizenItem {
  no: string;
  problem: string;
  countermeasure: string;
  pic: string;
  due: string;
  status: 'Selesai' | 'Proses' | 'Belum';
  beforeVal?: string;
  afterVal?: string;
}

export interface HoshinMainData {
  pillar: string;
  pillarTitle: string;
  page: string;
  coy: string;
  dir: string;
  kpiTarget: string;
  reflection: { title: string; lines: string[] }[];
  strategy: { heading: string; items: string[] }[];
  kpi: { label: string; hl: boolean; lines: string[] }[];
}

export interface ActionPlanRow {
  no: string;
  kra: string;
  kpiName: string;
  target: string;
  current: string;
  activity: string;
  schedule: string[];
  pic: string;
  status: 'On Track' | 'At Risk' | 'Done';
}

export interface KpiTreeRow {
  pillar: string;
  main: string;
  sub: string[];
  process: string[];
}

export interface StrategyGroup {
  letter: string;
  title: string;
  lines: string[];
}

export interface PocketData {
  template: TemplateType;
  title: string;
  subtitle: string;
  series?: SeriesData;
  causes?: ParetoCause[];
  conclusion?: string;
  items?: KaizenItem[];
  hoshinMain?: HoshinMainData;
  actionPlan?: ActionPlanRow[];
  kpiTree?: KpiTreeRow[];
  strategyGroups?: StrategyGroup[];
  comment: string;
}

export const THEME: Record<
  ColumnSlug,
  { grad: string; text: string; glow: string; ring: string; chip: string; hex: string }
> = {
  hoshin: {
    grad: 'from-amber-400 to-orange-500',
    text: 'text-amber-300',
    glow: 'bg-amber-500/25',
    ring: 'hover:border-amber-400/50',
    chip: 'bg-amber-400/15 text-amber-200',
    hex: '#f59e0b',
  },
  quality: {
    grad: 'from-sky-400 to-blue-600',
    text: 'text-sky-300',
    glow: 'bg-sky-500/25',
    ring: 'hover:border-sky-400/50',
    chip: 'bg-sky-400/15 text-sky-200',
    hex: '#38bdf8',
  },
  audit: {
    grad: 'from-indigo-400 to-violet-600',
    text: 'text-indigo-300',
    glow: 'bg-indigo-500/25',
    ring: 'hover:border-indigo-400/50',
    chip: 'bg-indigo-400/15 text-indigo-200',
    hex: '#818cf8',
  },
  engineering: {
    grad: 'from-cyan-400 to-teal-600',
    text: 'text-cyan-300',
    glow: 'bg-cyan-500/25',
    ring: 'hover:border-cyan-400/50',
    chip: 'bg-cyan-400/15 text-cyan-200',
    hex: '#22d3ee',
  },
  safety: {
    grad: 'from-emerald-400 to-green-600',
    text: 'text-emerald-300',
    glow: 'bg-emerald-500/25',
    ring: 'hover:border-emerald-400/50',
    chip: 'bg-emerald-400/15 text-emerald-200',
    hex: '#34d399',
  },
  cost: {
    grad: 'from-rose-400 to-orange-600',
    text: 'text-rose-300',
    glow: 'bg-rose-500/25',
    ring: 'hover:border-rose-400/50',
    chip: 'bg-rose-400/15 text-rose-200',
    hex: '#fb7185',
  },
  'hr-dev': {
    grad: 'from-fuchsia-400 to-purple-600',
    text: 'text-fuchsia-300',
    glow: 'bg-fuchsia-500/25',
    ring: 'hover:border-fuchsia-400/50',
    chip: 'bg-fuchsia-400/15 text-fuchsia-200',
    hex: '#e879f9',
  },
};

export const POCKETS: Record<ColumnSlug, Record<RowKey, PocketData>> = {
  hoshin: {
    main: {
      template: 'hoshin-main',
      title: 'HOSHIN STATEMENT QAE',
      subtitle: 'Kebijakan Mutu & Engineering FY 2026/2027',
      comment: 'Review bulanan QAE Management Board setiap minggu ke-1.',
      hoshinMain: {
        pillar: 'QAE PILLAR',
        pillarTitle: 'Built-in Quality & Zero Outflow',
        page: '1 / 4',
        coy: 'Mewujudkan Zero Customer Claim melalui penguatan Built-in Quality (BIQ), digitalisasi inspeksi, dan standardisasi proses QAE.',
        dir: 'QAE FY26: Turunkan Outflow Defect 50%, 100% Kalibrasi Tepat Waktu, & 100% Audit Compliance.',
        kpiTarget: '0 Outflow Claim & OK Ratio ≥ 99.5%',
        reflection: [
          {
            title: '1. QUALITY & AUDIT',
            lines: [
              'Customer Claim FY25: 1 kasus (minor cosmetic).',
              'Temuan audit internal masih berulang pada verifikasi Poka-Yoke shift malam.',
            ],
          },
          {
            title: '2. ENGINEERING & KALIBRASI',
            lines: [
              'Gage R&R alat ukur CMM mencapai 98.5% on-schedule.',
              'Perlu otomasi checksheet digital pada pos Final Inspection.',
            ],
          },
        ],
        strategy: [
          {
            heading: 'Perkuat Built-in Quality & Jidoka Gate',
            items: [
              'Implementasi sensor Poka-Yoke & auto-interlock pada 12 titik kritis.',
              'Kamishibai audit harian oleh GL/TL QAE untuk memastikan kepatuhan SW.',
            ],
          },
          {
            heading: 'Digitalisasi QAE Lab & Traceability',
            items: [
              'Integrasi hasil kalibrasi & SPC real-time ke QAEactivity Dashboard.',
              'Standardisasi QCC 8-Langkah untuk seluruh problem berulang (top 3 Pareto).',
            ],
          },
        ],
        kpi: [
          { label: '0 Customer Claim', hl: true, lines: ['Target: 0 Kasus', 'Aktual YTD: 0 Kasus'] },
          { label: 'OK Ratio ≥ 99.50%', hl: false, lines: ['Innova: 99.78% · Fortuner: 99.64%', 'Zenix: 99.82%'] },
          { label: '100% Kalibrasi', hl: true, lines: ['148 / 148 Alat On-Time'] },
        ],
      },
    },
    sub: {
      template: 'hoshin-plan',
      title: 'QAE DEPARTMENT ACTION PLAN',
      subtitle: 'Master Plan Aktivitas QAE FY 2026/2027',
      comment: 'Tracking realisasi bulanan seluruh KRA Quality Assurance Engineering.',
      actionPlan: [
        {
          no: '1',
          kra: 'QUALITY',
          kpiName: 'OK Ratio Model Innova, Fortuner, Zenix',
          target: '≥ 99.50%',
          current: '99.75%',
          activity: 'Kamishibai Poka-Yoke & Gate Inspection 100%',
          schedule: ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
          pic: 'R. Pratama',
          status: 'On Track',
        },
        {
          no: '2',
          kra: 'AUDIT',
          kpiName: 'IATF & Internal Process Audit',
          target: 'Skor ≥ 96%',
          current: '97.2%',
          activity: 'Cross-Audit Shift Red vs White tiap 2 minggu',
          schedule: ['Mei', 'Jun', 'Agu', 'Okt'],
          pic: 'S. Wulandari',
          status: 'Done',
        },
        {
          no: '3',
          kra: 'ENGINEERING',
          kpiName: 'Gage R&R & Kalibrasi Alat Ukur',
          target: '100% On-Time',
          current: '99.1%',
          activity: 'Reminder otomatis H-14 & verifikasi CMM',
          schedule: ['Apr', 'Jul', 'Okt', 'Jan'],
          pic: 'D. Kurniawan',
          status: 'On Track',
        },
        {
          no: '4',
          kra: 'COST',
          kpiName: 'Cost of Poor Quality (COPQ)',
          target: '≤ Rp 8.0 Jt/Bln',
          current: 'Rp 7.4 Jt',
          activity: 'QCC reduksi scrap bracket & rework welding',
          schedule: ['Jun', 'Jul', 'Agu', 'Sep'],
          pic: 'A. Hidayat',
          status: 'On Track',
        },
        {
          no: '5',
          kra: 'HR-DEV',
          kpiName: 'Sertifikasi Inspector & QCC',
          target: '100% Certified',
          current: '95%',
          activity: 'Dojo training defect limit sample & uji kompetensi',
          schedule: ['Mei', 'Jul', 'Sep', 'Nov'],
          pic: 'N. Fatulah',
          status: 'At Risk',
        },
      ],
    },
    proses: {
      template: 'hoshin-tree',
      title: 'QAE KPI TREE',
      subtitle: 'Penurunan Kebijakan: Main → Sub → Proses KPI',
      comment: 'Setiap proses KPI terhubung langsung dengan Pareto & Kaizen.',
      kpiTree: [
        {
          pillar: 'Quality',
          main: 'OK Ratio ≥ 99.5%\n(Innova, Fortuner, Zenix)',
          sub: ['In-Process DPU ≤ 0.25', 'First Pass Yield ≥ 99.8%', 'Rework Rate ≤ 0.3%'],
          process: ['Kamishibai Gate Check', 'Poka-Yoke Sensor Verification', 'SPC Control Chart (Xbar-R)'],
        },
        {
          pillar: 'Audit',
          main: 'OK Ratio Audit ≥ 96%',
          sub: ['IATF 16949 Compliance', 'Close Temuan ≤ 7 Hari'],
          process: ['Daily Layered Process Audit (LPA)', 'SW Compliance Check', '4M / Henkaten Verification'],
        },
        {
          pillar: 'Engineering',
          main: 'OK Ratio Kalibrasi 100%\nGage R&R < 10%',
          sub: ['On-Time Calibration', 'CPK Critical Dim ≥ 1.67'],
          process: ['CMM & Fixture Check', 'MSA Study Schedule', 'Limit Sample Renewal'],
        },
        {
          pillar: 'Cost',
          main: 'OK Ratio Budget ≥ 98%\nCOPQ ≤ Rp 8 Jt/bln',
          sub: ['Scrap Cost Reduction', 'Zero Sortir Eksternal'],
          process: ['Pareto Scrap per Part', 'Analisa Root Cause 5-Why'],
        },
        {
          pillar: 'HR-Dev',
          main: 'OK Ratio Skill ≥ 95%',
          sub: ['Tanoko Skill Level ≥ 3', '2 Idea Kaizen / MP / Bln'],
          process: ['QCC 8-Langkah Circle', 'Limit Sample Dojo Calibration'],
        },
      ],
    },
    kaizen: {
      template: 'hoshin-strategy',
      title: 'QAE STRATEGY BOARD',
      subtitle: 'Arah Strategis Perbaikan Berkelanjutan FY 2026',
      comment: 'Fokus utama: Digitalisasi Poka-Yoke & Zero Outflow.',
      strategyGroups: [
        {
          letter: 'Q',
          title: 'Quality Assurance',
          lines: [
            'Jaga OK Ratio model Innova, Fortuner, dan Zenix di atas 99.50%.',
            'Zero Defect Outflow ke Final Assembly melalui 100% Auto-Gate Poka-Yoke.',
          ],
        },
        {
          letter: 'A',
          title: 'Audit & Compliance',
          lines: [
            '100% Penutupan temuan Audit Internal dalam SLA maksimal 7 hari kerja.',
            'Digitalisasi Layered Process Audit (LPA) pada semua pos inspeksi.',
          ],
        },
        {
          letter: 'E',
          title: 'Engineering & MSA',
          lines: [
            'Pastikan 100% alat ukur & checking fixture terkalibrasi sebelum expired.',
            'Tingkatkan kapabilitas proses (Cpk ≥ 1.67) pada seluruh dimensi CTQ.',
          ],
        },
        {
          letter: 'C',
          title: 'Cost of Quality',
          lines: [
            'Eliminasi biaya sortir & rework eksternal sebesar 35% YoY.',
            'Fokus Kaizen pada Top 3 kontributor scrap bulanan.',
          ],
        },
        {
          letter: 'HR',
          title: 'People & Culture',
          lines: [
            '100% Inspector lulus sertifikasi ulang Limit Sample Dojo per semester.',
            'Minimal 2 Ide Kaizen (SS) aktif per anggota setiap bulan.',
          ],
        },
      ],
    },
  },

  quality: {
    main: {
      template: 'main',
      title: 'OK RATIO BY MODEL (Q-GATE)',
      subtitle: 'Main KPI Quality Assurance — Innova · Fortuner · Zenix (Target ≥ 99.50%)',
      series: {
        unit: '%',
        target: 99.5,
        dec: 2,
        lower: false,
        models: {
          innova: [99.42, 99.51, 99.58, 99.64, 99.69, 99.72, 99.75, 99.78, null, null, null, null],
          fortuner: [99.28, 99.36, 99.45, 99.52, 99.55, 99.58, 99.61, 99.64, null, null, null, null],
          zenix: [99.54, 99.6, 99.66, 99.71, 99.74, 99.77, 99.8, 99.82, null, null, null, null],
        },
      },
      comment: 'OK Ratio Zenix tertinggi (99.82%), Innova & Fortuner konsisten di atas target 99.50% sejak Juli.',
    },
    sub: {
      template: 'sub',
      title: 'IN-PROCESS DEFECT (DPU)',
      subtitle: 'Sub KPI Quality per Regu — Target ≤ 0.25 DPU',
      series: {
        unit: 'DPU',
        target: 0.25,
        dec: 2,
        lower: true,
        red: [0.32, 0.29, 0.26, 0.22, 0.24, 0.19, 0.18, 0.2, null, null, null, null],
        white: [0.35, 0.31, 0.27, 0.25, 0.23, 0.22, 0.24, 0.21, null, null, null, null],
      },
      comment: 'Shift Red & White sudah berada di bawah batas 0.25 DPU pada Q2–Q3.',
    },
    proses: {
      template: 'proses',
      title: 'PARETO DEFECT QAE',
      subtitle: 'Stratifikasi Jenis Defect Terbanyak (YTD)',
      causes: [
        { n: 'Spatter / Burr', v: 34 },
        { n: 'Gap Bracket', v: 21 },
        { n: 'Nut Missing', v: 12 },
        { n: 'Dimensi / Warp', v: 8 },
        { n: 'Scratch Cosmetic', v: 5 },
      ],
      conclusion: 'Spatter/Burr menyumbang 42.5% total defect → fokus perbaikan parameter robot & anti-spatter.',
      comment: 'Data diambil dari rekap Q-Gate pos 1–4.',
    },
    kaizen: {
      template: 'kaizen',
      title: 'KAIZEN & PROBLEM QUALITY',
      subtitle: 'Daftar Temuan Defect & Countermeasure Aktif',
      items: [
        {
          no: '1',
          problem: 'Spatter berlebih pada flange bracket LH (Fortuner)',
          countermeasure: 'Optimasi sudut torch & auto-spray nozzle',
          pic: 'R. Pratama',
          due: '15 Nov',
          status: 'Selesai',
          beforeVal: '18 pcs/bln',
          afterVal: '2 pcs/bln',
        },
        {
          no: '2',
          problem: 'Potensi nut missing lolos ke proses berikutnya (Innova)',
          countermeasure: 'Pasang sensor proximity + interlock conveyor',
          pic: 'D. Kurniawan',
          due: '28 Nov',
          status: 'Selesai',
          beforeVal: '4 kasus',
          afterVal: '0 kasus',
        },
        {
          no: '3',
          problem: 'Gap bracket fender melebihi toleransi 0.8mm (Zenix)',
          countermeasure: 'Re-shimming pin locator jig #2 & cek rutin',
          pic: 'A. Hidayat',
          due: '10 Des',
          status: 'Proses',
          beforeVal: '0.95 mm',
          afterVal: '0.45 mm',
        },
        {
          no: '4',
          problem: 'Scratch ringan saat handling ke trolley',
          countermeasure: 'Lapis ulang urethane pad pada rak part',
          pic: 'S. Wulandari',
          due: '20 Des',
          status: 'Proses',
          beforeVal: '5 pcs/bln',
          afterVal: 'Target 0',
        },
      ],
      comment: 'Verifikasi efektivitas dilakukan selama 30 hari berturut-turut.',
    },
  },

  audit: {
    main: {
      template: 'main',
      title: 'OK RATIO AUDIT COMPLIANCE',
      subtitle: 'Main KPI Audit per Model — Innova · Fortuner · Zenix (Target ≥ 96.0%)',
      series: {
        unit: '%',
        target: 96.0,
        dec: 1,
        lower: false,
        models: {
          innova: [94.8, 95.5, 96.2, 96.8, 97.1, 97.4, 97.6, 98.1, null, null, null, null],
          fortuner: [94.1, 94.9, 95.7, 96.1, 96.5, 96.9, 97.2, 97.5, null, null, null, null],
          zenix: [95.2, 96.0, 96.6, 97.2, 97.5, 97.9, 98.1, 98.4, null, null, null, null],
        },
      },
      comment: 'Kepatuhan Layered Process Audit (LPA) pada seluruh line model melampaui target 96%.',
    },
    sub: {
      template: 'sub',
      title: 'ON-TIME CLOSE TEMUAN AUDIT',
      subtitle: 'Sub KPI Audit per Regu — Target 100% Close ≤ 7 Hari',
      series: {
        unit: '%',
        target: 100,
        dec: 0,
        lower: false,
        red: [90, 95, 100, 100, 96, 100, 100, 100, null, null, null, null],
        white: [88, 92, 95, 100, 100, 95, 100, 100, null, null, null, null],
      },
      comment: 'Seluruh temuan mayor & minor Q3 berhasil ditutup tepat waktu.',
    },
    proses: {
      template: 'proses',
      title: 'PARETO TEMUAN AUDIT LPA',
      subtitle: 'Kategori Ketidaksesuaian Selama Patrol Audit',
      causes: [
        { n: 'Poka-Yoke Check Log', v: 11 },
        { n: 'Limit Sample Expired', v: 7 },
        { n: 'SW / WI Tidak Terpasang', v: 5 },
        { n: 'Labeling Red Bin', v: 4 },
        { n: 'Kalibrasi Tag Lepas', v: 2 },
      ],
      conclusion: '40% temuan berasal dari kelengkapan log verifikasi Poka-Yoke di awal shift → digitalisasi form QR.',
      comment: 'Audit dilakukan acak oleh tim QAE lintas shift.',
    },
    kaizen: {
      template: 'kaizen',
      title: 'FOLLOW UP TEMUAN AUDIT',
      subtitle: 'Tracking Perbaikan Audit Internal & IATF',
      items: [
        {
          no: '1',
          problem: 'Form verifikasi Poka-Yoke awal shift sering tertinggal',
          countermeasure: 'Ganti dengan QR Scan Checksheet di tablet pos',
          pic: 'S. Wulandari',
          due: '12 Nov',
          status: 'Selesai',
          beforeVal: '85% terisi',
          afterVal: '100% terisi',
        },
        {
          no: '2',
          problem: 'Limit sample defect pudar di area pencahayaan tinggi',
          countermeasure: 'Tambahkan pelindung UV & jadwal review 3 bulanan',
          pic: 'R. Pratama',
          due: '25 Nov',
          status: 'Selesai',
          beforeVal: '7 temuan',
          afterVal: '0 temuan',
        },
        {
          no: '3',
          problem: 'Label Red Bin NG belum mencantumkan kode penyebab',
          countermeasure: 'Cetak stiker barcode kategori NG standar',
          pic: 'M. Yusuf',
          due: '08 Des',
          status: 'Proses',
          beforeVal: 'Manual tulis',
          afterVal: 'Auto barcode',
        },
      ],
      comment: 'Audit eksternal IATF dijadwalkan ulang pada kuartal berikutnya.',
    },
  },

  engineering: {
    main: {
      template: 'main',
      title: 'OK RATIO KALIBRASI & JIG',
      subtitle: 'Main KPI Engineering per Model — Innova · Fortuner · Zenix (Target ≥ 99.0%)',
      series: {
        unit: '%',
        target: 99.0,
        dec: 1,
        lower: false,
        models: {
          innova: [98.2, 98.8, 99.2, 99.5, 99.6, 100, 100, 100, null, null, null, null],
          fortuner: [97.8, 98.4, 99.0, 99.2, 99.4, 99.6, 99.8, 100, null, null, null, null],
          zenix: [98.6, 99.1, 99.5, 99.8, 100, 100, 100, 100, null, null, null, null],
        },
      },
      comment: '148 dari 148 instrumen ukur & checking fixture Innova, Fortuner, Zenix terkalibrasi tepat waktu.',
    },
    sub: {
      template: 'sub',
      title: 'CAPABILITY INDEX (Cpk) CTQ',
      subtitle: 'Sub KPI Engineering per Regu — Target Cpk ≥ 1.67',
      series: {
        unit: 'Cpk',
        target: 1.67,
        dec: 2,
        lower: false,
        red: [1.58, 1.62, 1.68, 1.71, 1.69, 1.74, 1.76, 1.78, null, null, null, null],
        white: [1.55, 1.6, 1.65, 1.67, 1.7, 1.71, 1.73, 1.75, null, null, null, null],
      },
      comment: 'Stabilitas dimensi lubang datum & bracket meningkat pasca tuning jig.',
    },
    proses: {
      template: 'proses',
      title: 'PARETO MASALAH MSA & JIG',
      subtitle: 'Jenis Deviasi Pengukuran & Checking Fixture',
      causes: [
        { n: 'Pin Locator Aus', v: 9 },
        { n: 'Clamp Pressure Drop', v: 6 },
        { n: 'CMM Probe Drift', v: 3 },
        { n: 'Dial Gauge Macet', v: 2 },
      ],
      conclusion: 'Pin locator aus menyumbang 45% deviasi MSA → upgrade ke material carbide.',
      comment: 'Data hasil studi Gage R&R semester I.',
    },
    kaizen: {
      template: 'kaizen',
      title: 'KAIZEN ENGINEERING & MSA',
      subtitle: 'Proyek Peningkatan Akurasi & Otomasi Ukur',
      items: [
        {
          no: '1',
          problem: 'Pin locator checking fixture cepat aus (usia < 4 bulan)',
          countermeasure: 'Ganti material pin ke Tungsten Carbide HRC 70',
          pic: 'D. Kurniawan',
          due: '18 Nov',
          status: 'Selesai',
          beforeVal: 'Gage R&R 12%',
          afterVal: 'Gage R&R 4.8%',
        },
        {
          no: '2',
          problem: 'Input data CMM ke laporan SPC masih manual',
          countermeasure: 'Buat auto-parser CSV ke QAEactivity Board',
          pic: 'N. Fatulah',
          due: '05 Des',
          status: 'Proses',
          beforeVal: '25 mnt/lot',
          afterVal: '2 mnt/lot',
        },
        {
          no: '3',
          problem: 'Clamp pneumatic fixture sering bocor halus',
          countermeasure: 'Tambahkan pressure switch + indikator LED hijau/merah',
          pic: 'A. Hidayat',
          due: '18 Des',
          status: 'Belum',
          beforeVal: 'Cpk 1.48',
          afterVal: 'Target ≥ 1.67',
        },
      ],
      comment: 'Seluruh alat baru wajib lolos MSA sebelum mass production.',
    },
  },

  safety: {
    main: {
      template: 'main',
      title: 'OK RATIO SAFETY CHECK',
      subtitle: 'Main KPI Safety per Model — Innova · Fortuner · Zenix (Target 100.0%)',
      series: {
        unit: '%',
        target: 100.0,
        dec: 1,
        lower: false,
        models: {
          innova: [98.5, 99.0, 99.5, 100, 100, 100, 100, 100, null, null, null, null],
          fortuner: [98.0, 98.8, 99.2, 99.5, 100, 100, 100, 100, null, null, null, null],
          zenix: [99.0, 99.5, 100, 100, 100, 100, 100, 100, null, null, null, null],
        },
      },
      comment: '1.428 hari LTI-Free. Seluruh line model mencapai 100% kepatuhan APD & Safety Device.',
    },
    sub: {
      template: 'sub',
      title: 'KYT & SAFETY PATROL',
      subtitle: 'Sub KPI Safety per Regu — Target 100% Pelaksanaan',
      series: {
        unit: '%',
        target: 100,
        dec: 0,
        lower: false,
        red: [98, 100, 100, 99, 100, 100, 100, 100, null, null, null, null],
        white: [96, 98, 100, 100, 99, 100, 100, 100, null, null, null, null],
      },
      comment: 'Partisipasi KYT pagi & malam mencapai 100% sejak September.',
    },
    proses: {
      template: 'proses',
      title: 'PARETO POTENSI BAHAYA (HYARIHATTO)',
      subtitle: 'Stratifikasi Temuan Kondisi Tidak Aman Area QAE',
      causes: [
        { n: 'Pinch Point Jig', v: 7 },
        { n: 'Kabel / Selang Lantai', v: 5 },
        { n: 'Sharp Edge Part', v: 4 },
        { n: 'Ergonomi Angkat', v: 3 },
      ],
      conclusion: 'Pinch point pada clamp checking fixture jadi prioritas → pasang two-hand control & cover.',
      comment: 'Laporan Hyarihatto direview setiap Jumat.',
    },
    kaizen: {
      template: 'kaizen',
      title: 'KAIZEN SAFETY & ERGONOMI',
      subtitle: 'Eliminasi Hazard Rank A/B Area Lab & Inspection',
      items: [
        {
          no: '1',
          problem: 'Potensi jari terjepit clamp pneumatic checking fixture',
          countermeasure: 'Pasang tombol two-hand safety & cover akrilik',
          pic: 'M. Yusuf',
          due: '10 Nov',
          status: 'Selesai',
          beforeVal: 'Rank B',
          afterVal: 'Rank C (Aman)',
        },
        {
          no: '2',
          problem: 'Tepi part tajam saat pengecekan manual di Q-Gate',
          countermeasure: 'Wajibkan sarung tangan cut-resistant Level 4',
          pic: 'S. Wulandari',
          due: '22 Nov',
          status: 'Selesai',
          beforeVal: '2 near-miss',
          afterVal: '0 near-miss',
        },
        {
          no: '3',
          problem: 'Posisi angkat part > 12 kg ke meja CMM membungkuk',
          countermeasure: 'Pasang balancer arm & meja hidrolik adjustable',
          pic: 'D. Kurniawan',
          due: '15 Des',
          status: 'Proses',
          beforeVal: 'RULA Skor 6',
          afterVal: 'RULA Skor 2',
        },
      ],
      comment: 'Zero Accident adalah syarat mutlak seluruh aktivitas QAE.',
    },
  },

  cost: {
    main: {
      template: 'main',
      title: 'OK RATIO EFISIENSI BIAYA MUTU',
      subtitle: 'Main KPI Cost per Model — Innova · Fortuner · Zenix (Target ≥ 98.0%)',
      series: {
        unit: '%',
        target: 98.0,
        dec: 1,
        lower: false,
        models: {
          innova: [96.8, 97.3, 97.9, 98.2, 98.5, 98.7, 98.9, 99.1, null, null, null, null],
          fortuner: [96.4, 97.0, 97.5, 97.9, 98.2, 98.4, 98.6, 98.8, null, null, null, null],
          zenix: [97.2, 97.8, 98.3, 98.6, 98.9, 99.1, 99.2, 99.4, null, null, null, null],
        },
      },
      comment: 'Efisiensi biaya mutu (non-scrap & non-rework ratio) seluruh model melampaui 98%.',
    },
    sub: {
      template: 'sub',
      title: 'REWORK & SORTIR MAN-HOUR',
      subtitle: 'Sub KPI Cost per Regu — Target ≤ 20 Jam / Bulan',
      series: {
        unit: 'jam',
        target: 20,
        dec: 0,
        lower: true,
        red: [32, 28, 24, 21, 18, 17, 15, 14, null, null, null, null],
        white: [35, 30, 26, 22, 19, 18, 16, 15, null, null, null, null],
      },
      comment: 'Jam sortir menurun drastis setelah containment di sumber proses.',
    },
    proses: {
      template: 'proses',
      title: 'PARETO BIAYA KUALITAS',
      subtitle: 'Komposisi Biaya Scrap, Rework, & Consumable Lab',
      causes: [
        { n: 'Scrap Panel Reject', v: 3.4 },
        { n: 'Rework Welding', v: 2.1 },
        { n: 'Consumable Probe/Tip', v: 1.0 },
        { n: 'Sortir Eksternal', v: 0.5 },
      ],
      conclusion: 'Scrap panel menyumbang 48% COPQ → optimasi jig & deteksi dini di pos awal.',
      comment: 'Dalam jutaan Rupiah per bulan (rata-rata Q3).',
    },
    kaizen: {
      template: 'kaizen',
      title: 'KAIZEN COST REDUCTION',
      subtitle: 'Inisiatif Penghematan Biaya Mutu & Lab QAE',
      items: [
        {
          no: '1',
          problem: 'Biaya kirim kalibrasi eksternal fixture terlalu tinggi',
          countermeasure: 'In-house calibration untuk dial gauge & torque wrench',
          pic: 'D. Kurniawan',
          due: '15 Nov',
          status: 'Selesai',
          beforeVal: 'Rp 4.5 jt/bln',
          afterVal: 'Rp 1.2 jt/bln',
        },
        {
          no: '2',
          problem: 'Pemborosan kertas checksheet cetak harian',
          countermeasure: 'Migrasi ke Digital Checksheet QAEactivity',
          pic: 'N. Fatulah',
          due: '30 Nov',
          status: 'Selesai',
          beforeVal: '12 rim/bln',
          afterVal: '1 rim/bln',
        },
        {
          no: '3',
          problem: 'Panel reject akibat miss-welding nut di pos 2',
          countermeasure: 'Pasang auto nut-presence checker sebelum press',
          pic: 'R. Pratama',
          due: '12 Des',
          status: 'Proses',
          beforeVal: 'Rp 3.4 jt/bln',
          afterVal: 'Target Rp 0.5 jt',
        },
      ],
      comment: 'Total estimasi saving YTD mencapai Rp 42.8 Juta.',
    },
  },

  'hr-dev': {
    main: {
      template: 'main',
      title: 'OK RATIO SERTIFIKASI INSPECTOR',
      subtitle: 'Main KPI HR-Dev per Model — Innova · Fortuner · Zenix (Target ≥ 95%)',
      series: {
        unit: '%',
        target: 95,
        dec: 0,
        lower: false,
        models: {
          innova: [88, 90, 92, 94, 96, 97, 98, 99, null, null, null, null],
          fortuner: [85, 88, 90, 92, 94, 95, 96, 97, null, null, null, null],
          zenix: [89, 91, 93, 95, 97, 98, 99, 100, null, null, null, null],
        },
      },
      comment: 'Inspector tersertifikasi pada model Innova, Fortuner, dan Zenix telah melewati target 95%.',
    },
    sub: {
      template: 'sub',
      title: 'KEHADIRAN & IDEA KAIZEN',
      subtitle: 'Sub KPI HR-Dev per Regu — Target Kehadiran ≥ 98%',
      series: {
        unit: '%',
        target: 98,
        dec: 1,
        lower: false,
        red: [97.8, 98.2, 98.5, 98.1, 98.6, 98.9, 98.4, 98.8, null, null, null, null],
        white: [97.5, 98.0, 98.1, 98.4, 98.2, 98.5, 98.7, 98.6, null, null, null, null],
      },
      comment: 'Partisipasi ide Kaizen rata-rata 2.3 ide per orang per bulan.',
    },
    proses: {
      template: 'proses',
      title: 'GAP KOMPETENSI TIM QAE',
      subtitle: 'Kebutuhan Training Berdasarkan Matriks Skill',
      causes: [
        { n: 'CMM Programming', v: 6 },
        { n: 'SPC & Minitab', v: 4 },
        { n: 'Gage R&R / MSA', v: 3 },
        { n: 'IATF Core Tools', v: 2 },
      ],
      conclusion: 'Prioritas training Q4: CMM Programming & SPC untuk 6 inspector junior.',
      comment: 'Evaluasi dilakukan setiap akhir kuartal.',
    },
    kaizen: {
      template: 'kaizen',
      title: 'KAIZEN HR & QCC CIRCLE',
      subtitle: 'Program Pengembangan SDM & Gugus Kendali Mutu',
      items: [
        {
          no: '1',
          problem: 'Inspector baru butuh 3 minggu untuk hafal 42 titik defect',
          countermeasure: 'Buat Dojo Visual Limit Sample + kuis interaktif tablet',
          pic: 'S. Wulandari',
          due: '14 Nov',
          status: 'Selesai',
          beforeVal: '21 hari',
          afterVal: '7 hari',
        },
        {
          no: '2',
          problem: 'Ketergantungan pada 1 orang PIC untuk analisa CMM',
          countermeasure: 'Cross-training 4 inspector shift Red & White',
          pic: 'D. Kurniawan',
          due: '05 Des',
          status: 'Proses',
          beforeVal: '1 PIC',
          afterVal: '5 PIC',
        },
        {
          no: '3',
          problem: 'Penyusunan laporan QCC 8 Langkah memakan waktu',
          countermeasure: 'Gunakan template standar QAEactivity digital',
          pic: 'N. Fatulah',
          due: '20 Des',
          status: 'Selesai',
          beforeVal: '6 jam',
          afterVal: '1.5 jam',
        },
      ],
      comment: '2 Gugus QCC QAE meraih Gold Award tingkat Plant.',
    },
  },
};

export interface ActivityProgram {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  desc: string;
  highlight: string;
  badge: string;
  gradient: string;
  accent: string;
  records: {
    id: string;
    team: string;
    theme: string;
    pic: string;
    progress: number;
    status: 'Selesai' | 'On Progress' | 'Review';
    impact: string;
  }[];
}

export const ACTIVITY_PROGRAMS: ActivityProgram[] = [
  {
    slug: 'qcc',
    code: 'QCC',
    title: 'Quality Control Circle',
    subtitle: 'Gugus Kendali Mutu 8 Langkah PDCA',
    desc: 'Pemecahan masalah kualitas berbasis data ilmiah menggunakan 8 Langkah PDCA & 7 QC Tools.',
    highlight: '6 Gugus • Gold Award',
    badge: '8 Langkah PDCA',
    gradient: 'from-indigo-600 via-blue-600 to-cyan-500',
    accent: 'text-indigo-400',
    records: [
      { id: 'QCC-01', team: 'Circle Zero-Defect', theme: 'Reduksi Spatter Flange Bracket LH hingga 85%', pic: 'R. Pratama', progress: 100, status: 'Selesai', impact: 'FPY +0.18%' },
      { id: 'QCC-02', team: 'Circle Jidoka', theme: 'Eliminasi Nut Missing dengan Interlock Sensor', pic: 'D. Kurniawan', progress: 100, status: 'Selesai', impact: '0 Outflow' },
      { id: 'QCC-03', team: 'Circle Metrology', theme: 'Percepatan Analisa CMM Lot Sampling', pic: 'N. Fatulah', progress: 75, status: 'On Progress', impact: '-20 mnt/lot' },
    ],
  },
  {
    slug: 'sga',
    code: 'SGA',
    title: 'Small Group Activity',
    subtitle: 'Kaizen Tim Kecil & Poka-Yoke',
    desc: 'Wadah ide kreatif inspector: pemangkasan gerak inspeksi, ergonomi kerja, dan alat bantu Poka-Yoke.',
    highlight: '18 Tema Aktif',
    badge: 'Kaizen Circle',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    accent: 'text-amber-400',
    records: [
      { id: 'SGA-01', team: 'Regu Red A', theme: 'Shadow Board Gauge & Go/No-Go Terintegrasi', pic: 'A. Hidayat', progress: 100, status: 'Selesai', impact: 'Cari alat -70%' },
      { id: 'SGA-02', team: 'Regu White B', theme: 'Lampu LED Sudut 45° untuk Deteksi Dent Halus', pic: 'S. Wulandari', progress: 85, status: 'On Progress', impact: 'Deteksi +35%' },
    ],
  },
  {
    slug: '5r',
    code: '5R',
    title: '5R / 5S Lab & Q-Gate',
    subtitle: 'Ringkas, Rapi, Resik, Rawat, Rajin',
    desc: 'Standar kebersihan area laboratorium metrologi, shadow board alat ukur, dan kontrol Red Bin NG.',
    highlight: 'Audit Skor 98.8%',
    badge: 'Budaya Kerja',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    accent: 'text-emerald-400',
    records: [
      { id: '5R-01', team: 'Lab CMM', theme: 'Zonasi Lantai & Rak Kalibrasi Color-Coded', pic: 'D. Kurniawan', progress: 100, status: 'Selesai', impact: 'Skor 99.2%' },
      { id: '5R-02', team: 'Q-Gate Pos 1-4', theme: 'Standardisasi Red Bin Barcode & Area Quarantine', pic: 'M. Yusuf', progress: 90, status: 'Review', impact: '0 Mix Part' },
    ],
  },
  {
    slug: 'sw-observasi',
    code: 'SW',
    title: 'SW Observasi QAE',
    subtitle: 'Standardized Work Observation',
    desc: 'Observasi kepatuhan siklus inspeksi terhadap elemen baku (SWCT) & konsistensi pengecekan CTQ.',
    highlight: 'Kepatuhan 98.9%',
    badge: 'TPS Standar',
    gradient: 'from-sky-500 via-blue-600 to-indigo-600',
    accent: 'text-sky-400',
    records: [
      { id: 'SW-01', team: 'Q-Gate Final', theme: 'Observasi 12 Titik Inspeksi Visual Shift Red', pic: 'R. Pratama', progress: 100, status: 'Selesai', impact: '100% Patuh' },
      { id: 'SW-02', team: 'Q-Gate Final', theme: 'Observasi Cycle Time Pengecekan Torque', pic: 'S. Wulandari', progress: 80, status: 'On Progress', impact: 'CT 42s → 36s' },
    ],
  },
  {
    slug: 'patrol',
    code: 'LPA',
    title: 'Layered Process Audit',
    subtitle: 'Patrol Harian & Verifikasi 4M',
    desc: 'Verifikasi harian kepatuhan parameter proses, Poka-Yoke master sample, dan kontrol perubahan 4M.',
    highlight: '98.0% Compliance',
    badge: 'Daily Patrol',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
    accent: 'text-violet-400',
    records: [
      { id: 'LPA-01', team: 'Shift Red', theme: 'Verifikasi Master Sample Poka-Yoke Awal Shift', pic: 'A. Hidayat', progress: 100, status: 'Selesai', impact: '30/30 Hari OK' },
      { id: 'LPA-02', team: 'Shift White', theme: 'Audit Kontrol Perubahan 4M (Henkaten)', pic: 'M. Yusuf', progress: 95, status: 'Review', impact: '100% Logged' },
    ],
  },
];

export const VOICE_FEED = [
  {
    id: 'VM-104',
    shift: 'Red',
    area: 'Q-Gate Pos #2',
    author: 'R. Pratama',
    problem: 'Pencahayaan di sudut inspeksi LH kurang merata pada shift malam.',
    action: 'Tambah LED bar 5000K sudut 45° — selesai dipasang.',
    status: 'Closed',
    time: 'Hari ini, 09:15',
  },
  {
    id: 'VM-103',
    shift: 'White',
    area: 'Lab CMM',
    author: 'D. Kurniawan',
    problem: 'Fixture CF-108 perlu pengencangan clamp agar Gage R&R tetap < 5%.',
    action: 'Ganti seal pneumatic & kalibrasi ulang — dalam verifikasi.',
    status: 'On Progress',
    time: 'Kemarin, 21:40',
  },
  {
    id: 'VM-102',
    shift: 'Red',
    area: 'Sub-Assy Line',
    author: 'S. Wulandari',
    problem: 'Limit sample defect cosmetic versi lama masih tertempel di papan.',
    action: 'Update dengan limit sample Rev.04 + tanggal berlaku.',
    status: 'Closed',
    time: '2 hari lalu',
  },
];
