import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Database, 
  Shield, 
  Code, 
  Cpu, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ChevronDown, 
  Award,
  Server,
  Globe,
  Menu,
  X
} from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "Initialize System..._> Loading Profile: Alok Pathak..._> Status: Ready";

  // Typing effect for Hero
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText((prev) => {
        if (index < fullText.length) {
          index++;
          return fullText.slice(0, index);
        }
        clearInterval(timer);
        return prev;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  // Data from Resume
  const experience = [
    {
      role: "Data Engineering Intern",
      company: "AWS",
      period: "Jan 2024 - Mar 2024",
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      details: [
        "Worked with AWS Glue, Redshift, and S3 for data processing.",
        "Designed and implemented ETL pipelines for large datasets.",
        "Applied data warehousing concepts and best practices."
      ]
    },
    {
      role: "Cyber Security Intern",
      company: "Palo Alto Networks",
      period: "May 2022 - Jul 2022",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      details: [
        "Participated in vulnerability assessment and penetration testing.",
        "Learned network security fundamentals and threat detection.",
        "Gained experience with security tools and techniques."
      ]
    }
  ];

  const projects = [
    {
      title: "GPU Based Speech-to-Text",
      tech: ["Python", "CUDA", "VSOC Technology"],
      desc: "High-performance speech recognition system achieving 95% transcription accuracy. Implemented Vocal Sound Optical Converter technology for improved accuracy and optimized GPU processing.",
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
      link: "https://github.com/aalokpathak/Speech-to-Text-Model"
    },
    {
      title: "E-Commerce Platform",
      tech: ["MERN Stack", "Database", "Responsive Design"],
      desc: "Full-stack e-commerce platform with user authentication, shopping cart functionality, payment processing, and order management. Fully responsive design for all devices.",
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      link: "https://yasatraders.vercel.app/"
    }
  ];

  const skills = {
    languages: ["Python", "Java", "C++", "HTML/CSS", "JavaScript"],
    tech: ["MERN Stack", "Networking", "Database Design", "Cloud Computing", "AWS"],
    tools: ["Android Studio", "VS Code", "Jupyter", "Git", "AWS Console"]
  };

  const certs = [
    { name: "Cisco Networking Academy - Packet Tracer", date: "Apr 2024" },
    { name: "Oracle Academy - Database Design", date: "Jan 2024" },
    { name: "IBM - Cybersecurity Fundamentals", date: "Dec 2023" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-emerald-900 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2 text-cyan-400">
            <Terminal className="w-5 h-5" />
            <span>ALOK.PATHAK</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`hover:text-cyan-400 transition-colors ${activeSection === item.toLowerCase() ? 'text-cyan-400' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4 text-center">
            {['Home', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="py-2 text-slate-300 hover:text-cyan-400"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-6">
          <div className="max-w-4xl w-full text-center space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono mb-4">
              Status: Available for Opportunities
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-100 mb-4">
              Alok Pathak
            </h1>
            
            <div className="h-8 md:h-12 text-lg md:text-2xl font-mono text-emerald-400">
              {typedText}<span className="animate-pulse">_</span>
            </div>

            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
              B.Tech Computer Science Student specialized in <span className="text-slate-200">Web Development</span> & <span className="text-slate-200">Cybersecurity</span>. 
              Building projects and securing digital infrastructures.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button onClick={() => scrollToSection('projects')} className="px-8 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-lg shadow-cyan-900/20 flex items-center gap-2">
                View Projects <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 font-medium transition-all">
                Contact Me
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6 pt-8 text-slate-500">
              <a href="https://github.com/aalokpathak" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="mailto:pathakalok256@gmail.com" className="hover:text-white transition-colors"><Mail className="w-6 h-6" /></a>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-100">
              <Server className="text-cyan-500" /> Work Experience
            </h2>
            
            <div className="space-y-12">
              {experience.map((job, idx) => (
                <div key={idx} className="relative pl-8 md:pl-0">
                  {/* Timeline Line */}
                  <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2" />
                  
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-slate-950 border-4 border-cyan-500 md:-translate-x-1/2 mt-1.5 md:mt-0 z-10" />
                    
                    {/* Content Card */}
                    <div className="w-full md:w-1/2">
                      <div className={`p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-300 group`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-slate-800/80 transition-colors">
                            {job.icon}
                          </div>
                          <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded-md">
                            {job.period}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-100">{job.role}</h3>
                        <h4 className="text-cyan-400 font-medium mb-4">{job.company}</h4>
                        <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside marker:text-cyan-900">
                          {job.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2" /> {/* Spacer */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-6 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-100">
              <Code className="text-purple-500" /> Featured Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <div key={idx} className="group relative p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {project.icon}
                  </div>
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-purple-300 border border-purple-500/10">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {project.desc}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      {project.link.includes('github') ? 'View Source' : 'Live Demo'} 
                      {project.link.includes('github') ? <Github className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills & Certs */}
        <section id="skills" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              
              {/* Skills */}
              <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-100">
                  <Cpu className="text-emerald-500" /> Technical Arsenal
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Languages</h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.languages.map(skill => (
                        <span key={skill} className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Technologies</h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.tech.map(skill => (
                        <span key={skill} className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Tools</h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.tools.map(skill => (
                        <span key={skill} className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications & Education */}
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-100">
                    <Award className="text-yellow-500" /> Certifications
                  </h2>
                  <div className="space-y-4">
                    {certs.map((cert, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div>
                          <div className="font-medium text-slate-200">{cert.name}</div>
                          <div className="text-sm text-slate-500">{cert.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-slate-100">
                    <ExternalLink className="text-blue-500" /> Education
                  </h2>
                  <div className="space-y-6 pl-2 border-l border-slate-800">
                    <div className="pl-6 relative">
                      <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-950" />
                      <h3 className="font-bold text-lg text-slate-100">Galgotias University</h3>
                      <p className="text-blue-400">B.Tech, Computer Science & Engineering</p>
                      <p className="text-sm text-slate-500">2022 - 2026</p>
                    </div>
                    <div className="pl-6 relative">
                      <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-700 ring-4 ring-slate-950" />
                      <h3 className="font-bold text-lg text-slate-100">St. Xavier's High School</h3>
                      <p className="text-slate-400">Senior Secondary (XII), Science</p>
                      <p className="text-sm text-slate-500">2021 | 76%</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contact Footer */}
        <section id="contact" className="py-20 px-6 bg-slate-950 border-t border-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-slate-100">Initialize Connection</h2>
            <p className="text-slate-400 mb-12">
              Currently seeking opportunities in Data Engineering and Cybersecurity. 
              Whether you have a question or just want to say hi, my inbox is always open.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <a href="mailto:pathakalok256@gmail.com" className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 transition-all group">
                <Mail className="w-8 h-8 mx-auto mb-4 text-slate-400 group-hover:text-cyan-400" />
                <div className="text-sm text-slate-500">Email Me</div>
                <div className="text-slate-200 font-medium text-sm break-all">pathakalok256@gmail.com</div>
              </a>
              
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 transition-all group">
                <Phone className="w-8 h-8 mx-auto mb-4 text-slate-400 group-hover:text-cyan-400" />
                <div className="text-sm text-slate-500">Call Me</div>
                <div className="text-slate-200 font-medium">+91 6202551582</div>
              </div>

              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 transition-all group">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-slate-400 group-hover:text-cyan-400" />
                <div className="text-sm text-slate-500">Location</div>
                <div className="text-slate-200 font-medium">New Delhi, India</div>
              </div>
            </div>

            <footer className="text-slate-600 text-sm">
              <p>© {new Date().getFullYear()} Alok Pathak. Built with React & Tailwind.</p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;