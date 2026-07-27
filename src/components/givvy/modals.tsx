'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { PrimaryButton } from './buttons';
import { IconAlertCircle, IconCheckCircle } from './icons';
import { Field, Modal } from './modal';

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

type LeadSource = 'book-intro' | 'get-deck';

function SuccessNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[11px] border border-au-edge-green bg-au-tint-green px-4 py-4">
      <IconCheckCircle className="mt-[1px] h-[18px] w-[18px] shrink-0 text-au-step-green" />
      <div>
        <p className="text-[13px] font-semibold text-au-navy">{title}</p>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-au-ink">{body}</p>
      </div>
    </div>
  );
}

function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[11px] border border-au-edge-gold bg-au-tint-gold px-4 py-3.5"
    >
      <IconAlertCircle className="mt-[1px] h-[17px] w-[17px] shrink-0 text-au-step-gold" />
      <p className="text-[12.5px] leading-[1.6] text-au-ink">
        {message}{' '}
        <a href="mailto:intro@givvy.com" className="font-medium text-au-navy underline decoration-au-navy/30">
          Email us instead
        </a>
        .
      </p>
    </div>
  );
}

/** Posts landing page form submissions to /api/leads so every request is recorded. */
function useLeadSubmit(source: LeadSource, open: boolean) {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setSubmitted(false);
    setError(null);
    setPending(false);
  }, [open]);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (pending) return;

      const form = new FormData(event.currentTarget);
      setPending(true);
      setError(null);

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            name: String(form.get('name') ?? ''),
            email: String(form.get('email') ?? ''),
            phone: String(form.get('phone') ?? ''),
            firm: String(form.get('firm') ?? ''),
            context: String(form.get('context') ?? ''),
          }),
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          setError(payload?.error || 'Something went wrong on our end.');
          return;
        }
        setSubmitted(true);
      } catch {
        setError('We could not reach the server.');
      } finally {
        setPending(false);
      }
    },
    [pending, source]
  );

  return { pending, submitted, error, submit };
}

export function BookIntroModal({ open, onClose }: DialogProps) {
  const { pending, submitted, error, submit } = useLeadSubmit('book-intro', open);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Book an intro"
      description="Tell us which services you need and we'll follow up within one business day."
    >
      {submitted ? (
        <div className="space-y-5">
          <SuccessNote
            title="Request received"
            body="A Givvy principal will reach out shortly with a few times to meet."
          />
          <PrimaryButton size="md" withArrow={false} className="w-full" onClick={onClose}>
            Close
          </PrimaryButton>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Jane Whitmore" required disabled={pending} autoComplete="name" />
            <Field label="Work email" name="email" type="email" placeholder="jane@holdco.com" required disabled={pending} autoComplete="email" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone number" name="phone" type="tel" placeholder="+1 415 555 0142" disabled={pending} autoComplete="tel" />
            <Field label="Company / Firm" name="firm" placeholder="Whitmore Capital" disabled={pending} autoComplete="organization" />
          </div>
          <Field
            label="What services are you looking to receive?"
            name="context"
            placeholder="Buy-side M&A and SPV setup for a $40M industrial services acquisition…"
            textarea
            disabled={pending}
          />
          {error && <ErrorNote message={error} />}
          <PrimaryButton size="md" className="mt-1 w-full" type="submit" disabled={pending}>
            {pending ? 'Sending…' : 'Request intro'}
          </PrimaryButton>
          <p className="text-center text-[11.5px] leading-[1.6] text-au-ink-soft">
            Confidential. We never share deal information.
          </p>
        </form>
      )}
    </Modal>
  );
}

export function GetDeckModal({ open, onClose }: DialogProps) {
  const { pending, submitted, error, submit } = useLeadSubmit('get-deck', open);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Get the deck"
      description="An 18-page overview of the Givvy execution layer, services, and coverage."
    >
      {submitted ? (
        <div className="space-y-5">
          <SuccessNote title="On its way" body="Check your inbox — the Givvy overview deck is sending now." />
          <PrimaryButton size="md" withArrow={false} className="w-full" onClick={onClose}>
            Close
          </PrimaryButton>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Work email" name="email" type="email" placeholder="jane@holdco.com" required disabled={pending} autoComplete="email" />
          <Field label="Company / Firm" name="firm" placeholder="Whitmore Capital" disabled={pending} autoComplete="organization" />
          {error && <ErrorNote message={error} />}
          <PrimaryButton size="md" className="mt-1 w-full" type="submit" disabled={pending}>
            {pending ? 'Sending…' : 'Send me the deck'}
          </PrimaryButton>
          <p className="text-center text-[11.5px] leading-[1.6] text-au-ink-soft">
            No newsletter. One email with the deck attached.
          </p>
        </form>
      )}
    </Modal>
  );
}
