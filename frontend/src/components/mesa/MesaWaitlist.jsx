import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { FORMSPREE_CONFIG, submitToFormspree } from '../../utils/formspree';

// Zod validation schema
const waitlistSchema = z.object({
  name: z.string().optional(),
  email: z.string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Please enter a valid email address." })
});

export default function MesaWaitlist() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');
    
    const payload = {
      name: data.name?.trim() || 'Anonymous',
      email: data.email.trim(),
      subject: 'New Mesa Waitlist Signup',
      message: `${data.name || 'A user'} has joined the Mesa developer waitlist.`
    };

    const result = await submitToFormspree(FORMSPREE_CONFIG.MESA_WAITLIST_FORM_ID, payload);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Submission failed. Please verify your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <Card 
        variant="surface" 
        className="w-full max-w-md p-10 bg-white border-[#B45309]/14 shadow-[0_4px_12px_rgba(146,64,14,0.08)] flex flex-col items-center text-center animate-fade-in mx-auto"
        role="alert"
        aria-live="polite"
      >
        <div className="w-14 h-14 rounded-full bg-[#E8F5EE] text-[#1E8A4A] flex items-center justify-center mb-6">
          <Check size={24} strokeWidth={3} />
        </div>
        <h2 className="font-serif text-2xl text-[#0F0F0F] mb-3">You're on the list</h2>
        <p className="text-sm text-[#525252] leading-relaxed">
          Thank you for signing up. We've recorded your email address and will reach out with early preview invitations soon.
        </p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full" noValidate>
        {/* Name input (Optional) */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="waitlist-name" className="font-sans text-[11px] font-semibold text-[#525252] flex justify-between">
            <span>Name</span>
            <span className="text-black/30 font-normal">Optional</span>
          </label>
          <div className={`bg-white border border-[#B45309]/14 rounded-xl px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all flex items-center focus-within:border-[#92400E] focus-within:ring-2 focus-within:ring-[#FEF7EC] ${
            errors.name ? 'border-[#92400E] ring-2 ring-[#FEF3E2]' : ''
          }`}>
            <input 
              id="waitlist-name"
              type="text" 
              placeholder="Your name" 
              className="w-full border-none bg-transparent outline-none font-sans text-sm text-[#0F0F0F] placeholder-black/30"
              disabled={status === 'loading'}
              {...register('name')}
            />
          </div>
        </div>

        {/* Email input (Required) */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="waitlist-email" className="font-sans text-[11px] font-semibold text-[#525252]">
            Email Address <span className="text-[#92400E]" aria-hidden="true">*</span>
          </label>
          <div className={`bg-white border border-[#B45309]/14 rounded-xl px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all flex items-center focus-within:border-[#92400E] focus-within:ring-2 focus-within:ring-[#FEF7EC] ${
            errors.email ? 'border-[#92400E] ring-2 ring-[#FEF3E2]' : ''
          }`}>
            <input 
              id="waitlist-email"
              type="email" 
              placeholder="Enter your restaurant email address..." 
              className="w-full border-none bg-transparent outline-none font-sans text-sm text-[#0F0F0F] placeholder-black/30"
              disabled={status === 'loading'}
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "waitlist-email-error" : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span id="waitlist-email-error" className="text-xs text-[#92400E] mt-1 pl-1 flex items-center gap-1.5 font-medium" role="alert">
              <AlertCircle size={12} />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          variant="serva" 
          size="md" 
          className="h-[46px] shadow-[0_2px_8px_rgba(146,64,14,0.15)] mt-2 flex items-center justify-center gap-2"
          disabled={status === 'loading'}
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'loading' ? 'Joining...' : 'Join Mesa Waitlist'}
        </Button>
      </form>
      
      {/* General error message */}
      {status === 'error' && errorMessage && (
        <div className="text-xs text-[#92400E] mt-4 text-center bg-[#FEF3E2] border border-[#92400E]/10 p-3 rounded-xl flex items-center justify-center gap-2" role="alert">
          <AlertCircle size={14} />
          {errorMessage}
        </div>
      )}
    </div>
  );
}
