import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Database, Shield, Code, Cpu, ExternalLink,
  Mail, Phone, MapPin, Github, Linkedin, Menu, X,
  Download, User, Award, Layout, Globe, Server, GraduationCap
} from 'lucide-react';

import resumeFile from './assets/alok_resume.pdf';
import profilePic from './assets/profile-pic.png';
import aboutPic from './assets/about-pic.jpg';

const NAV_ITEMS = ['Home', 'Experience', 'Education', 'Skills', 'Projects', 'Contact'];

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Initialize System... > Loading Profile: Alok Pathak... > Status: Online';

  /* ── Typing effect ── */
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index++;
      setTypedText(fullText.slice(0, index));
      if (index >= fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  /* ── IntersectionObserver: highlight active nav on scroll ── */
  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.toLowerCase());
    const observers = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  /* ── Data ── */
  const experience = [
    {
      role: 'Junior Presentation Designer Trainee',
      company: 'EZ Lab Private Limited',
      period: 'Jan 2026 – Mar 2026',
      icon: <Layout className="w-6 h-6 text-cyan-400" />,
      details: [
        'Created professional PowerPoint presentations with high visual hierarchy.',
        'Designed templates with consistent formatting and alignment standards.',
        'Improved slide clarity through precise layout adjustments.',
        'Worked with charts, graphs, and Excel-integrated data visualizations.',
      ],
    },
    {
      role: 'Web Full Stack Developer Intern',
      company: 'Edskills Academy',
      period: 'Oct 2024 – Dec 2024',
      icon: <Code className="w-6 h-6 text-blue-400" />,
      details: [
        'Developed responsive UI components and integrated backend functionality.',
        'Worked with Apache Tomcat for server deployment and debugging.',
        'Participated in code reviews to maintain project standards.',
      ],
    },
    {
      role: 'Cyber Security Intern (Virtual)',
      company: 'Palo Alto Networks',
      period: 'May 2023 – Jul 2023',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      details: [
        'Performed vulnerability assessments and penetration testing exercises.',
        'Gained exposure to network security and threat detection methodologies.',
      ],
    },
  ];

  const education = [
    {
      degree: 'B.Tech – Computer Science & Engineering',
      institution: 'Galgotias University',
      period: '2022 – 2026',
      location: 'Greater Noida, India',    
    },
  ];

  const skillGroups = [
    { title: 'Languages', skills: ['Python', 'Java', 'C++', 'HTML', 'CSS', 'JavaScript'] },
    { title: 'Core Tech', skills: ['React', 'Networking', 'Database Design', 'Apache Tomcat'] },
    { title: 'Tools', skills: ['Git', 'VS Code', 'Android Studio', 'MS Excel', 'MS PowerPoint'] },
    { title: 'Talents', skills: ['Front-End Dev', 'Graphic Design', 'Visual Hierarchy'] },
  ];

  const certifications = [
    { title: 'Packet Tracer', issuer: 'Cisco Networking Academy', date: '2024' },
    { title: 'Database Design', issuer: 'Oracle Academy', date: '2023' },
    { title: 'Cybersecurity Fundamentals', issuer: 'IBM', date: '2024' },
  ];

  const projects = [
    {
      title: 'Speech-to-Text Model',
      desc: 'Developed using Python and VSOC technology achieving ~95% accuracy on benchmark datasets.',
      tags: ['PYTHON', 'VSOC', 'ML'],
      icon: <Cpu className="text-purple-400 mb-4 w-7 h-7" />,
      link: null,
      github: 'https://github.com/aalokpathak',
    },
    {
      title: 'YASA TRADERS',
      desc: 'Full-stack e-commerce platform featuring authentication, product catalog, and order management.',
      tags: ['MERN', 'AUTH', 'E-COMMERCE'],
      icon: <Globe className="text-blue-400 mb-4 w-7 h-7" />,
      link: 'https://yasatraders.vercel.app/',
      github: null,
    },
  ];

  /* ── Component ── */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">

      {/* Background mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900 blur-[150px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span>ALOK.PATHAK</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`transition-all hover:text-cyan-400 ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href={resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 transition-all text-white"
            >
              <Download className="w-4 h-4" /> Resume
            </a>
          </div>

          {/* Hamburger */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col px-6 pb-4 gap-1 border-t border-white/5 bg-slate-950/95">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-left py-2 text-sm font-medium transition-all hover:text-cyan-400 ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href={resumeFile}
              download
              className="mt-2 flex items-center gap-2 text-sm text-white border border-white/10 rounded-full px-4 py-2 w-fit"
            >
              <Download className="w-4 h-4" /> Resume
            </a>
          </div>
        )}
      </nav>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section id="home" className="min-h-screen flex items-center px-6 pt-20">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-mono">
                Computer Science Engineer
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-tight">
                Alok{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Pathak
                </span>
              </h1>
              <div className="font-mono text-lg md:text-xl text-emerald-400 min-h-[1.5em]">
                {typedText}<span className="animate-pulse">█</span>
              </div>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                A <span className="text-white font-medium">Web &amp; Front-End Developer</span> with a
                foundation in <span className="text-white font-medium">Cybersecurity</span>, complemented
                by professional <span className="text-white font-medium">Graphic Design</span> skills.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold transition-all"
                >
                  View Work
                </button>
                <a
                  href={resumeFile}
                  download
                  className="border border-slate-700 hover:bg-slate-900 px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 text-white"
                >
                  <Download className="w-5 h-5" /> Resume
                </a>
              </div>
            </div>

            <div className="flex justify-center order-1 md:order-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900">
                  <img
                    src={profilePic}
                    alt="Alok Pathak"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience & About ── */}
        <section id="experience" className="py-24 px-6 bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3 space-y-12">
                <h2 className="text-4xl font-bold text-white flex items-center gap-4">
                  <Server className="text-cyan-500 w-10 h-10" /> Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((job, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-slate-900/40 border border-white/5">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div className="flex gap-4">
                          <div className="p-3 rounded-xl bg-slate-800">{job.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{job.role}</h3>
                            <p className="text-cyan-400">{job.company}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-500 shrink-0">{job.period}</span>
                      </div>
                      <ul className="space-y-2">
                        {job.details.map((d, j) => (
                          <li key={j} className="text-slate-400 text-sm flex gap-2">
                            <span className="text-cyan-500 shrink-0">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
                  <img src={aboutPic} alt="About Alok" className="w-full h-auto object-cover" />
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <User className="w-5 h-5" /> About My Path
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Computer Science Engineer with focused expertise in building high-performance web
                    interfaces and securing digital infrastructures. I merge engineering discipline with
                    professional graphic design to deliver robust, visually compelling solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Education ── */}
        <section id="education" className="py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <h2 className="text-4xl font-bold text-white flex items-center gap-4">
              <GraduationCap className="text-cyan-500 w-10 h-10" /> Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-wrap gap-6 items-start justify-between">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-slate-800">
                      <GraduationCap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                      <p className="text-cyan-400 mt-0.5">{edu.institution}</p>
                      <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {edu.location}
                      </p>
                      <p className="text-slate-500 text-xs mt-1 font-mono">{edu.detail}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 shrink-0">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Skills & Certs ── */}
        <section id="skills" className="py-24 px-6 bg-slate-900/20">
          <div className="max-w-7xl mx-auto space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Technical Arsenal</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {skillGroups.map((group, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-cyan-400 font-bold uppercase text-xs mb-4 tracking-widest">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((s) => (
                      <span key={s} className="px-2 py-1 rounded bg-slate-900 text-slate-300 text-xs border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="grid md:grid-cols-3 gap-4">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                  <Award className="w-6 h-6 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="text-white font-bold text-sm">{c.title}</h4>
                    <p className="text-slate-500 text-[11px]">{c.issuer}</p>
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="py-24 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <h2 className="text-4xl font-bold text-white text-center">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-slate-950 border border-white/5 flex flex-col justify-between gap-6 group hover:border-white/10 transition-all"
                >
                  <div>
                    {p.icon}
                    <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <span key={t} className="px-2 py-1 rounded bg-white/5 text-[10px] font-bold text-slate-500">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-white transition-all"
                          title="View source"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-white transition-all"
                          title="Live demo"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact / Footer ── */}
        <footer id="contact" className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
          <div className="max-w-7xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Initialize Connection</h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Actively seeking roles in Front-End Development, Web Engineering, and Cybersecurity.
                Open to full-time opportunities and freelance projects.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              <a
                href="mailto:pathakalok256@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-sm"
              >
                <Mail className="w-5 h-5 text-cyan-500" /> pathakalok256@gmail.com
              </a>
              <a
                href="tel:+916202551582"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-sm"
              >
                <Phone className="w-5 h-5 text-emerald-500" /> +91 6202551582
              </a>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-red-500" /> Greater Noida, India
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/aalokpathak"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                href="https://www.linkedin.com/in/alok-pathak-113491157/"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>

            <p className="text-slate-700 text-xs font-mono pt-4">
              © {new Date().getFullYear()} Alok Pathak — Built with React + Vite
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Portfolio;