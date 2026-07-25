import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Database, Shield, Code, Cpu, ExternalLink,
  Mail, Phone, MapPin, Github, Linkedin, Menu, X,
  Download, User, Award, Layout, Globe, Server, GraduationCap,
  Play, RotateCcw, Volume2, VolumeX, CheckCircle2, ChevronRight,
  Gamepad2, Sparkles, Send, Brain
} from 'lucide-react';

import resumeFile from './assets/alok_resume.pdf';
import profilePic from './assets/profile-pic.png';
import aboutPic from './assets/about-pic.jpg';

const NAV_ITEMS = ['Home', 'About', 'Experience', 'Skills', 'Projects', 'Playground', 'Contact'];

// Web Audio API Synthesizer Sound Player
const playBeep = (freq = 440, type = 'sine', duration = 0.1, isMuted = false) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = type;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Autoplay browser block fallback
  }
};

/* ── Interactive Particle Background Component ── */
const InteractiveNetworkParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.35)'; // Blue theme color

      particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // ── IntersectionObserver: highlight active nav on scroll ──
  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.toLowerCase());
    const observers = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // ── IntersectionObserver: fade/slide in elements as they enter the viewport ──
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
    setActiveSection(id);
    setIsMenuOpen(false);
    playBeep(700, 'sine', 0.04, isMuted);
  };

  /* ── Interactivity Playground States ── */
  const [activeTab, setActiveTab] = useState('snake');

  /* --- Game 1: Byte-Sized Snake (Code Eater) --- */
  const GRID_SIZE = 16;
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [snakeFood, setSnakeFood] = useState({ x: 4, y: 4 });
  const [snakeDir, setSnakeDir] = useState({ x: 1, y: 0 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
    } catch { return 0; }
  });
  const [snakeStatus, setSnakeStatus] = useState('idle'); // 'idle', 'playing', 'gameover'
  const [snakeObstacles, setSnakeObstacles] = useState([]);
  const snakeIntervalRef = useRef(null);

  const generateFoodPosition = (currentSnake, obstacles) => {
    let position;
    let attempts = 0;
    while (attempts < 100) {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const hitSnake = currentSnake.some(s => s.x === position.x && s.y === position.y);
      const hitObstacle = obstacles.some(o => o.x === position.x && o.y === position.y);
      if (!hitSnake && !hitObstacle) break;
      attempts++;
    }
    return position || { x: 3, y: 3 };
  };

  const generateObstacles = () => {
    const list = [];
    const count = 3;
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
      });
    }
    return list;
  };

  const handleSnakeStart = () => {
    playBeep(440, 'triangle', 0.08, isMuted);
    setTimeout(() => playBeep(554, 'triangle', 0.08, isMuted), 80);
    setTimeout(() => playBeep(659, 'triangle', 0.12, isMuted), 160);

    const obstacles = generateObstacles();
    const initialSnake = [{ x: 8, y: 8 }];
    setSnake(initialSnake);
    setSnakeObstacles(obstacles);
    setSnakeFood(generateFoodPosition(initialSnake, obstacles));
    setProbeDir({ x: 1, y: 0 }); // reset direction
    setSnakeDir({ x: 1, y: 0 });
    setSnakeScore(0);
    setSnakeStatus('playing');
  };

  // Game Loop
  useEffect(() => {
    if (snakeStatus !== 'playing') return;

    const gameLoop = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: head.x + snakeDir.x,
          y: head.y + snakeDir.y,
        };

        if (nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE) {
          handleSnakeGameOver();
          return prevSnake;
        }

        if (prevSnake.some(s => s.x === nextHead.x && s.y === nextHead.y)) {
          handleSnakeGameOver();
          return prevSnake;
        }

        if (snakeObstacles.some(o => o.x === nextHead.x && o.y === nextHead.y)) {
          handleSnakeGameOver();
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        if (nextHead.x === snakeFood.x && nextHead.y === snakeFood.y) {
          playBeep(880, 'triangle', 0.05, isMuted);
          setSnakeScore(prev => {
            const nextScore = prev + 10;
            if (nextScore > snakeHighScore) {
              setSnakeHighScore(nextScore);
              try { localStorage.setItem('snake_highscore', nextScore.toString()); } catch {}
            }
            return nextScore;
          });
          setSnakeFood(generateFoodPosition(newSnake, snakeObstacles));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(80, 180 - (snakeScore / 2));
    snakeIntervalRef.current = setInterval(gameLoop, speed);

    return () => clearInterval(snakeIntervalRef.current);
  }, [snakeStatus, snakeDir, snakeFood, snakeObstacles, snakeScore, snakeHighScore]);

  const handleSnakeGameOver = () => {
    setSnakeStatus('gameover');
    clearInterval(snakeIntervalRef.current);
    playBeep(220, 'sawtooth', 0.35, isMuted);
    setTimeout(() => playBeep(147, 'sawtooth', 0.5, isMuted), 150);
  };

  const handleSnakeKeyPress = (e) => {
    if (snakeStatus !== 'playing') return;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (snakeDir.y === 0) setSnakeDir({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (snakeDir.y === 0) setSnakeDir({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (snakeDir.x === 0) setSnakeDir({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (snakeDir.x === 0) setSnakeDir({ x: 1, y: 0 });
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleSnakeKeyPress);
    return () => window.removeEventListener('keydown', handleSnakeKeyPress);
  }, [snakeDir, snakeStatus]);


  /* --- Game 2: Decryption Puzzle --- */
  const DEC_WORDS = ['ROUTER', 'BUFFER', 'SOCKET', 'SYSTEM', 'MATRIX', 'KERNEL', 'PACKET', 'CYBER', 'VECTOR', 'ENCRYPT'];
  const [decSecret, setDecSecret] = useState('KERNEL');
  const [decAttempts, setDecAttempts] = useState(4);
  const [decHistory, setDecHistory] = useState([]);
  const [decStatus, setDecStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const handleResetDec = () => {
    const word = DEC_WORDS[Math.floor(Math.random() * DEC_WORDS.length)];
    setDecSecret(word);
    setDecAttempts(4);
    setDecHistory([]);
    setDecStatus('playing');
    playBeep(600, 'sine', 0.1, isMuted);
  };

  useEffect(() => {
    const word = DEC_WORDS[Math.floor(Math.random() * DEC_WORDS.length)];
    setDecSecret(word);
  }, []);

  const handleWordClick = (word) => {
    if (decStatus !== 'playing') return;

    playBeep(850, 'sine', 0.05, isMuted);
    let matchCount = 0;
    const len = Math.min(word.length, decSecret.length);
    for (let i = 0; i < len; i++) {
      if (word[i] === decSecret[i]) matchCount++;
    }

    if (word === decSecret) {
      setDecStatus('won');
      setDecHistory(prev => [...prev, `${word} - Decryption Success.`]);
      playBeep(1000, 'triangle', 0.1, isMuted);
      setTimeout(() => playBeep(1200, 'triangle', 0.1, isMuted), 100);
      setTimeout(() => playBeep(1500, 'triangle', 0.25, isMuted), 200);
    } else {
      const nextAttempts = decAttempts - 1;
      setDecAttempts(nextAttempts);
      setDecHistory(prev => [...prev, `${word} - Entry Denied. (Index matches: ${matchCount}/${word.length})`]);
      
      if (nextAttempts <= 0) {
        setDecStatus('lost');
        playBeep(180, 'sawtooth', 0.4, isMuted);
      } else {
        playBeep(320, 'sawtooth', 0.15, isMuted);
      }
    }
  };


  /* ── Core Portfolio Data ── */
  const experience = [
    {
      role: 'Freelance Web Developer',
      company: 'Centurian Web Solutions',
      location: 'Remote',
      period: 'Jul 2026 – Present',
      icon: <Globe className="w-5 h-5 text-amber-400" />,
      details: [
        'Designing and developing client websites using WordPress, cPanel, and custom coding.',
        'Building responsive, user-friendly web solutions tailored to client requirements.',
        'Managing hosting environments and ensuring smooth deployment of projects.',
        'Collaborating with assigned clients to deliver professional, functional websites on time.'
      ],
    },
    {
      role: 'Junior Presentation Designer Trainee',
      company: 'EZ Lab Private Limited',
      period: 'Jan 2026 – Mar 2026',
      icon: <Layout className="w-5 h-5 text-blue-400" />,
      details: [
        'Created professional presentation templates using rigorous visual hierarchy standards.',
        'Established pixel-perfect layout alignments for statistical charts and graphics.',
        'Structured spreadsheet data integrations for clear graphical charts.'
      ],
    },
    {
      role: 'Web Full Stack Developer Intern',
      company: 'Edskills Academy',
      period: 'Oct 2024 – Dec 2024',
      icon: <Code className="w-5 h-5 text-cyan-400" />,
      details: [
        'Engineered responsive web UI components using React hooks and Tailwind systems.',
        'Managed application server setups deploying packages to Apache Tomcat nodes.',
        'Collaborated on code review cycles and debugged deployment warnings.'
      ],
    },
    {
      role: 'Cyber Security Intern (Virtual)',
      company: 'Palo Alto Networks',
      period: 'May 2023 – Jul 2023',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      details: [
        'Conducted vulnerability assessment workflows and audited port security vectors.',
        'Gained hands-on experience in threat modeling, threat intelligence, and packet audits.'
      ],
    },
  ];

  const education = [
    {
      degree: 'B.Tech – Computer Science & Engineering',
      institution: 'Galgotias University',
      period: '2022 – 2026',
      location: 'Greater Noida, India',
      detail: 'Focus: Algorithm Optimization, Software Architectures, Database Management, and Network Protocols.'
    },
  ];

  const skillGroups = [
    { title: 'Programming', skills: ['Python', 'Java', 'C++', 'JavaScript', 'HTML5', 'CSS3'] },
    { title: 'Core Frameworks', skills: ['React.js', 'Node.js', 'Express', 'Apache Tomcat', 'SQL / MongoDB'] },
    { title: 'Developer Tools', skills: ['Git / GitHub', 'VS Code', 'Android Studio', 'Excel Analytics'] },
    { title: 'Design & Sec', skills: ['Visual Hierarchy', 'PowerPoint Design', 'Vulnerability Scanning', 'Network Auditing'] },
  ];

  const certifications = [
    { title: 'Packet Tracer Routing', issuer: 'Cisco Networking Academy', date: '2024' },
    { title: 'Database foundations', issuer: 'Oracle Academy', date: '2023' },
    { title: 'Cybersecurity Fundamentals', issuer: 'IBM Academy', date: '2024' },
  ];

  const projects = [
    {
      title: 'Speech-to-Text Model',
      desc: 'Developed a neural sequence machine learning model achieving 95% accuracy index metrics in voice translations.',
      tags: ['Python', 'TensorFlow', 'ML', 'Audio API'],
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      github: 'https://github.com/aalokpathak'
    },
    {
      title: 'YASA TRADERS',
      desc: 'Full-stack MERN e-commerce transaction platform incorporating secure authentication nodes and real-time checkout APIs.',
      tags: ['MERN Stack', 'JWT Auth', 'Vercel Deployment', 'Tailwind'],
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      link: 'https://yasatraders.vercel.app/'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500 selection:text-slate-950 transition-colors duration-500 relative overflow-x-hidden font-sans">
      
      {/* Dynamic Network Canvas Background */}
      <InteractiveNetworkParticles />
      
      {/* Decorative meshes */}
      <div className="fixed inset-0 tech-grid pointer-events-none z-0" />
      
      {/* Ambient gradient bubbles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] animate-float-slower pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px] animate-float-faster pointer-events-none z-0" />

      {/* ── Sticky Navigation Bar ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/75 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-mono text-white tracking-widest">ALOK.PATHAK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider font-mono">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`transition-all hover:text-blue-400 ${
                  activeSection === item.toLowerCase() ? 'text-blue-400 border-b border-blue-500 pb-0.5' : 'text-slate-400'
                }`}
              >
                {item}
              </button>
            ))}
            
            {/* Audio switch */}
            <button 
              onClick={() => {
                setIsMuted(!isMuted);
                playBeep(600, 'sine', 0.05, !isMuted);
              }} 
              className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-blue-400 transition-all"
              title={isMuted ? "Enable sound effects" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Resume File link */}
            <a
              href={resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-white hover:bg-blue-600 px-4 py-2 rounded-xl transition-all font-bold text-xs"
            >
              <Download className="w-3.5 h-3.5" /> RESUME
            </a>
          </div>

          {/* Mobile controllers */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => {
                setIsMuted(!isMuted);
                playBeep(600, 'sine', 0.05, !isMuted);
              }} 
              className="p-2 rounded-lg border border-white/5 text-blue-400"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button className="text-white p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col px-6 pb-6 gap-2 border-t border-white/5 bg-slate-950">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-left py-2.5 font-mono text-sm tracking-wider transition-all hover:text-blue-400 ${
                  activeSection === item.toLowerCase() ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                &gt; {item.toUpperCase()}
              </button>
            ))}
            <a
              href={resumeFile}
              download
              className="mt-2 flex items-center gap-2 text-sm text-white border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 rounded-xl justify-center font-mono font-bold"
            >
              <Download className="w-4 h-4" /> DOWNLOAD RESUME
            </a>
          </div>
        )}
      </nav>

      <main className="relative z-10">

        {/* ── Section 1: Hero Banner ── */}
        <section id="home" className="min-h-screen flex items-center px-6 pt-24">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-12 items-center">
            
            <div className="md:col-span-7 space-y-8 text-center md:text-left order-2 md:order-1">
              
              <div className="animate-fade-in-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> FULL-STACK SOFTWARE ENGINEER
              </div>

              <h1 className="animate-fade-in-up text-5xl lg:text-7xl font-bold tracking-tight text-white leading-none" style={{ animationDelay: '0.1s' }}>
                ALOK{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-glow animate-gradient-text">
                  PATHAK
                </span>
              </h1>

              <h2 className="animate-fade-in-up text-xl sm:text-2xl font-semibold text-slate-300 font-mono" style={{ animationDelay: '0.2s' }}>
                Crafting robust applications &amp; secure networks.
              </h2>

              <p className="animate-fade-in-up text-slate-400 text-base md:text-lg max-w-xl leading-relaxed" style={{ animationDelay: '0.3s' }}>
                Computer Science and Engineering graduate with specialized skills in building high-fidelity <span className="text-white font-medium">web interfaces</span>, managing <span className="text-white font-medium">Full-Stack data architectures</span>, and auditing <span className="text-white font-medium">cybersecurity infrastructures</span>.
              </p>

              <div className="animate-fade-in-up flex flex-wrap gap-4 justify-center md:justify-start pt-2" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="bg-blue-600 text-white hover:bg-blue-500 font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 flex items-center gap-2 text-sm"
                >
                  <Code className="w-4 h-4" /> EXPLORE WORK
                </button>
                <button
                  onClick={() => scrollToSection('playground')}
                  className="border border-slate-700 hover:bg-slate-900 hover:border-blue-500/40 font-semibold px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 flex items-center gap-2 text-white text-sm"
                >
                  <Gamepad2 className="w-4 h-4" /> INTERACTIVE PLAYGROUND
                </button>
              </div>
            </div>

            {/* Profile Avatar */}
            <div className="animate-fade-in-up md:col-span-5 flex justify-center order-1 md:order-2" style={{ animationDelay: '0.2s' }}>
              <div className="relative group max-w-[280px] sm:max-w-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
                
                <div className="relative w-60 h-60 sm:w-80 sm:h-80 rounded-3xl border border-white/10 overflow-hidden bg-slate-900 flex items-center justify-center p-3 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
                  <img
                    src={profilePic}
                    alt="Alok Pathak"
                    className="w-full h-full object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
                  />
                  
                  <div className="absolute bottom-4 right-4 z-20 bg-slate-950/90 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">Available for work</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 2: About / Professional Path ── */}
        <section id="about" className="py-24 px-6 bg-slate-900/20 border-t border-b border-white/5">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex justify-center reveal">
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 max-w-[320px] lg:max-w-full">
                <img src={aboutPic} alt="About Alok" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-left reveal">
              <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                <User className="text-blue-500 w-9 h-9" /> Professional Path
              </h2>
              
              <div className="h-0.5 w-16 bg-blue-500 rounded" />
              
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                As a Computer Science Engineer, I focus on constructing high-fidelity user interfaces and securing digital networks. By combining analytical developer logic with visual hierarchy design, I specialize in building end-to-end, visually-compelling solutions.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block font-mono text-2xl font-bold text-blue-400">95%</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Speech-to-Text Accuracy</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block font-mono text-2xl font-bold text-cyan-400">100%</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Responsive UI Architecture</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block font-mono text-2xl font-bold text-emerald-400">0</span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono">Security Leaks Audited</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 3: Professional Experience ── */}
        <section id="experience" className="py-24 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <Server className="text-blue-500 w-8 h-8" /> Experience Record
              </h2>
              <p className="text-slate-400 text-sm font-mono">
                Internships, trainee roles, and freelance work along the way.
              </p>
            </div>

            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 space-y-12 py-4">
              {experience.map((job, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group reveal">

                  <div className="absolute -left-[16px] top-1.5 bg-slate-950 border border-blue-500 p-1.5 rounded-full transition-all group-hover:scale-125 glow-primary z-20">
                    {job.icon}
                  </div>

                  <div className="hidden md:block absolute -left-[160px] top-2.5 text-right w-[120px] font-mono text-xs text-blue-400 font-bold">
                    {job.period}
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300 text-left shadow-lg backdrop-blur-sm relative group overflow-hidden hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-blue-500 transition-all" />

                    <span className="block md:hidden font-mono text-xs text-blue-400 font-bold mb-2">
                      {job.period}
                    </span>

                    <h3 className="text-lg font-bold text-white leading-tight">{job.role}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <p className="text-blue-400 font-mono text-xs font-semibold">{job.company}</p>
                      {job.location && (
                        <span className="flex items-center gap-1 text-slate-500 text-[11px] font-mono">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2 mt-4">
                      {job.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-slate-400 text-xs sm:text-sm flex gap-2">
                          <span className="text-blue-500 shrink-0">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Section 4: Education Core ── */}
        <section id="education" className="py-24 px-6 bg-slate-900/20 border-b border-white/5">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <GraduationCap className="text-blue-500 w-8 h-8" /> Education Core
              </h2>
              <p className="text-slate-400 text-sm font-mono">
                Academic engineering credentials.
              </p>
            </div>

            <div className="space-y-6 reveal">
              {education.map((edu, i) => (
                <div 
                  key={i} 
                  className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all flex flex-wrap gap-6 items-start justify-between text-left relative"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                  <div className="flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                      <GraduationCap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">{edu.degree}</h3>
                      <p className="text-blue-400 font-mono text-xs font-semibold">{edu.institution}</p>
                      <p className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" /> {edu.location}
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm mt-3 pt-2 border-t border-white/5 max-w-xl">
                        {edu.detail}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 shrink-0 font-bold">{edu.period}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Section 5: Technical Arsenal ── */}
        <section id="skills" className="py-24 px-6 border-b border-white/5">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <Award className="text-blue-500 w-8 h-8" /> Technical Arsenal
              </h2>
              <p className="text-slate-400 text-sm font-mono">
                System languages, core frameworks, and visual styling tools.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
              {skillGroups.map((group, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all flex flex-col gap-4 text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 group-hover:bg-blue-500 transition-all" />
                  <h3 className="text-blue-400 font-mono font-bold uppercase text-xs tracking-widest">
                    // {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 text-xs font-mono border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications and credentials list */}
            <div className="grid md:grid-cols-3 gap-4 pt-4 reveal">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 text-left">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 shrink-0">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-0.5 font-mono">
                    <h4 className="text-white font-semibold text-xs sm:text-sm">{c.title}</h4>
                    <p className="text-slate-500 text-[10px]">{c.issuer}</p>
                    <p className="text-blue-400 text-[9px] font-bold mt-0.5">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Section 6: Featured Projects ── */}
        <section id="projects" className="py-24 px-6 bg-slate-900/10 border-b border-white/5">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <Code className="text-blue-500 w-8 h-8" /> Featured Work
              </h2>
              <p className="text-slate-400 text-sm font-mono">
                Software solutions and compiled data models.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 reveal">
              {projects.map((p, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all flex flex-col justify-between h-full min-h-[220px] text-left relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                    {p.icon}
                  </div>
                  <div>
                    <span className="p-2 bg-slate-900 border border-white/5 rounded-xl inline-block mb-3">
                      {p.icon}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">{p.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-y-2 pt-4 border-t border-white/5 mt-4">
                    <div className="flex gap-1.5 flex-wrap flex-1 min-w-0 pr-2">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-500 font-bold uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex shrink-0">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:text-blue-400 transition-all inline-block"
                          title="View Repository"
                        >
                          <Github className="w-4.5 h-4.5" />
                        </a>
                      )}
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:text-blue-400 transition-all inline-block"
                          title="Live Deployment"
                        >
                          <ExternalLink className="w-4.5 h-4.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Section 7: Interactivity Playground (Games) ── */}
        <section id="playground" className="py-24 px-6 relative">
          <div className="max-w-5xl mx-auto space-y-12">
            
            <div className="text-center space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <Gamepad2 className="text-blue-500 w-9 h-9 animate-bounce" /> Interactivity Playground
              </h2>
              <p className="text-slate-400 text-sm font-mono max-w-md mx-auto">
                A couple of quick games I built with React — take a break and see how they hold up.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch reveal">
              
              {/* Tab Selector */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setActiveTab('snake');
                    playBeep(650, 'sine', 0.05, isMuted);
                  }}
                  className={`p-4 rounded-2xl border text-left font-mono transition-all flex flex-col gap-1 ${
                    activeTab === 'snake'
                      ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-bold text-blue-400">GAME 01</span>
                  <span className="font-bold text-sm tracking-wide">Classic Snake</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Grow the snake, dodge the walls.</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('decrypter');
                    playBeep(650, 'sine', 0.05, isMuted);
                  }}
                  className={`p-4 rounded-2xl border text-left font-mono transition-all flex flex-col gap-1 ${
                    activeTab === 'decrypter'
                      ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-bold text-blue-400">GAME 02</span>
                  <span className="font-bold text-sm tracking-wide">Code Breaker</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Guess the hidden word.</span>
                </button>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[11px] text-slate-500 leading-relaxed mt-auto hidden lg:block">
                  <span className="font-bold text-blue-400 block mb-1">🎮 How to play:</span>
                  Snake: use arrow keys or WASD to steer. Code Breaker: click a word and use the match count to narrow down the answer.
                </div>
              </div>

              {/* Game display screen */}
              <div className="lg:col-span-9 rounded-3xl border border-white/5 bg-slate-950 p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[440px]">
                
                {/* Game 1: Snake */}
                {activeTab === 'snake' && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-full flex justify-between items-center border-b border-slate-900 pb-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>Score: {snakeScore}</span>
                      </div>
                      <div className="text-slate-500 font-semibold">
                        High Score: {snakeHighScore}
                      </div>
                    </div>

                    {snakeStatus === 'idle' && (
                      <div className="flex flex-col items-center py-12 text-center space-y-4">
                        <Cpu className="w-16 h-16 text-blue-500 animate-spin" style={{ animationDuration: '8s' }} />
                        <h3 className="font-mono font-bold text-white text-lg">Ready to Play?</h3>
                        <p className="text-xs text-slate-500 font-mono max-w-sm">
                          Collect the glowing nodes to grow your snake, and steer clear of the red obstacles and walls.
                        </p>
                        <button
                          onClick={handleSnakeStart}
                          className="bg-blue-500 text-slate-950 font-mono font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-white transition-all shadow-md hover:scale-105"
                        >
                          Start Game
                        </button>
                      </div>
                    )}

                    {snakeStatus === 'gameover' && (
                      <div className="flex flex-col items-center py-10 text-center space-y-4">
                        <span className="text-red-500 font-mono font-bold text-xl tracking-widest animate-pulse">Game Over</span>
                        <p className="text-xs text-slate-500 font-mono">
                          You hit an obstacle or the wall — give it another shot.
                        </p>
                        <div className="bg-slate-900 border border-white/5 px-4 py-2 rounded-xl font-mono text-xs text-white">
                          Final Score: {snakeScore}
                        </div>
                        <button
                          onClick={handleSnakeStart}
                          className="bg-red-500/20 border border-red-500 text-red-400 font-mono font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all hover:scale-105"
                        >
                          Play Again
                        </button>
                      </div>
                    )}

                    {snakeStatus === 'playing' && (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <div 
                          className="grid bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden p-1 shadow-inner"
                          style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                            width: '270px',
                            height: '270px',
                          }}
                        >
                          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                            const x = idx % GRID_SIZE;
                            const y = Math.floor(idx / GRID_SIZE);
                            
                            const isSnakeSegment = snake.some(s => s.x === x && s.y === y);
                            const isHead = snake[0].x === x && snake[0].y === y;
                            const isFood = snakeFood.x === x && snakeFood.y === y;
                            const isObstacle = snakeObstacles.some(o => o.x === x && o.y === y);

                            let cellClass = "bg-transparent";
                            let cellContent = "";

                            if (isHead) {
                              cellClass = "bg-blue-500 border border-blue-400 rounded-sm shadow shadow-blue-500/30";
                              cellContent = "*";
                            } else if (isSnakeSegment) {
                              cellClass = "bg-blue-600/75 rounded-sm";
                              cellContent = "•";
                            } else if (isFood) {
                              cellClass = "bg-cyan-400 rounded-full animate-ping";
                            } else if (isObstacle) {
                              cellClass = "bg-red-500/80 rounded-sm animate-pulse";
                            }

                            return (
                              <div 
                                key={idx} 
                                className={`w-full aspect-square flex items-center justify-center font-mono text-[9px] font-bold text-slate-950 ${cellClass}`}
                              >
                                {isFood ? "0x" : cellContent}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Mobile controls */}
                        <div className="flex flex-col items-center gap-1 lg:hidden">
                          <button 
                            onClick={() => { if(snakeDir.y === 0) setSnakeDir({ x: 0, y: -1 }); }}
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center shadow"
                          >
                            ▲
                          </button>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => { if(snakeDir.x === 0) setSnakeDir({ x: -1, y: 0 }); }}
                              className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center shadow"
                            >
                              ◀
                            </button>
                            <button 
                              onClick={() => { if(snakeDir.x === 0) setSnakeDir({ x: 1, y: 0 }); }}
                              className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center shadow"
                            >
                              ▶
                            </button>
                          </div>
                          <button 
                            onClick={() => { if(snakeDir.y === 0) setSnakeDir({ x: 0, y: 1 }); }}
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center shadow"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Game 2: Decrypter */}
                {activeTab === 'decrypter' && (
                  <div className="w-full space-y-4 font-mono text-left">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3 font-mono text-xs">
                      <span className="text-blue-400 font-bold uppercase tracking-wider">🔒 Code Breaker</span>
                      <span className="text-slate-500 font-bold">Attempts Left: {decAttempts}</span>
                    </div>

                    {decStatus === 'playing' && (
                      <div className="grid md:grid-cols-2 gap-6 items-start">
                        
                        <div className="space-y-2">
                          <p className="text-[11px] text-blue-400 font-bold mb-3 uppercase tracking-widest">&gt; Guess the secret word:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {DEC_WORDS.map((word) => (
                              <button
                                key={word}
                                onClick={() => handleWordClick(word)}
                                className="px-3 py-2 bg-slate-900 border border-white/5 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-left text-xs tracking-wider transition-all font-mono hover:bg-slate-850 flex items-center gap-1.5"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-blue-400" /> {word}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl h-[200px] flex flex-col justify-between">
                          <div className="overflow-y-auto space-y-1 text-[11px] text-slate-400">
                            <p className="text-slate-500 font-bold">INPUT ATTEMPTS TIMELINE...</p>
                            {decHistory.length === 0 ? (
                              <p className="text-slate-600 italic font-sans">Click words on the left. The index matching count helps pin the target password.</p>
                            ) : (
                              decHistory.map((log, index) => (
                                <p key={index} className="font-mono text-emerald-400">&gt;&gt; {log}</p>
                              ))
                            )}
                          </div>
                          
                          <div className="flex gap-2 items-center border-t border-slate-900 pt-3">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Attempts Remaining:</span>
                            <div className="flex gap-1">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-3 h-3 rounded-sm ${
                                    i < decAttempts ? 'bg-blue-500 shadow shadow-blue-500/20' : 'bg-slate-800'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {decStatus === 'won' && (
                      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-pulse" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider font-mono">Access Decrypted Successfully</h3>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl max-w-md font-sans text-xs text-slate-300 leading-relaxed text-center">
                          <p className="font-mono font-bold text-emerald-400 mb-1">🔐 Nice work:</p>
                          "Clean logic, sharp instincts. You cracked the code on the first pass — that's the same puzzle-solving mindset behind every good piece of software."
                        </div>
                        <button
                          onClick={handleResetDec}
                          className="bg-emerald-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-white transition-all font-mono hover:scale-105"
                        >
                          Play Again
                        </button>
                      </div>
                    )}

                    {decStatus === 'lost' && (
                      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <span className="text-red-500 text-5xl font-mono">⚠️</span>
                        <h3 className="text-xl font-bold text-red-400 uppercase tracking-wider font-mono">Out of Attempts</h3>
                        <p className="text-xs text-slate-400 font-sans max-w-sm">
                          No worries — the word has been reshuffled. Give it another try.
                        </p>
                        <button
                          onClick={handleResetDec}
                          className="bg-red-500/20 border border-red-500 text-red-400 font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all font-mono hover:scale-105"
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

        {/* ── Section 8: Contact / Footer ── */}
        <footer id="contact" className="py-20 px-6 bg-slate-900/10 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
                <Shield className="text-blue-500 w-8 h-8 animate-pulse" /> Let's Connect
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                Actively seeking roles in Software Engineering, Web Development, and Frontend systems. Open to full-time opportunities.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-mono reveal">
              <a
                href="mailto:pathakalok256@gmail.com"
                className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all text-xs sm:text-sm"
              >
                <Mail className="w-5 h-5 text-blue-500" /> pathakalok256@gmail.com
              </a>
              <a
                href="tel:+916202551582"
                className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all text-xs sm:text-sm"
              >
                <Phone className="w-5 h-5 text-emerald-500" /> +91 6202551582
              </a>
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl text-slate-400 text-xs sm:text-sm">
                <MapPin className="w-5 h-5 text-red-500" /> Greater Noida, India
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/aalokpathak"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500 transition-all text-white shadow-md hover:-translate-y-1"
                aria-label="GitHub Profile"
              >
                <Github />
              </a>
              <a
                href="https://www.linkedin.com/in/alok-pathak-113491157/"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500 transition-all text-white shadow-md hover:-translate-y-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin />
              </a>
            </div>

            <p className="text-slate-600 text-xs font-mono pt-4">
              © {new Date().getFullYear()} Alok Pathak — Built with React + TailwindCSS + Vite
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Portfolio;