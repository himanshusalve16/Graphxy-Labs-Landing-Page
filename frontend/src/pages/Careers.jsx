import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import PageBackground from '../components/layout/PageBackground';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  Users, 
  Laptop, 
  Key, 
  BookOpen, 
  TrendingUp,
  FileText,
  Search,
  MessageSquare,
  Award,
  CheckCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';

const maxFileSize = 5 * 1024 * 1024; // 5MB limit
const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Validation Schema
const careersSchema = z.object({
  fullName: z.string().min(1, { message: "Full Name is required." }),
  email: z.string().min(1, { message: "Email Address is required." }).email({ message: "Please enter a valid email address." }),
  phone: z.string().min(1, { message: "Phone Number is required." }),
  college: z.string().min(1, { message: "College / University is required." }),
  degree: z.string().min(1, { message: "Degree is required." }),
  branch: z.string().min(1, { message: "Branch / Specialization is required." }),
  gradYear: z.string().min(1, { message: "Graduation Year is required." }),
  currentCity: z.string().min(1, { message: "Current City is required." }),
  whyJoin: z.string().min(10, { message: "Please enter at least 10 characters." }),
  resume: z.any()
    .refine(files => files && files.length > 0, { message: "Resume file is required." })
    .refine(files => files && files[0]?.size <= maxFileSize, { message: "File size must not exceed 5MB." })
    .refine(files => files && (
      allowedFileTypes.includes(files[0]?.type) || 
      files[0]?.name.endsWith('.pdf') || 
      files[0]?.name.endsWith('.doc') || 
      files[0]?.name.endsWith('.docx')
    ), { message: "Only PDF, DOC, or DOCX formats are supported." })
});

