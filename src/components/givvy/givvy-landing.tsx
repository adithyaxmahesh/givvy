'use client';

import { useState } from 'react';
import { BottomCta } from './bottom-cta';
import { Hero } from './hero';
import {
  RightForWrongFor,
  StartupsNote,
  TheBuyers,
  WhatOwnersWorryAbout,
  WhatYouGet,
  WhyNoVertical,
} from './home-sections';
import { BookIntroModal, GetDeckModal } from './modals';
import { Nav } from './nav';
import { SiteFooter } from './site-footer';

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
        <WhatYouGet />
        <RightForWrongFor />
        <WhatOwnersWorryAbout />
        <WhyNoVertical />
        <TheBuyers />
        <StartupsNote />
        <BottomCta onBookIntro={openIntro} onGetDeck={openDeck} />
      </main>
      <SiteFooter />

      <BookIntroModal open={dialog === 'intro'} onClose={close} />
      <GetDeckModal open={dialog === 'deck'} onClose={close} />
    </div>
  );
}
