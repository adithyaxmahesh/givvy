'use client';

import { useState } from 'react';
import { BottomCta } from './bottom-cta';
import { Hero } from './hero';
import {
  RightForWrongFor,
  WhatYouGet,
} from './home-sections';
import { HowItWorks } from './how-it-works';
import { InAction } from './in-action';
import { BookIntroModal, GetDeckModal } from './modals';
import { Nav } from './nav';
import { Services } from './services';
import { SiteFooter } from './site-footer';
import { TrustStrip } from './trust-strip';
import { WhoItsFor } from './who-its-for';

type Dialog = 'intro' | 'deck' | null;

export function GivvyLanding() {
  const [dialog, setDialog] = useState<Dialog>(null);

  const openIntro = () => setDialog('intro');
  const openDeck = () => setDialog('deck');
  const close = () => setDialog(null);

  return (
    <div className="au-page font-sans antialiased">
      <Nav onBookIntro={openIntro} />
      <main>
        <Hero onBookIntro={openIntro} />
        <TrustStrip />
        <Services />
        <WhatYouGet />
        <HowItWorks />
        <RightForWrongFor />
        <WhoItsFor />
        <InAction />
        <BottomCta onBookIntro={openIntro} onGetDeck={openDeck} />
      </main>
      <SiteFooter />

      <BookIntroModal open={dialog === 'intro'} onClose={close} />
      <GetDeckModal open={dialog === 'deck'} onClose={close} />
    </div>
  );
}
