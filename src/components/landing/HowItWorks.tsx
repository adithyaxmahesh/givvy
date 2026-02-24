'use client';

import { motion } from 'framer-motion';
import { Card } from './ui/Card';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ─── Beginner Card Content ────────────────────────────────────── */
function BeginnerCard() {
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Beginner</h3>
      <p className="text-sm text-gray-500 mb-5">For users of all skill levels</p>

      <div className="space-y-3">
        {[
          { label: 'Step 1', desc: 'Fundamentals of crypto', active: true },
          { label: 'Step 2', desc: 'Wallet setup & security', active: true },
          { label: 'Step 3', desc: 'Your first transaction', active: false },
        ].map((step) => (
          <div key={step.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <span className="text-[10px] font-bold text-lime-600 uppercase tracking-wide">{step.label}</span>
              <p className="text-xs text-gray-700 font-medium">{step.desc}</p>
            </div>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${step.active ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${step.active ? 'left-[18px]' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Community Card Content ───────────────────────────────────── */
function CommunityCard() {
  const avatarGradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
  ];

  return (
    <Card className="p-6 h-full">
      <div className="flex -space-x-2 mb-4">
        {avatarGradients.map((g, i) => (
          <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" style={{ background: g }} />
        ))}
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-lime flex items-center justify-center text-xs font-bold text-[#1a1a1a]">
          +
        </div>
      </div>
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Community</h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        Like-minded individuals and experts eager to share insights
      </p>
    </Card>
  );
}

/* ─── Advanced Card Content ────────────────────────────────────── */
function AdvancedCard() {
  const tools = Array.from({ length: 9 });
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Advanced</h3>
      <div className="grid grid-cols-3 gap-2.5">
        {tools.map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl border border-gray-100 flex items-center justify-center ${
              i === 7 ? 'bg-red-50' : 'bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded ${i === 7 ? 'bg-red-300' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── News Card Content ────────────────────────────────────────── */
function NewsCard() {
  const sources = ['BE(IN)CRYPTO', 'Decrypt', 'CoinDesk', 'U.TODAY'];
  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">Explore News From Sources You Want</h3>
      <p className="text-sm text-gray-500 mb-5">Customize your news feed to suit your needs.</p>
      <div className="space-y-3">
        {sources.map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-gray-300" />
            </div>
            <span className="text-sm font-semibold text-[#1a1a1a]">{s}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Tools Grid Card ──────────────────────────────────────────── */
function ToolsGridCard() {
  return (
    <Card className="p-6 h-full">
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Explore dozens of crypto tools, reviewed by category
      </p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <div className="w-5 h-5 rounded bg-gray-200" />
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
          <motion.div variants={fadeUp}><BeginnerCard /></motion.div>
          <motion.div variants={fadeUp}><CommunityCard /></motion.div>
          <motion.div variants={fadeUp}><AdvancedCard /></motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid md:grid-cols-[1.2fr_0.8fr] gap-5"
        >
          <motion.div variants={fadeUp}><NewsCard /></motion.div>
          <motion.div variants={fadeUp}><ToolsGridCard /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
