import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitToFormspree } from './formspree';

// Shared Zod schema for all waitlist forms
const waitlistSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
});

/**
 * useWaitlistForm — shared hook for Forkline and Lattice waitlist forms.
 *
 * @param {Object} options
 * @param {string}   options.formId        — Formspree form ID (from env var)
 * @param {string}   options.product       — Product name (e.g. 'Graphzy')
 * @param {string}   options.subject       — Email subject line
 * @param {Function} options.buildMessage  — (name: string) => string for Formspree message body
 */
export function useWaitlistForm({ formId, product, subject, buildMessage }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');

    const name = data.name?.trim() || 'Anonymous';
    const payload = {
      name,
      email: data.email.trim(),
      product,
      subject,
      message: buildMessage(name),
    };

    const result = await submitToFormspree(formId, payload);

    if (result.success) {
      setStatus('success');
      reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Submission failed. Please try again.');
    }
  };

  const retry = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return {
    register,
    handleSubmit,
    errors,
    status,
    errorMessage,
    onSubmit,
    retry,
  };
}
