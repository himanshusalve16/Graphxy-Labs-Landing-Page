import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useWaitlistForm } from '../../utils/useWaitlistForm';

/**
 * WaitlistForm — Reusable waitlist form component.
 * Used by ForklineWaitlist and LatticeWaitlist.
 *
 * @param {Object}   props
 * @param {string}   props.formId           — Formspree form ID from env var
 * @param {string}   props.accentColor      — Brand color (e.g. '#92400E')
 * @param {string}   props.accentBg         — Light tint background (e.g. '#FEF7EC')
 * @param {string}   props.accentRing       — Focus ring color (e.g. '#FEF3E2')
 * @param {string}   props.buttonVariant    — Button variant ('forkline' | 'brand')
 * @param {string}   props.buttonLabel      — Submit button text
 * @param {string}   props.emailPlaceholder — Email field placeholder
 * @param {string}   props.subject          — Formspree email subject
 * @param {Function} props.buildMessage     — (name: string) => string for Formspree body
 * @param {string}   [props.successTitle]   — Success card heading
 * @param {string}   [props.successMessage] — Success card body text
 */
export default function WaitlistForm({
  formId,
  accentColor = '#1B3A6B',
  accentBg = '#EEF3FB',
  accentRing = '#EEF3FB',
  buttonVariant = 'brand',
  buttonLabel = 'Join Waitlist',
  emailPlaceholder = 'Enter your email address...',
  subject,
  buildMessage,
  successTitle = "You're on the list",
  successMessage = "Thank you for signing up. We've recorded your email and will reach out with early preview invitations soon.",
}) {
  const { register, handleSubmit, errors, status, errorMessage, onSubmit, retry } = useWaitlistForm({
    formId,
    subject,
    buildMessage,
  });

  // ── Success State ───────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <Card
        variant="surface"
        className="w-full max-w-md p-10 bg-white flex flex-col items-center text-center animate-fade-in mx-auto"
        style={{ borderColor: accentColor + '22', boxShadow: `0 4px 12px ${accentColor}14` }}
        role="alert"
        aria-live="polite"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: accentBg, color: accentColor }}
        >
          <Check size={24} strokeWidth={3} />
        </div>
        <h2 className="font-serif text-2xl text-[#0F0F0F] mb-3">{successTitle}</h2>
        <p className="text-sm text-[#525252] leading-relaxed">{successMessage}</p>
      </Card>
    );
  }

  // ── Form State ──────────────────────────────────────────────────────────────
  const fieldClass = (hasError) =>
    `bg-white rounded-xl px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all flex items-center border ${
      hasError
        ? 'border-red-400 ring-2 ring-red-100'
        : 'focus-within:ring-2'
    }`;

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
        noValidate
        style={{ touchAction: 'manipulation' }}
      >
        {/* Name — optional */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="wl-name" className="font-sans text-[11px] font-semibold text-[#525252] flex justify-between">
            <span>Name</span>
            <span className="text-black/30 font-normal">Optional</span>
          </label>
          <div
            className={fieldClass(false)}
            style={{
              borderColor: accentColor + '22',
              '--tw-ring-color': accentRing,
            }}
          >
            <input
              id="wl-name"
              type="text"
              placeholder="Your name"
              className="w-full border-none bg-transparent outline-none font-sans text-sm text-[#0F0F0F] placeholder-black/30"
              style={{ fontSize: '16px' }}
              disabled={status === 'loading'}
              {...register('name')}
            />
          </div>
        </div>

        {/* Email — required */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="wl-email" className="font-sans text-[11px] font-semibold text-[#525252]">
            Email Address <span aria-hidden="true" style={{ color: accentColor }}>*</span>
          </label>
          <div
            className={fieldClass(!!errors.email)}
            style={{
              borderColor: errors.email ? undefined : accentColor + '22',
              '--tw-ring-color': accentRing,
            }}
          >
            <input
              id="wl-email"
              type="email"
              placeholder={emailPlaceholder}
              className="w-full border-none bg-transparent outline-none font-sans text-sm text-[#0F0F0F] placeholder-black/30"
              style={{ fontSize: '16px' }}
              disabled={status === 'loading'}
              aria-required="true"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'wl-email-error' : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span id="wl-email-error" className="text-xs mt-1 pl-1 flex items-center gap-1.5 font-medium" style={{ color: accentColor }} role="alert">
              <AlertCircle size={12} />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant={buttonVariant}
          size="md"
          className="min-h-[48px] shadow-sm mt-2 flex items-center justify-center gap-2 w-full"
          disabled={status === 'loading'}
          style={{ touchAction: 'manipulation' }}
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Joining…
            </>
          ) : (
            buttonLabel
          )}
        </Button>
      </form>

      {/* Error state */}
      {status === 'error' && errorMessage && (
        <div
          className="text-xs mt-4 text-center p-3 rounded-xl flex items-center justify-between gap-2"
          style={{ backgroundColor: accentBg, border: `1px solid ${accentColor}18`, color: accentColor }}
          role="alert"
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={14} />
            {errorMessage}
          </span>
          <button
            onClick={retry}
            style={{ touchAction: 'manipulation', color: accentColor }}
            className="flex items-center gap-1 font-semibold underline underline-offset-2 flex-shrink-0"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
