import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Check, Mail, Phone, MapPin, Send, AlertCircle, Loader2 } from 'lucide-react';
import { submitToFormspree } from '../utils/formspree';

// Contact Zod validation schema
const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().min(1, { message: "Email address is required." }).email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  subject: z.string().min(1, { message: "Subject selection is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const subjects = [
    "General Inquiry",
    "Management Systems",
    "Web Development",
    "Mobile App Development",
    "AI & Machine Learning",
    "Data Science & Analytics",
    "Custom Software",
    "Automation & Workflows",
    "Scalable Tech Products",
    "Graphzy Partnership",
    "Serva Early Access"
  ];

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      subject: "General Inquiry",
      message: ''
    }
  });

  // Pre-fill subject from URL parameter if provided
  useEffect(() => {
    const subParam = searchParams.get('subject');
    if (subParam && subjects.includes(subParam)) {
      setValue('subject', subParam);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company?.trim() || 'Not Specified',
      subject: data.subject,
      message: data.message.trim()
    };

    const result = await submitToFormspree(import.meta.env.VITE_FORMSPREE_CONTACT_ID, payload);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Submission failed. Please verify your connection and try again.');
    }
  };

  return (
    <PageShell>
      <div className="bg-[#FAFAF8] py-10 sm:py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">

            {/* Contact details */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-wider">Contact Us</span>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#0F0F0F] mt-2 mb-4">
                  Let's discuss your next system.
                </h1>
                <p className="text-xs md:text-sm text-[#525252] leading-relaxed">
                  Have a question about Graphzy, interested in the Serva preview, or looking to build bespoke business software? Reach out to our engineering team.
                </p>
              </div>

              <div className="flex flex-col gap-5 border-t border-black/[0.04] pt-8">
                <div className="flex gap-4 items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF3FB] text-[#1B3A6B] flex items-center justify-center flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase">Email</div>
                    <a href="mailto:himanshusalve16@gmail.com" className="text-xs font-semibold text-[#0F0F0F] hover:underline">
                      himanshusalve16@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF3FB] text-[#1B3A6B] flex items-center justify-center flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase">Call</div>
                    <span className="text-xs font-semibold text-[#0F0F0F]">+91 8767460104</span>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF3FB] text-[#1B3A6B] flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] font-bold text-[#A3A3A3] uppercase">HQ</div>
                    <span className="text-xs font-semibold text-[#0F0F0F]">Nagpur, Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card variant="surface" className="lg:col-span-7 bg-white p-6 sm:p-8 border-black/5 shadow-sm">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#E8F5EE] text-[#1E8A4A] flex items-center justify-center mb-6">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <h2 className="font-serif text-2xl text-[#0F0F0F] mb-3">Message Received</h2>
                  <p className="text-xs text-[#525252] leading-relaxed max-w-sm">
                    Thank you for reaching out. A member of our product engineering team will review your inquiry and reply within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate style={{ touchAction: 'manipulation' }}>
                    {/* Row 1: Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="contact-name" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Your Name <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="Your Name"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.name ? "true" : "false"}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          {...register('name')}
                        />
                        {errors.name && (
                          <span id="contact-name-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.name.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="contact-email" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Email Address <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="emailaddress@email.com"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          {...register('email')}
                        />
                        {errors.email && (
                          <span id="contact-email-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Company and Area of Inquiry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="contact-company" className="font-sans text-[11px] font-semibold text-[#525252] flex justify-between">
                          <span>Company</span>
                          <span className="text-black/30 font-normal">Optional</span>
                        </label>
                        <Input
                          id="contact-company"
                          type="text"
                          placeholder="Your Company"
                          disabled={status === 'loading'}
                          {...register('company')}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="contact-subject" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Area of Inquiry <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="contact-subject"
                            disabled={status === 'loading'}
                            className="flex h-12 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-[#0F0F0F] outline-none transition-all duration-120 focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#EEF3FB] disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            aria-required="true"
                            {...register('subject')}
                          >
                            {subjects.map((s, idx) => (
                              <option key={idx} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        {errors.subject && <span className="text-[10px] text-[#EF4444] mt-1 pl-1" role="alert">{errors.subject.message}</span>}
                      </div>
                    </div>

                    {/* Row 3: Message Details */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <label htmlFor="contact-message" className="font-sans text-[11px] font-semibold text-[#525252]">
                        Message Details <span className="text-[#EF4444]" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        placeholder="Please describe your project, timeline, or product inquiry..."
                        rows={5}
                        disabled={status === 'loading'}
                        className="flex w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0F0F0F] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder-black/30 outline-none transition-all focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#EEF3FB] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-required="true"
                        aria-invalid={errors.message ? "true" : "false"}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        {...register('message')}
                      />
                      {errors.message && (
                        <span id="contact-message-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                          <AlertCircle size={10} />
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="brand"
                      className="w-full flex items-center justify-center gap-2 mt-2 min-h-[52px]"
                      disabled={status === 'loading'}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>

                  {/* General error message */}
                  {status === 'error' && errorMessage && (
                    <div className="text-xs text-[#EF4444] mt-4 text-center bg-[#FEF3F2] border border-[#EF4444]/10 p-3 rounded-xl flex items-center justify-center gap-2" role="alert">
                      <AlertCircle size={14} />
                      {errorMessage}
                    </div>
                  )}
                </>
              )}
            </Card>

          </div>
        </Container>
      </div>
    </PageShell>
  );
}
