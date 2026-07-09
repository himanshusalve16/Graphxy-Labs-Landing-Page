import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBackground from '../components/layout/PageBackground';
import PageShell from '../components/layout/PageShell';
import Container from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Target, 
  Calendar, 
  Layout, 
  Server, 
  Code, 
  CheckSquare, 
  CloudLightning, 
  Activity, 
  TrendingUp, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const processSteps = [
  {
    num: "01",
    title: "Discovery",
    icon: Search,
    color: "#0066CC",
    desc: "Aligning project scope, business objectives, and technical feasibility parameters.",
    details: {
      purpose: "Establish clear boundaries, clarify business intent, and align on high-level timelines.",
      deliverables: ["Project Charter", "Feasibility Matrix", "High-level Scope Checklist"],
      collaboration: "Joint product discovery workshops, stakeholder sync sessions.",
      outputs: "Product direction consensus and preliminary project timeline.",
      tools: ["Miro", "FigJam", "Slack", "Google Workspace"]
    }
  },
  {
    num: "02",
    title: "Research",
    icon: BookOpen,
    color: "#0D9488",
    desc: "Investigating user workflows, database configurations, and competitor solutions.",
    details: {
      purpose: "Understand the target user behaviors, security requirements, and competitive landscapes.",
      deliverables: ["User Persona Analysis", "Competitor Audit", "Technology Options Brief"],
      collaboration: "User interviews, technical research spikes, team syncs.",
      outputs: "Technical baseline data, user journey maps, and risk register.",
      tools: ["Jira", "Confluence", "Notion", "DBDiagram"]
    }
  },
  {
    num: "03",
    title: "Strategy",
    icon: Target,
    color: "#92400E",
    desc: "Mapping core features and formulating high-fidelity PRD specifications.",
    details: {
      purpose: "Define the detailed product specifications, roadmap boundaries, and feature priority.",
      deliverables: ["Product Requirements Document (PRD)", "Product Roadmap", "Sprint Strategy"],
      collaboration: "Roadmap prioritizations, milestone validation sessions.",
      outputs: "Clear backlog definition and agreed Phase 1 priorities.",
      tools: ["Confluence", "Jira Product Discovery", "Notion"]
    }
  },
  {
    num: "04",
    title: "Planning",
    icon: Calendar,
    color: "#1B3A6B",
    desc: "Structuring sprints, developer allocation, milestones, and risk mitigation.",
    details: {
      purpose: "Prepare the execution sprint cycles, set baseline developer capacity, and assess risks.",
      deliverables: ["Sprint Plan", "Release Schedule", "Capacity Matrix"],
      collaboration: "Sprint planning meetings, task estimation workshops.",
      outputs: "Committed task backlog, sprint objectives, and milestone gantt chart.",
      tools: ["Jira Software", "Linear", "Gantt Charts"]
    }
  },
  {
    num: "05",
    title: "UI / UX Design",
    icon: Layout,
    color: "#0066CC",
    desc: "Creating wireframes, layout rules, component grids, and responsive flows.",
    details: {
      purpose: "Craft the visual layouts, component libraries, typography hierarchy, and user flows.",
      deliverables: ["Interactive Prototypes", "Figma Design System", "High-Fidelity Mockups"],
      collaboration: "Design reviews, interactive design feedback walkthroughs.",
      outputs: "Figma design files, developer handoff stylesheets, and typography guides.",
      tools: ["Figma", "Adobe Creative Suite", "Storybook"]
    }
  },
  {
    num: "06",
    title: "System Architecture",
    icon: Server,
    color: "#0D9488",
    desc: "Designing database models, API endpoints, security, and scalable systems.",
    details: {
      purpose: "Draft database layouts, secure endpoints, session caching, and deployment scripts.",
      deliverables: ["Entity Relationship Diagram (ERD)", "API Spec (OpenAPI/Swagger)", "Network Architecture Map"],
      collaboration: "Peer architecture review, security vulnerability audit.",
      outputs: "Drizzle database configurations, Docker setups, and cloud design docs.",
      tools: ["DBDiagram", "Lucidchart", "Swagger", "Docker"]
    }
  },
  {
    num: "07",
    title: "Development",
    icon: Code,
    color: "#92400E",
    desc: "Writing clean, componentized React code and decoupled backend logic.",
    details: {
      purpose: "Build the database tables, API routes, security engines, and interactive client screens.",
      deliverables: ["Functional Source Code", "Local Dev Validation Runs"],
      collaboration: "Daily standups, peer code reviews, continuous code integration.",
      outputs: "Vite client assets, modular Express backend controllers, database hooks.",
      tools: ["VS Code", "Git / GitHub", "npm", "PostgreSQL", "Redis"]
    }
  },
  {
    num: "08",
    title: "Testing & QA",
    icon: CheckSquare,
    color: "#1B3A6B",
    desc: "Executing unit tests, breakpoint audits, and security vulnerability runs.",
    details: {
      purpose: "Validate security compliance, responsiveness targets, and ensure bug-free execution.",
      deliverables: ["Security Vulnerability Audit", "UAT Reports", "Browser Compatibility Matrix"],
      collaboration: "Automated QA cycles, team bug-bash reviews.",
      outputs: "Validated testing test suites, linting reports, and lighthouse score verification.",
      tools: ["Jest", "Cypress", "Postman", "SonarQube"]
    }
  },
  {
    num: "09",
    title: "Deployment",
    icon: CloudLightning,
    color: "#0066CC",
    desc: "Packaging builds for immediate edge hosting and global CDN roots.",
    details: {
      purpose: "Build, package, and deploy the application environment onto production services.",
      deliverables: ["Live Production Service", "Keep-Alive Ping Configurations"],
      collaboration: "Release deployment coordination, CDN routing configuration.",
      outputs: "Production Vite bundles (Vercel), Express Docker server (Render), active DB schemas.",
      tools: ["Vercel", "Render", "Docker", "AWS", "GitHub Actions"]
    }
  },
  {
    num: "10",
    title: "Support & Maintenance",
    icon: Activity,
    color: "#0D9488",
    desc: "Tracking active server performance logs, error telemetry, and speed metrics.",
    details: {
      purpose: "Maintain maximum uptime, monitor server capacity, and handle exceptions.",
      deliverables: ["Uptime Logs", "Telemetry Alerts", "Error Diagnostics Report"],
      collaboration: "SLA management, incident response synchronization.",
      outputs: "Automated alert pipelines, performance metrics dashboards, log summaries.",
      tools: ["Sentry", "Datadog", "UptimeRobot", "Prometheus"]
    }
  },
  {
    num: "11",
    title: "Continuous Improvement",
    icon: TrendingUp,
    color: "#92400E",
    desc: "Upgrading capacities, UI/UX optimizations, and feature roadmap planning.",
    details: {
      purpose: "Refine user flows based on performance metrics and telemetry data.",
      deliverables: ["Feature Backlog Matrix", "UI Audit", "Performance Optimizations List"],
      collaboration: "Quarterly review, strategic roadmap planning workshops.",
      outputs: "Prioritized feature enhancements for next milestone iteration.",
      tools: ["Amplitude", "Google Analytics", "Hotjar", "Notion"]
    }
  }
];