export default function Careers() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Update page title and description dynamically on mount
  useEffect(() => {
    document.title = "Careers | Graphxy Labs";
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', 'Explore career opportunities at Graphxy Labs and join us in building modern software, AI-powered solutions, automation platforms, and digital experiences.');
    }
  }, []);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(careersSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      college: '',
      degree: '',
      branch: '',
      gradYear: '',
      currentCity: '',
      whyJoin: ''
    }
  });

  const resumeFile = watch('resume');
  const hasFile = resumeFile && resumeFile.length > 0;

  const onSubmit = async (data) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName.trim());
      formData.append('email', data.email.trim());
      formData.append('phone', data.phone.trim());
      formData.append('college', data.college.trim());
      formData.append('degree', data.degree.trim());
      formData.append('branch', data.branch.trim());
      formData.append('gradYear', data.gradYear.trim());
      formData.append('currentCity', data.currentCity.trim());
      formData.append('whyJoin', data.whyJoin.trim());
      
      if (data.resume && data.resume[0]) {
        formData.append('resume', data.resume[0]);
      }

      const response = await fetch('https://usebasin.com/f/231ed7c821bd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong while submitting your application. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong while submitting your application. Please try again.');
    }
  };

  const benefits = [
    {
      title: "Real Startup Experience",
      desc: "Work on live products, shipping features directly to production and seeing the immediate impact of your work.",
      icon: Sparkles
    },
    {
      title: "Direct Founder Collaboration",
      desc: "Collaborate side-by-side with the founder. No layers of bureaucracy, just direct mentoring and pure execution.",
      icon: Users
    },
    {
      title: "Flexible Remote Environment",
      desc: "We trust our team to manage their own schedules. Work from anywhere, as long as you deliver high-quality output.",
      icon: Laptop
    },
    {
      title: "Meaningful Ownership",
      desc: "Take full ownership of projects, features, and modules. We encourage initiative and independent problem-solving.",
      icon: Key
    },
    {
      title: "Continuous Learning",
      desc: "Gain exposure to diverse tech stacks, including AI integration, React ecosystems, automation, and cloud setups.",
      icon: BookOpen
    },
    {
      title: "Long-term Growth Opportunities",
      desc: "Join a fast-growing studio early. Exceptional contributors have a direct path to core leadership roles.",
      icon: TrendingUp
    }
  ];

  const processSteps = [
    { num: "01", name: "Application", icon: FileText, desc: "Submit your profile details." },
    { num: "02", name: "Resume Review", icon: Search, desc: "We evaluate your background." },
    { num: "03", name: "Short Interaction", icon: MessageSquare, desc: "A brief alignment talk." },
    { num: "04", name: "Final Discussion", icon: Award, desc: "Deep dive into your interests." },
    { num: "05", name: "Selection", icon: CheckCircle, desc: "Handoff offer & onboarding." }
  ];

  return (
    <PageShell>
      {/* Background Mesh */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04] flex-grow">
        <PageBackground />
        
        <Container className="relative z-10">
          
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-[0.15em] block mb-3">Join The Studio</span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0F0F0F] tracking-tight leading-[1.15] mb-4">
              Careers at Graphxy Labs
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-xl mx-auto mb-3 font-normal">
              Join us in building modern software, AI-powered solutions, automation platforms, and digital experiences.
            </p>
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-lg mx-auto font-normal">
              We're looking for curious builders, fast learners, and people who enjoy solving real-world problems.
            </p>
          </div>

          {/* Why Join Graphxy Labs */}
          <div className="my-16 md:my-24">
            <SectionHeading
              eyebrow="Culture & Growth"
              heading="Why Join Graphxy Labs?"
              description="We operate as a high-fidelity specialized engineering studio where technical depth and absolute visual restraint shape every project."
              className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <Card 
                    key={idx} 
                    variant="surface" 
                    className="p-6 bg-white border-black/5 hover:border-[#1B3A6B]/20 duration-200 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-[#EEF3FB] flex items-center justify-center mb-4 text-[#1B3A6B]">
                        <Icon size={16} />
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#0F0F0F] mb-2">{benefit.title}</h4>
                      <p className="text-[11px] leading-relaxed text-[#525252] font-normal">
                        {benefit.desc}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Current Openings */}
          <div className="my-16 md:my-24">
            <SectionHeading
              eyebrow="Opportunities"
              heading="Current Openings"
              description="Explore active roles in our engineering and business operations teams."
              className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
            />

            <div className="max-w-3xl mx-auto">
              <Card variant="surface" className="p-6 sm:p-8 bg-white border-black/5 shadow-xs">
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/[0.04] pb-6 mb-6">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0F0F0F] mb-2">
                      Business Development Intern
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[11px] text-[#525252] font-medium">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1B3A6B]" /> Remote
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#1E8A4A]" /> Currently Hiring
                      </span>
                    </div>
                  </div>
                  <a href="#apply" className="no-underline">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#1B3A6B] text-white border border-[#1B3A6B] hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                    >
                      Apply Now
                    </button>
                  </a>
                </div>

                {/* Job Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {/* Responsibilities */}
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-wider mb-3">
                      Responsibilities
                    </h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-xs text-[#525252] font-normal">
                      {["Business Development", "Lead Research", "Client Outreach", "Partnership Development", "Market Research", "Startup Growth"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1B3A6B]/30" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-mono text-[9px] font-bold text-black/40 uppercase tracking-wider mb-3">
                      Requirements
                    </h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-xs text-[#525252] font-normal">
                      {["Strong communication skills", "Curious learner", "Self-driven", "Professional attitude", "Interested in startups & technology"].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]/30" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Apply Now Section */}
          <div id="apply" className="mt-16 md:mt-24 max-w-3xl mx-auto">
            <SectionHeading
              eyebrow="Application"
              heading="Apply Now"
              description="Interested in joining Graphxy Labs? Submit your application below and we'll review your profile carefully."
              className="text-center max-w-2xl mx-auto mb-8"
            />

            <Card variant="glass" className="p-6 sm:p-8 bg-white/70 border-white/80 shadow-md relative overflow-hidden text-left">
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#E8F5EE] text-[#1E8A4A] flex items-center justify-center mb-6">
                    <Check size={24} strokeWidth={3} />
                  </div>
                  <h2 className="font-serif text-2xl text-[#0F0F0F] mb-3">Application Submitted</h2>
                  <p className="text-xs sm:text-sm text-[#525252] leading-relaxed max-w-md">
                    Thank you for applying to Graphxy Labs. We've received your application successfully. Our team will review your profile and contact you if your qualifications match our current requirements.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setStatus('idle');
                    }}
                    className="mt-6 px-5 py-2.5 rounded-full text-xs font-mono font-bold bg-[#1B3A6B] text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate style={{ touchAction: 'manipulation' }}>
                    {/* Row 1: Full Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-name" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Full Name <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-name"
                          type="text"
                          placeholder="e.g. Aarav Sharma"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.fullName ? "true" : "false"}
                          aria-describedby={errors.fullName ? "careers-name-error" : undefined}
                          {...register('fullName')}
                        />
                        {errors.fullName && (
                          <span id="careers-name-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.fullName.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-email" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Email Address <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-email"
                          type="email"
                          placeholder="e.g. aarav.sharma@example.com"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={errors.email ? "careers-email-error" : undefined}
                          {...register('email')}
                        />
                        {errors.email && (
                          <span id="careers-email-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone and Current City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-phone" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Phone Number <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-phone"
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.phone ? "true" : "false"}
                          aria-describedby={errors.phone ? "careers-phone-error" : undefined}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <span id="careers-phone-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.phone.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-city" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Current City <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-city"
                          type="text"
                          placeholder="e.g. Bangalore, Karnataka"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.currentCity ? "true" : "false"}
                          aria-describedby={errors.currentCity ? "careers-city-error" : undefined}
                          {...register('currentCity')}
                        />
                        {errors.currentCity && (
                          <span id="careers-city-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.currentCity.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 3: College, Graduation Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label htmlFor="careers-college" className="font-sans text-[11px] font-semibold text-[#525252]">
                          College / University <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-college"
                          type="text"
                          placeholder="e.g. IIT Bombay"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.college ? "true" : "false"}
                          aria-describedby={errors.college ? "careers-college-error" : undefined}
                          {...register('college')}
                        />
                        {errors.college && (
                          <span id="careers-college-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.college.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-1">
                        <label htmlFor="careers-gradyear" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Graduation Year <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-gradyear"
                          type="text"
                          placeholder="e.g. 2026"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.gradYear ? "true" : "false"}
                          aria-describedby={errors.gradYear ? "careers-gradyear-error" : undefined}
                          {...register('gradYear')}
                        />
                        {errors.gradYear && (
                          <span id="careers-gradyear-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.gradYear.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Degree and Branch / Specialization */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-degree" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Degree <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-degree"
                          type="text"
                          placeholder="e.g. B.Tech"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.degree ? "true" : "false"}
                          aria-describedby={errors.degree ? "careers-degree-error" : undefined}
                          {...register('degree')}
                        />
                        {errors.degree && (
                          <span id="careers-degree-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.degree.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="careers-branch" className="font-sans text-[11px] font-semibold text-[#525252]">
                          Branch / Specialization <span className="text-[#EF4444]" aria-hidden="true">*</span>
                        </label>
                        <Input
                          id="careers-branch"
                          type="text"
                          placeholder="e.g. Computer Science"
                          disabled={status === 'loading'}
                          aria-required="true"
                          aria-invalid={errors.branch ? "true" : "false"}
                          aria-describedby={errors.branch ? "careers-branch-error" : undefined}
                          {...register('branch')}
                        />
                        {errors.branch && (
                          <span id="careers-branch-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                            <AlertCircle size={10} />
                            {errors.branch.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resume Upload component */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="resume-upload" className="font-sans text-[11px] font-semibold text-[#525252]">
                        Resume Upload <span className="text-[#EF4444]" aria-hidden="true">*</span>
                      </label>
                      
                      {hasFile ? (
                        <div className="flex items-center justify-between border border-black/10 bg-[#EEF3FB]/30 rounded-xl p-4 text-xs">
                          <div className="flex items-center gap-2.5 truncate text-[#0F0F0F] font-medium">
                            <FileText size={16} className="text-[#1B3A6B] flex-shrink-0" />
                            <span className="truncate">{resumeFile[0].name}</span>
                            <span className="text-[9px] text-black/35 font-mono">({(resumeFile[0].size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setValue('resume', null)} 
                            className="text-[#EF4444] hover:underline text-[9px] font-mono uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label 
                          htmlFor="resume-upload" 
                          className="border border-dashed border-black/15 rounded-xl bg-white hover:border-[#1B3A6B]/50 hover:bg-[#EEF3FB]/5 transition-all p-5 flex flex-col items-center justify-center cursor-pointer text-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#EEF3FB] text-[#1B3A6B] flex items-center justify-center mb-2">
                            <FileText size={14} />
                          </div>
                          <span className="text-xs font-semibold text-[#0F0F0F]">Upload Resume</span>
                          <span className="text-[10px] text-black/35 mt-1 font-mono uppercase tracking-wider">PDF, DOC, DOCX (Max 5MB)</span>
                        </label>
                      )}
                      
                      <input 
                        id="resume-upload"
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                        disabled={status === 'loading'}
                        aria-required="true"
                        aria-invalid={errors.resume ? "true" : "false"}
                        aria-describedby={errors.resume ? "careers-resume-error" : undefined}
                        {...register('resume')} 
                      />
                      
                      {errors.resume && (
                        <span id="careers-resume-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                          <AlertCircle size={10} />
                          {errors.resume.message}
                        </span>
                      )}
                    </div>

                    {/* Why join details */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="careers-whyjoin" className="font-sans text-[11px] font-semibold text-[#525252]">
                        Why do you want to join Graphxy Labs? <span className="text-[#EF4444]" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="careers-whyjoin"
                        placeholder="Please share what excites you about Graphxy Labs and what you hope to contribute..."
                        rows={5}
                        disabled={status === 'loading'}
                        className="flex w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0F0F0F] shadow-[0_1px_2px_rgba(0,0,0,0.05)] placeholder-black/30 outline-none transition-all focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#EEF3FB] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-required="true"
                        aria-invalid={errors.whyJoin ? "true" : "false"}
                        aria-describedby={errors.whyJoin ? "careers-whyjoin-error" : undefined}
                        {...register('whyJoin')}
                      />
                      {errors.whyJoin && (
                        <span id="careers-whyjoin-error" className="text-[10px] text-[#EF4444] mt-1 pl-1 flex items-center gap-1 font-medium" role="alert">
                          <AlertCircle size={10} />
                          {errors.whyJoin.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="brand"
                      className="w-full flex items-center justify-center gap-2 mt-2 min-h-[52px] cursor-pointer"
                      disabled={status === 'loading'}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <FileText size={15} />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Error Notification */}
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

          {/* Hiring Process */}
          <div className="my-16 md:my-24">
            <SectionHeading
              eyebrow="Pipeline"
              heading="Hiring Process"
              description="A minimal, fast interaction loop designed to evaluate alignment and technical curiosity."
              className="text-center max-w-2xl mx-auto mb-10 md:mb-14"
            />

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 md:gap-4 relative px-4">
                {processSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center text-center flex-1 relative max-w-[150px] mx-auto md:mx-0">
                        <div className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center mb-3 text-[#1B3A6B] shadow-xs relative">
                          <StepIcon size={16} />
                          <span className="absolute -top-1.5 -right-1.5 bg-[#EEF3FB] border border-[#1B3A6B]/15 text-[#1B3A6B] font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {step.num}
                          </span>
                        </div>
                        <h4 className="font-serif text-[13px] font-semibold text-[#0F0F0F] mb-1">{step.name}</h4>
                        <p className="text-[10px] text-[#525252] leading-normal">{step.desc}</p>
                      </div>
                      
                      {idx < processSteps.length - 1 && (
                        <div className="hidden md:flex items-center justify-center text-black/15">
                          <ChevronRight size={16} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
