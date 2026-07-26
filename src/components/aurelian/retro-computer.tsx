'use client';

import type { CSSProperties } from 'react';
import { IconTemple, StarFour } from './icons';

/**
 * Beige Macintosh-style desk scene: monitor, floppy slot, sticky note,
 * keyboard, mouse and mug. Authored in em units on the 92x62em stage
 * (see `.au-stage` in globals.css) so the whole scene scales as one object.
 */

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

function box(left: number, top: number, width: number, height: number): CSSProperties {
  return { position: 'absolute', left: `${left}em`, top: `${top}em`, width: `${width}em`, height: `${height}em` };
}

const PROGRESS_SEGMENTS = 13;
const PROGRESS_FILLED = 7;

function Screen() {
  return (
    <div
      style={{
        ...box(27.6, 12.6, 31.2, 19.5),
        borderRadius: '1.6em',
        background:
          'radial-gradient(120% 100% at 20% 6%, #2E5273 0%, #1E3854 40%, #16283C 80%, #112132 100%)',
        boxShadow:
          'inset 0 0 0 0.26em #0B1622, inset 0 0.34em 1.6em rgba(0,0,0,0.5), 0 0 0.5em rgba(10,20,32,0.35)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.045) 0 0.1em, transparent 0.1em 0.34em)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(126deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0) 32%)',
        }}
      />

      <div style={{ position: 'absolute', inset: 0, padding: '1.7em 1.9em' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: MONO, fontSize: '1.02em', letterSpacing: '0.1em', color: '#CBDDF0' }}>
            AURELIAN OS v1.0
          </span>
          <span aria-hidden style={{ position: 'relative', color: '#8FB6DC', lineHeight: 0 }}>
            <StarFour style={{ width: '1.4em', height: '1.4em', opacity: 0.85 }} />
            <StarFour style={{ position: 'absolute', left: '1.5em', top: '-0.35em', width: '0.72em', height: '0.72em', opacity: 0.6 }} />
          </span>
        </div>

        <div
          style={{
            marginTop: '1em',
            height: '0.1em',
            background: 'linear-gradient(90deg, rgba(180,208,235,0.6), rgba(180,208,235,0.14))',
          }}
        />

        <p style={{ margin: '1.35em 0 0', fontFamily: MONO, fontSize: '1.02em', letterSpacing: '0.02em', color: '#A9C8E6' }}>
          &gt; Executing ownership workflows...
          <span className="au-caret" style={{ marginLeft: '0.35em', width: '0.52em', height: '1.05em' }} />
        </p>

        <div style={{ position: 'absolute', left: 0, right: 0, top: '7em', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '12.4em', height: '8.4em' }}>
            <svg viewBox="0 0 124 84" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <ellipse
                cx="62"
                cy="43"
                rx="40"
                ry="31"
                fill="none"
                stroke="#9FC0DE"
                strokeOpacity="0.4"
                strokeWidth="1"
                strokeDasharray="2 4"
                transform="rotate(-16 62 43)"
              />
            </svg>
            <IconTemple
              style={{
                position: 'absolute',
                left: '2.8em',
                top: '1.1em',
                width: '6.8em',
                height: '6.8em',
                color: '#DCEAF7',
              }}
            />
            <StarFour style={{ position: 'absolute', left: '0.3em', top: '3em', width: '1.3em', height: '1.3em', color: '#CFE2F3', opacity: 0.8 }} />
            <StarFour style={{ position: 'absolute', right: '0.5em', top: '5.6em', width: '0.8em', height: '0.8em', color: '#CFE2F3', opacity: 0.55 }} />
          </div>
        </div>

        <div style={{ position: 'absolute', left: '1.9em', right: '1.9em', bottom: '1.7em', display: 'flex', alignItems: 'center', gap: '0.8em' }}>
          <div style={{ display: 'flex', flex: 1, gap: '0.24em' }}>
            {Array.from({ length: PROGRESS_SEGMENTS }).map((_, index) => (
              <span
                key={index}
                style={{
                  flex: 1,
                  height: '0.68em',
                  borderRadius: '0.06em',
                  background: index < PROGRESS_FILLED ? '#5C9AE0' : 'rgba(178,205,230,0.26)',
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: '0.86em', letterSpacing: '0.06em', color: '#B7D0E8' }}>100%</span>
        </div>
      </div>
    </div>
  );
}

function StickyNote() {
  return (
    <div
      style={{
        ...box(51.4, 37.8, 9, 8.3),
        transform: 'rotate(-1.6deg)',
        background: 'linear-gradient(168deg, #F6EAC1 0%, #EFE0AC 60%, #E6D598 100%)',
        boxShadow: '0 0.45em 1.1em -0.4em rgba(70,58,30,0.42), inset 0 0 0.6em rgba(255,255,255,0.4)',
        padding: '1.05em 1em',
        fontFamily: 'var(--font-newsreader), Georgia, serif',
        fontStyle: 'italic',
        fontSize: '0.86em',
        lineHeight: 1.6,
        color: '#5A4F35',
      }}
    >
      Ownership
      <br />
      is a system.
      <br />
      We automate it.
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '1.9em',
          height: '1.9em',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.14) 100%)',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </div>
  );
}

function Keyboard() {
  const rows = [13, 13, 12, 11, 3];

  return (
    <div style={{ ...box(0.8, 49.4, 44.4, 10.4), perspective: '96em', perspectiveOrigin: '50% 0%' }}>
      <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(64deg) rotateZ(-1.4deg)', transformStyle: 'preserve-3d' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '1.1em',
            background: 'linear-gradient(178deg, #EFE7D5 0%, #E0D5BD 46%, #CBBEA1 100%)',
            boxShadow: '0 1.8em 2.4em -0.7em rgba(90,78,58,0.42), inset 0 0 0 0.1em rgba(255,255,255,0.5)',
            padding: '1.2em 1.5em',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
            {rows.map((count, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', gap: '0.4em' }}>
                {Array.from({ length: count }).map((_, keyIndex) => (
                  <span
                    key={keyIndex}
                    style={{
                      flex: rowIndex === 4 && keyIndex === 1 ? 7 : 1,
                      height: '1.5em',
                      borderRadius: '0.26em',
                      background: 'linear-gradient(180deg, #F7F1E5 0%, #E7DDC8 70%, #D2C5A9 100%)',
                      boxShadow: '0 0.14em 0.18em rgba(120,105,80,0.4)',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '1.4em',
          right: '1.4em',
          bottom: '0.1em',
          height: '1.2em',
          borderRadius: '0 0 1em 1em',
          background: 'linear-gradient(180deg, #D3C7AE 0%, #BCAF91 100%)',
          boxShadow: '0 0.5em 0.9em -0.35em rgba(90,78,58,0.45)',
        }}
      />
    </div>
  );
}

function Mouse() {
  return (
    <div style={box(55.9, 57.4, 11.7, 5.4)}>
      <svg viewBox="0 0 96 54" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="au-mouse-top" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#F3ECDD" />
            <stop offset="1" stopColor="#DBD0B7" />
          </linearGradient>
          <linearGradient id="au-mouse-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CDC0A4" />
            <stop offset="1" stopColor="#B2A487" />
          </linearGradient>
        </defs>
        <ellipse cx="52" cy="49" rx="38" ry="5" fill="#B3A88E" opacity="0.32" />
        <path d="M14 34 L32 14 Q34 11 38 11 L78 11 Q83 11 83 16 L83 34 Q83 39 78 39 L19 39 Q14 39 14 34Z" fill="url(#au-mouse-side)" />
        <path d="M12 28 L30 8 Q32 5 36 5 L76 5 Q81 5 81 10 L81 28 Q81 33 76 33 L17 33 Q12 33 12 28Z" fill="url(#au-mouse-top)" />
        <path d="M22 18 Q38 16 54 16" fill="none" stroke="#B7A98C" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Mug() {
  return (
    <div style={box(69, 45.3, 15.6, 12.6)}>
      <svg viewBox="0 0 147 131" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="au-mug-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C6BBA6" />
            <stop offset="0.16" stopColor="#E8DFCE" />
            <stop offset="0.6" stopColor="#DCD2BF" />
            <stop offset="1" stopColor="#BEB29B" />
          </linearGradient>
          <linearGradient id="au-mug-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7C6A54" />
            <stop offset="1" stopColor="#9A8768" />
          </linearGradient>
        </defs>
        <ellipse cx="62" cy="126" rx="44" ry="6" fill="#B3A88E" opacity="0.3" />
        <path d="M100 42 q30 2 30 21 t-30 23" fill="none" stroke="#CCC1AA" strokeWidth="12.5" strokeLinecap="round" />
        <path d="M100 42 q30 2 30 21 t-30 23" fill="none" stroke="#E4DBC9" strokeWidth="5.5" strokeLinecap="round" opacity="0.7" />
        <path d="M18 32 h84 v70 q0 21 -21 21 H39 q-21 0 -21 -21 Z" fill="url(#au-mug-body)" />
        <ellipse cx="60" cy="32" rx="42" ry="10.5" fill="#EFE9DD" />
        <ellipse cx="60" cy="33" rx="33" ry="7" fill="url(#au-mug-inner)" />
        <text x="53" y="92" textAnchor="middle" fontFamily="var(--font-newsreader), Georgia, serif" fontSize="44" fill="#2E2C27">
          A
        </text>
        <text x="81" y="68" textAnchor="middle" fontFamily="var(--font-newsreader), Georgia, serif" fontSize="23" fill="#2E2C27">
          +
        </text>
      </svg>
    </div>
  );
}

export function RetroComputer() {
  return (
    <>
      {/* soft desk glow behind the machine */}
      <div
        aria-hidden
        style={{
          ...box(13, 2, 68, 58),
          background: 'radial-gradient(50% 46% at 52% 44%, rgba(255,255,255,0.9) 0%, rgba(252,247,240,0) 72%)',
        }}
      />

      {/* cast shadow on the desk */}
      <div
        aria-hidden
        style={{
          ...box(21, 53.4, 48, 7),
          borderRadius: '50%',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(122,106,80,0.32) 0%, rgba(122,106,80,0) 70%)',
          filter: 'blur(0.3em)',
        }}
      />

      {/* foot / pedestal the machine sits on */}
      <div
        aria-hidden
        style={{
          ...box(23.7, 46, 41, 9.8),
          borderRadius: '0.5em 0.8em 1.6em 1.6em',
          background: 'linear-gradient(178deg, #DBD0B9 0%, #CDC1A5 44%, #B7AA8C 100%)',
          boxShadow: '0 1.8em 2.6em -1.1em rgba(96,84,62,0.45)',
        }}
      />
      {/* vent grille + mouse port on the foot */}
      <div
        aria-hidden
        style={{
          ...box(46.1, 48.7, 8.8, 3.9),
          borderRadius: '0.3em',
          boxShadow: 'inset 0 0 0 0.1em rgba(150,134,106,0.4)',
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(124,110,86,0.5) 0 0.16em, rgba(226,216,196,0.85) 0.16em 0.5em)',
        }}
      />
      <div
        aria-hidden
        style={{
          ...box(55.9, 51.1, 3.4, 2.7),
          borderRadius: '0.25em',
          background: 'linear-gradient(180deg, #3A342A 0%, #23201A 100%)',
          boxShadow: 'inset 0 0 0 0.12em rgba(150,134,106,0.5)',
        }}
      />

      {/* monitor housing */}
      <div
        style={{
          ...box(22.2, 5.3, 44.9, 42.4),
          borderRadius: '4em 4em 1.2em 1.2em',
          background:
            'linear-gradient(170deg, #F2EADA 0%, #E8DECA 22%, #DCD0B7 54%, #CBBEA0 84%, #BFB194 100%)',
          boxShadow:
            'inset 0 0.22em 0.6em rgba(255,255,255,0.7), inset -2.2em 0 3em rgba(122,106,80,0.16), inset 1.2em 0 1.6em rgba(255,255,255,0.35), 0 2.4em 3.4em -1.6em rgba(96,84,62,0.5)',
        }}
      >
        {/* screen recess */}
        <div
          style={{
            position: 'absolute',
            left: '4.2em',
            top: '6.1em',
            width: '33.6em',
            height: '22.3em',
            borderRadius: '2.4em',
            background: 'linear-gradient(170deg, #DCD1BB 0%, #CDC1A7 100%)',
            boxShadow: 'inset 0 0.26em 0.8em rgba(112,96,72,0.5), inset 0 -0.2em 0.4em rgba(255,255,255,0.5)',
          }}
        />
        {/* floppy drive slot */}
        <div
          style={{
            position: 'absolute',
            left: '16.8em',
            top: '33.1em',
            width: '10.7em',
            height: '1.7em',
            borderRadius: '0.3em',
            background: 'linear-gradient(180deg, #C1B49A 0%, #E1D7C3 26%, #C9BDA3 100%)',
            boxShadow: 'inset 0 0.16em 0.34em rgba(106,92,70,0.55)',
          }}
        >
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '0.6em',
              right: '0.6em',
              top: '0.55em',
              height: '0.38em',
              borderRadius: '0.2em',
              background: '#6B5F4D',
              opacity: 0.72,
            }}
          />
        </div>
        {/* power indicator */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '1.5em',
            top: '36.1em',
            width: '1.6em',
            height: '1.6em',
            borderRadius: '0.22em',
            background: 'linear-gradient(150deg, #9E6355 0%, #79433C 100%)',
            boxShadow: 'inset 0 0 0.24em rgba(255,255,255,0.3)',
          }}
        />
        {/* side vent slits on the right cheek */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: '1.4em',
            top: '32.6em',
            width: '3.4em',
            height: '6.4em',
            borderRadius: '0.2em',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(124,110,86,0.34) 0 0.14em, transparent 0.14em 0.62em)',
          }}
        />
      </div>

      <Screen />
      <StickyNote />
      <Keyboard />
      <Mouse />
      <Mug />

      {/* mouse cable from the base port to the mouse */}
      <svg
        aria-hidden
        viewBox="0 0 920 620"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <path
          d="M581 545 C 585 562, 592 566, 590 574 C 588 582, 578 584, 572 588"
          fill="none"
          stroke="#8B8170"
          strokeWidth="2.3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </>
  );
}