export default function ProcessPage() {
  const [activeStep, setActiveStep] = useState(null);

  const toggleStep = (num) => {
    setActiveStep(prev => prev === num ? null : num);
  };

  return (
    <PageShell>
      {/* Shared Engineering Mesh Background */}
      <div className="relative overflow-hidden bg-[#FAFAF8] py-12 sm:py-16 md:py-24 border-b border-black/[0.04] flex-grow">
        <PageBackground />

        <Container className="relative z-10">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
            <span className="font-mono text-[9px] font-bold text-[#1B3A6B] uppercase tracking-[0.15em]">Partnership Lifecycle</span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-[#0F0F0F] mt-3 mb-4 tracking-tight leading-[1.15]">
              End-to-End Partnership Lifecycle
            </h1>
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-xl mx-auto">
              A comprehensive 11-stage journey guiding partners from early advisory and risk scoping to system architecture, production deployment, and post-launch venture building.
            </p>
          </div>

          {/* Staggered Vertical Interactive Pipeline */}
          <div className="relative max-w-4xl mx-auto mt-10 md:mt-20 pb-12 md:pb-20">
            
            {/* Center Timeline Path Line */}
            <div className="absolute left-5 sm:left-1/2 top-4 bottom-4 w-[2px] bg-[#1B3A6B]/15 -translate-x-[1px]" />
            
            {/* Steps Container */}
            <div className="flex flex-col gap-8 sm:gap-12 md:gap-16">
              {processSteps.map((step, idx) => {
                const Icon = step.icon;
                const isLeft = idx % 2 === 0;
                const isOpen = activeStep === step.num;

                return (
                  <div key={step.num} className={`relative flex flex-col sm:flex-row items-start ${isLeft ? 'sm:justify-start' : 'sm:justify-end'} w-full`}>
                    
                    {/* Centered Stage Dot */}
                    <div className="absolute left-5 sm:left-1/2 top-2.5 -translate-x-1/2 z-20">
                      <motion.button
                        onClick={() => toggleStep(step.num)}
                        style={{ touchAction: 'manipulation' }}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.92 }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border cursor-pointer shadow-xs transition-colors duration-200 ${
                          isOpen 
                            ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' 
                            : 'bg-white text-[#1B3A6B] border-black/5 hover:border-[#1B3A6B]/30'
                        }`}
                      >
                        <Icon size={11} className="sm:hidden" />
                        <Icon size={14} className="hidden sm:block" />
                      </motion.button>
                    </div>

                    {/* Step Card Component */}
                    <motion.div 
                      layout
                      className={`w-full sm:w-[45%] pl-10 sm:pl-0 ${isLeft ? 'sm:pr-8' : 'sm:pl-8'}`}
                    >
                      <Card 
                        variant="surface" 
                        onClick={() => toggleStep(step.num)}
                        className={`p-5 cursor-pointer bg-white/70 backdrop-blur-sm border-black/5 hover:border-black/10 transition-all shadow-xs duration-200 select-none ${
                          isOpen ? 'ring-1 ring-[#1B3A6B]/25 border-[#1B3A6B]/25 shadow-sm' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5 mb-2.5">
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] font-bold text-black/30 tracking-wider">STAGE {step.num}</span>
                              <ChevronDown 
                                size={14} 
                                className={`text-black/30 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                              />
                            </div>
                            <h3 className="font-serif text-sm font-semibold text-[#0F0F0F] mt-0.5">{step.title}</h3>
                          </div>
                        </div>

                        <p className="text-[11px] leading-relaxed text-[#525252] font-normal">
                          {step.desc}
                        </p>

                        {/* Interactive Detail Reveal */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden mt-4 pt-4 border-t border-black/[0.04]"
                            >
                              <div className="flex flex-col gap-3 text-[10px] text-[#525252]">
                                <div>
                                  <span className="font-mono text-[8px] font-semibold text-[#1B3A6B] uppercase tracking-wider block mb-1">Objectives & Purpose</span>
                                  <p className="font-normal leading-relaxed">{step.details.purpose}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                  <div>
                                    <span className="font-mono text-[8px] font-semibold text-black/45 uppercase tracking-wider block mb-1">Deliverables</span>
                                    <ul className="list-disc pl-3.5 m-0 flex flex-col gap-0.5 font-normal">
                                      {step.details.deliverables.map((item, dIdx) => (
                                        <li key={dIdx}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="font-mono text-[8px] font-semibold text-black/45 uppercase tracking-wider block mb-1">Outputs</span>
                                    <p className="font-normal leading-relaxed">{step.details.outputs}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-1">
                                  <div>
                                    <span className="font-mono text-[8px] font-semibold text-black/45 uppercase tracking-wider block mb-1">Method / Collaboration</span>
                                    <p className="font-normal leading-relaxed">{step.details.collaboration}</p>
                                  </div>
                                  <div>
                                    <span className="font-mono text-[8px] font-semibold text-black/45 uppercase tracking-wider block mb-1">Tools Utilized</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {step.details.tools.map((t, tIdx) => (
                                        <span key={tIdx} className="bg-[#FAFAF8] border border-black/5 px-1.5 py-0.5 rounded text-[8px] font-mono text-black/50">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Process Quote philosophy */}
          <div className="max-w-2xl mx-auto my-10 md:my-16 text-center px-4" data-reveal>
            <p className="font-serif text-lg md:text-xl text-[#525252] leading-relaxed italic border-l border-r border-[#1B3A6B]/30 px-6 sm:px-12 py-2">
              "We reject the chaos of ad-hoc development. Writing precise software requires absolute clarity in planning, execution checkpoints, and deep architectural restraint."
            </p>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-10 md:mt-16" data-reveal>
            <div className="bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-10 md:p-12 text-center shadow-xs">
              <h2 className="font-serif text-xl sm:text-2xl text-[#0F0F0F] font-light mb-3">
                Ready to build with precision?
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] max-w-lg mx-auto mb-6 leading-relaxed">
                Start a conversation with our engineering team. We'll analyze your project scope, evaluate dependencies, and design a precise roadmap.
              </p>
              <Link to="/contact">
                <Button variant="brand" size="md">Start Project Handoff</Button>
              </Link>
            </div>
          </div>

        </Container>
      </div>
    </PageShell>
  );
}
