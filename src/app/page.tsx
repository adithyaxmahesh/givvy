/**
 * VIDEO TUNING POINTS
 * ─────────────────────────────────────────────────────────────────
 * Quick-access knobs to tweak the landing page look & feel:
 *
 * LIME SHADE        → tailwind.config.ts  colors.lime       (currently #D4F53C)
 * CREAM SHADE       → tailwind.config.ts  colors.cream      (currently #F5F0E8)
 * DARK SHADE        → tailwind.config.ts  colors.charcoal   (currently #2D2D2D)
 *
 * FONT CHOICE       → src/app/layout.tsx  Inter + Sora imports
 *                      tailwind.config.ts  fontFamily.display
 *
 * HERO ICON POS     → src/components/landing/Hero.tsx  heroIcons[] array
 *                      Each entry: { x, y, size, rotate, driftAmount, parallaxSpeed }
 *                      Icons represent service types: legal, code, design, marketing, etc.
 *
 * SECTION PADDING   → src/components/landing/Section.tsx  default py classes
 *                      Or override per-section via className prop
 *
 * ANIM INTENSITY    → FloatingIcon driftAmount (px), driftDuration (seconds)
 *                      Section.tsx  useTransform ranges for reveal
 *                      PhoneMock float amplitude (Hero.tsx / FeatureGateway.tsx)
 *
 * ANIM DURATIONS    → Each FloatingIcon.driftDuration (3–8s typical)
 *                      Section reveal offset in Section.tsx (currently 'start 0.25')
 *                      SmoothScroll.tsx lenis duration (currently 1.2)
 *
 * PARALLAX SPEED    → Each floating element parallaxSpeed (0.3 = subtle, 1.5 = heavy)
 *
 * NOISE INTENSITY   → globals.css  .landing-noise::after  opacity (currently 0.025)
 *
 * COPY / BRANDING   → Hero.tsx (headline, badge, subtitle)
 *                      FeatureGateway.tsx (heading, stats, phone content)
 *                      HowItWorks.tsx (card content, workflow steps)
 *                      Community.tsx (title, description)
 *                      Networking.tsx (portfolio phone, sector pills)
 *                      Footer.tsx (description, disclaimer, links)
 * ─────────────────────────────────────────────────────────────────
 */

'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { FeatureGateway } from '@/components/landing/FeatureGateway';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Community } from '@/components/landing/Community';
import { Networking } from '@/components/landing/Networking';
import { Footer } from '@/components/landing/Footer';
import { SmoothScroll } from '@/components/landing/SmoothScroll';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="overflow-x-hidden">
        <Navbar />
        <Hero />
        <FeatureGateway />
        <HowItWorks />
        <Community />
        <Networking />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
