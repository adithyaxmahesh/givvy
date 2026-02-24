'use client';

import { motion } from 'framer-motion';
import { Card } from './ui/Card';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ─── For Startups Card ────────────────────────────────────────── */
function StartupsCard() {
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">For Startups</h3>
      <p className="text-sm text-gray-500 mb-5">Hire without burning cash</p>

      <div className="space-y-3">
        {[
          { step: 'Step 1', desc: 'Post a project with equity terms', active: true },
          { step: 'Step 2', desc: 'Review matched professionals', active: true },
          { step: 'Step 3', desc: 'Close with a SAFE agreement', active: false },
        ].map((s) => (
          <div key={s.step} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">{s.step}</span>
              <p className="text-xs text-gray-700 font-medium">{s.desc}</p>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${s.active ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${s.active ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── For Professionals Card ───────────────────────────────────── */
function ProfessionalsCard() {
  const roles = [
    { label: 'Lawyers', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { label: 'Engineers', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    { label: 'Designers', gradient: 'linear-gradient(135deg,#f472b6,#ec4899)' },
  ];

  return (
    <Card className="p-6 h-full">
      <div className="flex -space-x-2 mb-4">
        {roles.map((r, i) => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-white" style={{ background: r.gradient }}>
            {r.label[0]}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-lime flex items-center justify-center text-xs font-bold text-[#1a1a1a]">
          +
        </div>
      </div>
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">For Professionals</h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        Earn equity in early-stage startups. Build a diversified portfolio by investing your expertise instead of cash.
      </p>
    </Card>
  );
}

/* ─── SAFE-Backed Card ─────────────────────────────────────────── */
function SafeCard() {
  const features = [
    'YC-standard', 'Milestone\nvesting', 'Cap table\ntracking',
    'Legal\nprotection', 'Equity\ngrants', 'Valuation\ncaps',
    'Pro-rata\nrights', 'Digital\nsigning', 'Audit\ntrail',
  ];
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">SAFE-Backed</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {features.map((f, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl border border-gray-100 flex items-center justify-center text-center p-1 ${
              i === 0 ? 'bg-brand-50' : 'bg-gray-50'
            }`}
          >
            <span className={`text-[9px] font-semibold leading-tight whitespace-pre-line ${i === 0 ? 'text-brand-700' : 'text-gray-500'}`}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Equity Workflow Card ─────────────────────────────────────── */
function WorkflowCard() {
  const steps = [
    { num: '01', title: 'Scope & Valuation', desc: 'Startup and professional agree on deliverables and equity terms.' },
    { num: '02', title: 'SAFE Executed', desc: 'Compensation structured via SAFE note or equity grant with milestone vesting.' },
    { num: '03', title: 'Work Delivered', desc: 'Milestones hit, equity unlocks. Tracked transparently on Givvy.' },
  ];
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">How Equity Works</h3>
      <p className="text-sm text-gray-500 mb-5">Work turns into ownership</p>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.num} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {s.num}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{s.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Who Uses Givvy Card ──────────────────────────────────────── */
function WhoUsesCard() {
  const roles = ['Lawyers', 'Developers', 'Designers', 'Marketers', 'Accountants', 'Consultants'];
  return (
    <Card className="p-6 h-full">
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Professionals earning equity on Givvy
      </p>
      <div className="grid grid-cols-2 gap-2">
        {roles.map((r) => (
          <div key={r} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-sm font-semibold text-[#1a1a1a]">{r}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-charcoal landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-white text-center mb-14"
        >
          How It Works
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5 mb-5"
        >
          <motion.div variants={fadeUp}><StartupsCard /></motion.div>
          <motion.div variants={fadeUp}><ProfessionalsCard /></motion.div>
          <motion.div variants={fadeUp}><SafeCard /></motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-[1.2fr_0.8fr] gap-5"
        >
          <motion.div variants={fadeUp}><WorkflowCard /></motion.div>
          <motion.div variants={fadeUp}><WhoUsesCard /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
