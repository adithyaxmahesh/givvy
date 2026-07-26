'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { IconClose, StarFour } from './icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const firstField = panelRef.current?.querySelector<HTMLElement>('input, textarea, button');
    firstField?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocusTo.current?.focus({ preventScroll: true });
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-[#14243D]/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="au-modal-title"
            aria-describedby="au-modal-description"
            className="relative w-full max-w-[452px] overflow-hidden rounded-[18px] border border-au-line bg-au-cream shadow-[0_30px_80px_-30px_rgba(20,36,61,0.45)]"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-b border-au-line/70 bg-white/60 px-7 pb-6 pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <StarFour className="mb-3 h-[15px] w-[15px] text-au-blue-bright" />
                  <h2
                    id="au-modal-title"
                    className="font-editorial text-[24px] font-normal leading-[1.15] tracking-[-0.01em] text-au-navy"
                  >
                    {title}
                  </h2>
                  <p id="au-modal-description" className="mt-2 max-w-[320px] text-[13px] leading-[1.6] text-au-ink">
                    {description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-au-ink-soft transition-colors hover:bg-au-wash hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="px-7 py-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  disabled?: boolean;
}

export function Field({ label, name, type = 'text', placeholder, required, textarea, disabled }: FieldProps) {
  const shared =
    'w-full rounded-[9px] border border-au-line bg-white px-3.5 py-2.5 text-[13px] text-au-navy placeholder:text-au-ink-soft/70 transition-shadow focus:border-au-blue/50 focus:outline-none focus:ring-2 focus:ring-au-blue/15 disabled:opacity-60';

  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.09em] text-au-ink-soft">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={shared}
        />
      )}
    </label>
  );
}
