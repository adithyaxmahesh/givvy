'use client';

import { motion, type Variants } from 'framer-motion';
import { Card } from './ui/Card';

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};

function StartupsCard() {
  return (
    <Card hover className="p-6 h-full group">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">For Startups</h3>
      <p className="text-sm text-gray-500 mb-5">Hire without burning cash</p>

      <div className="space-y-3">
        {[
          { step: 'Step 1', desc: 'Post a project with equity terms', active: true },
          { step: 'Step 2', desc: 'Review matched professionals', active: true },
          { step: 'Step 3', desc: 'Close with a SAFE agreement', active: false },
        ].map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
          >
            <div>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">{s.step}</span>
              <p className="text-xs text-gray-700 font-medium">{s.desc}</p>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${s.active ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${s.active ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function ProfessionalsCard() {
  const roles = [
    { label: 'Lawyers', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
    { label: 'Engineers', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    { label: 'Designers', gradient: 'linear-gradient(135deg,#f472b6,#ec4899)' },
  ];

  return (
    <Card hover className="p-6 h-full">
      <div className="flex -space-x-2 mb-4">
        {roles.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: -8 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: r.gradient }}
          >
            {r.label[0]}
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 20 }}
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-lime flex items-center justify-center text-xs font-bold text-[#1a1a1a]"
        >
          +
        </motion.div>
      </div>
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">For Professionals</h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        Earn equity in early-stage startups. Build a diversified portfolio by investing your expertise instead of cash.
      </p>
    </Card>
  );
}

function SafeCard() {
  const features = [
    'YC-standard', 'Milestone\nvesting', 'Cap table\ntracking',
    'Legal\nprotection', 'Equity\ngrants', 'Valuation\ncaps',
    'Pro-rata\nrights', 'Digital\nsigning', 'Audit\ntrail',
  ];
  return (
    <Card hover className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">SAFE-Backed</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.35 }}
            className={`aspect-square rounded-xl border border-gray-100 flex items-center justify-center text-center p-1 transition-colors hover:bg-brand-50 ${
              i === 0 ? 'bg-brand-50' : 'bg-gray-50'
            }`}
          >
            <span className={`text-[9px] font-semibold leading-tight whitespace-pre-line ${i === 0 ? 'text-brand-700' : 'text-gray-500'}`}>
              {f}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function WorkflowCard() {
  const steps = [
    { num: '01', title: 'Scope & Valuation', desc: 'Startup and professional agree on deliverables and equity terms.' },
    { num: '02', title: 'SAFE Executed', desc: 'Compensation structured via SAFE note or equity grant with milestone vesting.' },
    { num: '03', title: 'Work Delivered', desc: 'Milestones hit, equity unlocks. Tracked transparently on Givvy.' },
  ];
  return (
    <Card hover className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">How Equity Works</h3>
      <p className="text-sm text-gray-500 mb-5">Work turns into ownership</p>
      <div className="space-y-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {s.num}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">{s.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function WhoUsesCard() {
  const roles = ['Lawyers', 'Developers', 'Designers', 'Marketers', 'Accountants', 'Consultants'];
  return (
    <Card hover className="p-6 h-full">
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Professionals earning equity on Givvy
      </p>
      <div className="grid grid-cols-2 gap-2">
        {roles.map((r, i) => (
          <motion.div
            key={r}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-sm font-semibold text-[#1a1a1a]">{r}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-charcoal landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-md mx-auto">
            From first post to equity ownership — in three simple steps.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5 mb-5"
        >
          <motion.div variants={fadeLeft}><StartupsCard /></motion.div>
          <motion.div variants={fadeUp}><ProfessionalsCard /></motion.div>
          <motion.div variants={fadeRight}><SafeCard /></motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-[1.2fr_0.8fr] gap-5"
        >
          <motion.div variants={fadeLeft}><WorkflowCard /></motion.div>
          <motion.div variants={fadeRight}><WhoUsesCard /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
