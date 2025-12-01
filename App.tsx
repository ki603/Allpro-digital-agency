import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Rocket, Layers, Code, Megaphone, Cpu, ChevronRight, CheckCircle, ArrowRight, Instagram, Linkedin, Facebook, Youtube, Eye, Layout, Image as ImageIcon, Palette, Smartphone, Sparkles, Zap, Globe, Search, BrainCircuit, BarChart3, Fingerprint, Mail, MapPin, Scale, Shield, FileText, ClipboardList, MonitorPlay, Flag, Sun, Moon, Download, Scan, Play, Check, ExternalLink, Target, Lightbulb, CreditCard } from 'lucide-react';
import ChatWidget from './components/ChatWidget';
import { generateAudit, AuditResult } from './services/geminiService';
import jsPDF from 'jspdf';
import { translations, Language } from './translations';

// --- Helper Components ---

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? 'active' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; onClick?: () => void }> = ({ children, className = "", title, onClick }) => (
  <div 
    onClick={onClick} 
    className={`glass-card p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 ${className} ${onClick ? 'cursor-pointer neon-box-hover active:scale-[0.98]' : ''}`}
  >
    <div className="shimmer-overlay"></div>
    {title && <h3 className="text-xl font-display font-bold mb-3 text-slate-800 dark:text-white neon-text relative z-10">{title}</h3>}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// --- Background Slideshow Component ---
const BackgroundSlideshow = () => {
  const images = [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", // Modern Office
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Tech Globe
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cyber Tech
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"  // Teamwork
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-100 dark:bg-[#050511]">
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={img} 
            alt="Background" 
            className="w-full h-full object-cover animate-ken-burns" 
          />
        </div>
      ))}
      {/* Global Overlay - Lightened to ensure images are visible under the content */}
      <div className="absolute inset-0 bg-slate-50/40 dark:bg-[#050511]/30 backdrop-blur-[1px]"></div>
    </div>
  );
};

// --- Logo Component (Animated Typography) ---
const Logo: React.FC<{ variant?: 'header' | 'footer', slogan?: string }> = ({ variant = 'header', slogan }) => {
  const isFooter = variant === 'footer';
  
  return (
    <div className="group cursor-pointer relative z-50 select-none active:scale-95 transition-transform duration-200">
      {/* Background Glow Effect on Hover */}
      <div className="absolute -inset-6 bg-gradient-allpro opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col justify-center">
          {/* Main Brand Name with Gradient Animation */}
          <span className={`${isFooter ? 'text-5xl' : 'text-3xl'} font-display font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-allpro animate-gradient-x`}>
            All'Pro
          </span>
          
          {/* Subtitle / Tagline */}
          {!isFooter ? (
             <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400 dark:text-white/40 group-hover:text-allpro-rose transition-colors duration-300 ml-0.5 mt-1.5 flex items-center gap-2">
                Digital Agency
                <span className="w-1.5 h-1.5 rounded-full bg-allpro-rose animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></span>
             </span>
          ) : (
            <span className="text-xs font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-allpro-rose to-allpro-orange uppercase tracking-widest mt-2">
                {slogan}
            </span>
          )}
      </div>
    </div>
  );
};

// --- Hero Particles (Interactive & Cosmic) ---
const HeroParticles: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    // Cosmic Palette
    const colors = isDarkMode 
    ? ['#E54A6D', '#FF8A00', '#60A5FA', '#8B5CF6', '#FFFFFF'] // Added Purple/Violet for cosmic feel
    : ['#E54A6D', '#FF8A00', '#3B82F6', '#6366F1', '#1e293b'];

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseX: number;
      baseY: number;
      density: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3; // Slightly faster for "dynamic" feel
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 0.5; // Slightly larger
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.density = (Math.random() * 30) + 1;
        this.alpha = Math.random() * 0.5 + 0.2; // Higher base opacity (0.2 to 0.7)
      }

      update() {
        if (!canvas) return;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 200; // Increased interaction radius
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 50; 
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 50;
          }
        }
        
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // Increased density
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) { // Increased connection distance
                    ctx.beginPath();
                    let opacityValue = 1 - (distance / 120);
                    // Higher opacity for lines
                    ctx.strokeStyle = isDarkMode 
                        ? `rgba(255, 255, 255, ${opacityValue * 0.2})`
                        : `rgba(30, 41, 59, ${opacityValue * 0.2})`; 
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
        {/* Cosmic Gradient Base - Increased Opacity for Visibility */}
        <div className={`absolute inset-0 ${isDarkMode 
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1b3d]/60 via-[#0f172a]/50 to-transparent' 
            : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/60 via-slate-100/50 to-transparent'}`}>
        </div>
        
        {/* Decorative Orbs for "Space" feel */}
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-allpro-rose/20 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>

        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedMethodStep, setSelectedMethodStep] = useState<any>(null);
  const [activeLegalSection, setActiveLegalSection] = useState<'mentions' | 'confidentialite' | 'cgv' | null>(null);

  // Portfolio State (Restored from PortfolioPage)
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Audit State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditStep, setAuditStep] = useState<'input' | 'loading' | 'result'>('input');
  const [auditInput, setAuditInput] = useState('');
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Contact Form State
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Theme Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleStartAudit = async () => {
    if (!auditInput.trim()) return;
    setAuditStep('loading');
    
    // Pass language to generateAudit
    const result = await generateAudit(auditInput, lang);
    
    if (result) {
      setAuditData(result);
      setAuditStep('result');
      setCurrentSlide(0);
    } else {
      // Fallback or error handling
      setAuditStep('input');
      alert(lang === 'fr' ? "L'analyse a échoué. Veuillez réessayer." : "Analysis failed. Please try again.");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    // Simulate network delay
    setTimeout(() => {
        setContactStatus('success');
    }, 2000);
  };

  const resetContactForm = () => {
      setContactStatus('idle');
  };

  const downloadAuditPDF = () => {
    if (!auditData) return;

    const doc = new jsPDF();
    const primaryColor = '#E54A6D';
    const secondaryColor = '#0B0B15';

    // Page 1: Cover
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 20, 'F'); // Header bar
    
    doc.setFontSize(24);
    doc.setTextColor(secondaryColor);
    doc.text(`AUDIT DIGITAL IA`, 105, 50, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text(auditData.businessName, 105, 70, { align: 'center' });
    
    doc.setFontSize(40);
    doc.setTextColor(secondaryColor);
    doc.text(`SCORE: ${auditData.overallScore}/100`, 105, 100, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(auditData.summary, 105, 120, { align: 'center', maxWidth: 160 });

    doc.text(lang === 'fr' ? "Généré par All'Pro Agency" : "Generated by All'Pro Agency", 105, 280, { align: 'center' });

    // Slides
    auditData.slides.forEach((slide, index) => {
      doc.addPage();
      
      // Header
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setFontSize(18);
      doc.setTextColor(primaryColor);
      doc.text(slide.title, 20, 20);

      // Content
      doc.setFontSize(12);
      doc.setTextColor(0);
      let yPos = 50;
      
      slide.points.forEach(point => {
        doc.text(`• ${point}`, 20, yPos);
        yPos += 15;
      });
      
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${index + 2}`, 200, 290, { align: 'right' });
    });

    doc.save(`Audit_${auditData.businessName.replace(/\s/g, '_')}.pdf`);
  };

  // --- Backend Simulation & Calculation Logic ---
  // In a real app, these values would come from an API
  const GENSPARK_PRICE = 20.00; // Simulated Base Price
  const HOSTINGER_PRICE = 9.99; // Simulated Base Price
  const LABOR_PERCENTAGE = 0.03;

  // Calculs dynamiques
  const litePrice = GENSPARK_PRICE;
  const plusPrice = (GENSPARK_PRICE + HOSTINGER_PRICE) * (1 + LABOR_PERCENTAGE);
  // Pro price depends on custom vars, handled in display

  // Mapped Data based on current language
  const serviceIcons = [<Layers size={32} />, <Megaphone size={32} />, <Code size={32} />, <Rocket size={32} />, <Fingerprint size={32} />, <Cpu size={32} />];
  const services = t.services_section.items.map((item, index) => ({
      id: index + 1,
      icon: serviceIcons[index],
      ...item
  }));

  const methodIcons = [<Search size={20} />, <Palette size={20} />, <CheckCircle size={20} />, <Code size={20} />, <BarChart3 size={20} />];
  const methodSteps = t.method.steps.map((item, index) => ({
      step: `0${index + 1}`,
      icon: methodIcons[index],
      ...item
  }));

  // Portfolio Data (Restored)
  const portfolioItems = [
    { 
      id: 1, 
      title: "Lumina Fashion", 
      category: "web", 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", 
      desc: "E-shop Minimaliste",
      client: "Lumina Co.",
      year: "2023",
      tags: ["React", "Shopify", "UX/UI"],
      challenge: "Créer une expérience d'achat fluide et minimaliste pour une marque de luxe, capable de gérer 50k visiteurs/jour.",
      solution: "Développement d'un thème Shopify sur-mesure headless avec React, optimisé pour le mobile et le SEO.",
      result: "+150% de conversion en 3 mois."
    },
    { 
      id: 2, 
      title: "TechNova", 
      category: "branding", 
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", 
      desc: "Identité Visuelle Tech",
      client: "TechNova Inc",
      year: "2024",
      tags: ["Logo", "Brand Guide", "3D"],
      challenge: "Moderniser l'image d'une startup blockchain pour inspirer confiance et innovation.",
      solution: "Création d'un univers graphique basé sur la transparence et les néons, avec logo dynamique et charte complète.",
      result: "Levée de fonds réussie de 2M€."
    },
    { 
      id: 3, 
      title: "Café Aura", 
      category: "social", 
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop", 
      desc: "Campagne Instagram",
      client: "Aura Coffee",
      year: "2023",
      tags: ["Content", "Reels", "Strategy"],
      challenge: "Augmenter la fréquentation physique via les réseaux sociaux pour une nouvelle chaîne de cafés.",
      solution: "Stratégie 'Coffee Culture' axée sur l'esthétique et les Reels ASMR. Partenariats micro-influenceurs.",
      result: "+10k followers et files d'attente quotidiennes."
    },
    { 
      id: 4, 
      title: "EcoDrive", 
      category: "web", 
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop", 
      desc: "SaaS Dashboard",
      client: "EcoSolutions",
      year: "2022",
      tags: ["Dashboard", "Vue.js", "Data"],
      challenge: "Simplifier la visualisation de données complexes de consommation énergétique pour les gestionnaires de flotte.",
      solution: "Design d'un tableau de bord intuitif avec visualisation de données temps réel et alertes IA.",
      result: "Réduction de 20% des coûts énergétiques clients."
    },
    { 
      id: 5, 
      title: "Urban Pulse", 
      category: "video", 
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop", 
      desc: "Spot Publicitaire",
      client: "City Sports",
      year: "2023",
      tags: ["Production", "Drone", "Editing"],
      challenge: "Lancer une nouvelle gamme de sneakers urbaines avec un budget média serré.",
      solution: "Production d'un clip vidéo dynamique et urbain tourné au drone FPV, formaté pour TikTok et YouTube Ads.",
      result: "1M de vues organiques en 2 semaines."
    },
    { 
      id: 6, 
      title: "Zen Spa", 
      category: "branding", 
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop", 
      desc: "Rebranding complet",
      client: "Zen Group",
      year: "2024",
      tags: ["Packaging", "Web", "Print"],
      challenge: "Unifier l'image de marque de 5 spas sous une identité premium et apaisante.",
      solution: "Refonte totale : logo, palette couleurs terreuses, site de réservation et packaging produits.",
      result: "Augmentation de 30% du panier moyen."
    },
  ];

  const filteredPortfolio = activePortfolioFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activePortfolioFilter);

  // Define nav items for mapping - Fixed ID usage
  const navItems = [
    { label: t.nav.services, id: 'services' },
    { label: t.nav.pricing, id: 'tarifs' }, // New Section
    { label: t.nav.expertise, id: 'expertise-ia' },
    { label: t.nav.portfolio, id: 'realisations' },
    { label: t.nav.method, id: 'methode' },
    { label: t.nav.contact, id: 'contact' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans selection:bg-allpro-rose selection:text-white transition-colors duration-300">
      
      <BackgroundSlideshow />

      <div className="relative z-10">

        {/* Navigation */}
        <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300">
          <div className="glass-panel mx-4 mt-4 rounded-2xl px-6 py-3 flex justify-between items-center max-w-7xl md:mx-auto shadow-lg shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="header" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 font-heading text-sm font-semibold text-slate-700 dark:text-white/90">
              {navItems.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-allpro-rose transition-colors relative group active:scale-95 duration-200"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-allpro-rose transition-all group-hover:w-full"></span>
                  </button>
              ))}
              
              <div className="flex items-center gap-2 border-l border-slate-300 dark:border-white/20 pl-4">
                  {/* Language Toggle */}
                  <button 
                    onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-bold text-xs active:scale-90 duration-200"
                  >
                    <span className={lang === 'fr' ? 'text-allpro-rose' : 'text-slate-500 dark:text-white/50'}>FR</span>
                    <span className="text-slate-300 dark:text-white/20">/</span>
                    <span className={lang === 'en' ? 'text-allpro-rose' : 'text-slate-500 dark:text-white/50'}>EN</span>
                  </button>

                  {/* Theme Toggle */}
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white active:scale-90 duration-200"
                    aria-label="Toggle Theme"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
              </div>

              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2 rounded-full bg-gradient-allpro text-white shadow-md neon-btn hover:scale-105 transform transition-transform active:scale-95 duration-200"
              >
                {t.nav.launch}
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="font-bold text-sm text-slate-700 dark:text-white active:scale-95 duration-200">{lang.toUpperCase()}</button>
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white active:scale-90 duration-200"
              >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button className="text-slate-900 dark:text-white active:scale-90 duration-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="absolute top-24 left-4 right-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden animate-fade-in z-50">
              {navItems.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => scrollToSection(item.id)}
                    className="text-left font-heading font-semibold text-slate-800 dark:text-white py-3 border-b border-slate-200 dark:border-white/10 last:border-0 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </button>
              ))}
            </div>
          )}
        </nav>

        {/* SECTION 1: HERO (Intro) */}
        <section className="pt-40 pb-20 px-4 min-h-screen flex items-center justify-center relative overflow-hidden">
          
          <HeroParticles isDarkMode={isDarkMode} />
          
          <div className="max-w-6xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-allpro-rose/30 shadow-lg animate-slide-up bg-white/50 dark:bg-white/5 hover:scale-105 transition-transform duration-500 cursor-default">
              <Sparkles size={16} className="text-allpro-rose dark:text-allpro-yellow" />
              <span className="text-sm font-bold bg-gradient-allpro bg-clip-text text-transparent uppercase tracking-wider">
                {t.hero.badge}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-[1.1] text-slate-900 dark:text-white">
              <span className="block animate-slide-up delay-100">{t.hero.title_part1} <span className="text-gradient">{t.hero.title_part2}</span>, {t.hero.title_part3} <span className="text-gradient">{t.hero.title_part4}</span>.</span>
              <span className="block animate-slide-up delay-200 text-3xl md:text-5xl mt-2 font-bold text-slate-600 dark:text-white/80">{t.hero.subtitle}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-10 font-sans leading-relaxed animate-slide-up delay-300">
              {t.hero.desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-full bg-gradient-allpro text-white font-heading font-bold neon-btn flex items-center justify-center gap-2 group active:scale-95 transition-all duration-200"
              >
                {t.hero.btn_start} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowAuditModal(true)}
                className="px-8 py-4 rounded-full glass-panel text-slate-700 dark:text-white font-heading font-bold hover:bg-white/40 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/20 flex items-center gap-2 hover:border-allpro-rose/30 active:scale-95 duration-200"
              >
                <Scan size={20} className="text-allpro-rose" />
                {t.hero.btn_audit}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: SERVICES */}
        <section id="services" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.services_section.title}</h2>
              <p className="text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto">{t.services_section.subtitle}</p>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={index * 100} className="h-full">
                  <GlassCard 
                    className="h-full flex flex-col justify-between hover:border-allpro-rose/30 transition-colors"
                    onClick={() => setSelectedService(service)}
                  >
                    <div>
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-allpro-rose mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-display font-bold mb-3 text-slate-800 dark:text-white">{service.title}</h3>
                      <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed mb-6">
                        {service.desc}
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-bold text-allpro-orange group-hover:gap-2 transition-all">
                      {t.services_section.learn_more} <ChevronRight size={16} />
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: PRICING (NOUVELLE SECTION) */}
        <section id="tarifs" className="py-24 px-4 relative bg-white/30 dark:bg-white/5 backdrop-blur-sm border-y border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.pricing.title}</h2>
               <p className="text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* LITE PLAN */}
               <Reveal delay={0}>
                  <div className="glass-card p-8 rounded-3xl h-full flex flex-col border-t-4 border-t-slate-300 dark:border-t-white/30 hover:scale-[1.02] transition-transform duration-300">
                      <div className="mb-6">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white text-xs font-bold uppercase tracking-wider">{t.pricing.plans[0].tag}</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.pricing.plans[0].title}</h3>
                      <p className="text-slate-600 dark:text-white/60 text-sm mb-6 min-h-[40px]">{t.pricing.plans[0].desc}</p>
                      
                      <div className="mb-8">
                         <span className="text-4xl font-bold text-slate-900 dark:text-white">{litePrice.toFixed(2)}€</span>
                         <span className="text-xs text-slate-500 block mt-1">{t.pricing.plans[0].price_sub}</span>
                      </div>

                      <ul className="space-y-4 mb-8 flex-1">
                         {t.pricing.plans[0].features.map((feat, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/80">
                              <CheckCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                              {feat}
                           </li>
                         ))}
                      </ul>

                      <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                         {t.pricing.cta}
                      </button>
                  </div>
               </Reveal>

               {/* PLUS PLAN (Highlighted) */}
               <Reveal delay={150}>
                  <div className="glass-card p-8 rounded-3xl h-full flex flex-col border-t-4 border-t-allpro-rose relative transform md:-translate-y-4 shadow-xl shadow-allpro-rose/10 bg-white/80 dark:bg-slate-900/60">
                      <div className="absolute top-0 right-0 bg-allpro-rose text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">POPULAIRE</div>
                      <div className="mb-6">
                        <span className="px-3 py-1 rounded-full bg-allpro-rose/10 text-allpro-rose text-xs font-bold uppercase tracking-wider">{t.pricing.plans[1].tag}</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.pricing.plans[1].title}</h3>
                      <p className="text-slate-600 dark:text-white/60 text-sm mb-6 min-h-[40px]">{t.pricing.plans[1].desc}</p>
                      
                      <div className="mb-8">
                         <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-allpro">{plusPrice.toFixed(2)}€</span>
                         <span className="text-xs text-slate-500 block mt-1">{t.pricing.plans[1].price_sub}</span>
                      </div>

                      <ul className="space-y-4 mb-8 flex-1">
                         {t.pricing.plans[1].features.map((feat, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/90 font-medium">
                              <CheckCircle size={16} className="text-allpro-rose shrink-0 mt-0.5" />
                              {feat}
                           </li>
                         ))}
                      </ul>

                      <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl bg-gradient-allpro text-white font-bold shadow-lg neon-btn hover:scale-[1.02] transition-transform">
                         {t.pricing.cta}
                      </button>
                  </div>
               </Reveal>

               {/* PRO PLAN */}
               <Reveal delay={300}>
                  <div className="glass-card p-8 rounded-3xl h-full flex flex-col border-t-4 border-t-allpro-orange hover:scale-[1.02] transition-transform duration-300">
                      <div className="mb-6">
                        <span className="px-3 py-1 rounded-full bg-allpro-orange/10 text-allpro-orange text-xs font-bold uppercase tracking-wider">{t.pricing.plans[2].tag}</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.pricing.plans[2].title}</h3>
                      <p className="text-slate-600 dark:text-white/60 text-sm mb-6 min-h-[40px]">{t.pricing.plans[2].desc}</p>
                      
                      <div className="mb-8">
                         <span className="text-4xl font-bold text-slate-900 dark:text-white">Sur Devis</span>
                         <span className="text-xs text-slate-500 block mt-1">
                             {`> ${plusPrice.toFixed(0)}€ ${t.pricing.plans[2].price_sub}`}
                         </span>
                      </div>

                      <ul className="space-y-4 mb-8 flex-1">
                         {t.pricing.plans[2].features.map((feat, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/80">
                              <CheckCircle size={16} className="text-allpro-orange shrink-0 mt-0.5" />
                              {feat}
                           </li>
                         ))}
                      </ul>

                      <button onClick={() => scrollToSection('contact')} className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                         {t.pricing.cta}
                      </button>
                  </div>
               </Reveal>
            </div>
            
            <p className="text-center text-xs text-slate-500 dark:text-white/40 mt-8 italic">
               {t.pricing.base_cost_note}
            </p>
          </div>
        </section>

        {/* SECTION: AUDIT PROMO */}
        <section className="py-16 px-4">
           <Reveal>
             <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_rgba(229,74,109,0.3)] hover:-translate-y-1 active:scale-[0.99]" onClick={() => setShowAuditModal(true)}>
                <div className="absolute inset-0 bg-gradient-to-r from-allpro-dark to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"></div>
                
                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-allpro-rose/20 border border-allpro-rose/30 mb-4">
                         <span className="w-2 h-2 rounded-full bg-allpro-rose animate-pulse"></span>
                         <span className="text-xs font-bold text-allpro-rose uppercase tracking-wider">{t.audit_promo.badge}</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">{t.audit_promo.title} <span className="text-gradient">{t.audit_promo.title_gradient}</span></h2>
                      <p className="text-white/70 text-lg">{t.audit_promo.desc}</p>
                   </div>
                   <button className="shrink-0 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/10 active:scale-95 duration-200">
                      <Scan size={20} /> {t.audit_promo.cta}
                   </button>
                </div>
             </div>
           </Reveal>
        </section>

        {/* SECTION: FOCUS IA */}
        <section id="expertise-ia" className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/5 -z-10 transform -skew-y-3 origin-top-left scale-110 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-allpro rounded-[3rem] opacity-10 blur-2xl animate-pulse-slow"></div>
                  <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-slate-200 dark:border-white/20 relative z-10 hover:border-allpro-rose/30 transition-colors duration-500">
                      <BrainCircuit size={64} className="text-allpro-rose mb-6" />
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.ia_section.intro_title}</h3>
                      <p className="text-slate-600 dark:text-white/80 mb-6 leading-relaxed">
                        {t.ia_section.intro_desc}
                      </p>
                      <ul className="space-y-4">
                        {t.ia_section.list.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 font-medium text-slate-700 dark:text-white/90 p-2 rounded-lg hover:bg-allpro-rose/5 transition-all duration-300 hover:translate-x-2 cursor-default border border-transparent hover:border-allpro-rose/10">
                            <div className="w-6 h-6 rounded-full bg-allpro-rose/10 dark:bg-allpro-rose/20 flex items-center justify-center text-allpro-rose shrink-0">
                              <CheckCircle size={14} />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 dark:text-white leading-tight">
                  {t.ia_section.main_title} <span className="text-gradient">{t.ia_section.main_title_gradient}</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-white/70 mb-8 leading-relaxed">
                  {t.ia_section.main_desc}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-default">
                      <span className="block text-3xl font-bold text-allpro-rose mb-1">+40%</span>
                      <span className="text-xs text-slate-500 dark:text-white/60 uppercase font-bold tracking-wide">{t.ia_section.stats.prod}</span>
                  </div>
                  <div className="glass-card p-4 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-default">
                      <span className="block text-3xl font-bold text-allpro-orange mb-1">24/7</span>
                      <span className="text-xs text-slate-500 dark:text-white/60 uppercase font-bold tracking-wide">{t.ia_section.stats.avail}</span>
                  </div>
                </div>

                <div className="mt-8">
                    <a 
                      href="https://labs.google.com/u/0/pomelli/onboarding" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 hover:border-allpro-rose/50 transition-all flex items-center justify-center gap-3 group text-slate-900 dark:text-white font-bold shadow-sm active:scale-95 duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-allpro-rose flex items-center justify-center animate-pulse text-white">
                          <MonitorPlay size={16} />
                      </div>
                      <span>{t.ia_section.lab_btn}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-center text-xs text-slate-500 dark:text-white/40 mt-3">
                      {t.ia_section.lab_note}
                    </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
        
        {/* SECTION PORTFOLIO (Restored) */}
        <section id="realisations" className="py-24 px-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.portfolio.title}</h2>
              <p className="text-slate-600 dark:text-white/60 mb-8 max-w-2xl mx-auto">{t.portfolio.subtitle}</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(t.portfolio.filters).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActivePortfolioFilter(key)}
                    className={`px-6 py-2 rounded-full font-heading text-sm font-semibold transition-all duration-300 border active:scale-95 ${
                      activePortfolioFilter === key
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-allpro-aubergine border-transparent shadow-lg'
                        : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
              {filteredPortfolio.map((item, index) => (
                <Reveal 
                  key={item.id} 
                  delay={index * 100}
                  className={`relative group rounded-3xl overflow-hidden cursor-pointer shadow-xl ${
                    index === 0 && activePortfolioFilter === 'all' ? 'md:col-span-2' : ''
                  } ${
                    index === 3 && activePortfolioFilter === 'all' ? 'md:col-span-2' : ''
                  }`}
                >
                  <div onClick={() => setSelectedProject(item)} className="h-full w-full relative">
                    {/* Background Image with Zoom Effect */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                    
                    {/* Content Container */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      
                      {/* Top Tags (Fade In on Hover) */}
                      <div className="absolute top-6 right-6 flex flex-wrap gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
                          {item.tags.map((tag, i) => (
                              <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                                  {tag}
                              </span>
                          ))}
                      </div>

                      {/* Main Info */}
                      <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                        <span className="text-allpro-orange font-bold text-xs tracking-wider uppercase mb-2 block">{t.portfolio.filters[item.category as keyof typeof t.portfolio.filters]}</span>
                        <h3 className="text-3xl font-display font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-4 max-w-md">{item.desc}</p>
                        
                        {/* Action Button (Slide Up on Hover) */}
                        <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-300">
                           <button className="flex items-center gap-2 text-white font-bold text-sm hover:text-allpro-rose transition-colors">
                              {t.portfolio.view_project} <ArrowRight size={16} />
                           </button>
                        </div>
                      </div>
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                            <ExternalLink size={20} />
                        </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: MÉTHODE (5 Étapes) */}
        <section id="methode" className="py-24 px-4 bg-white/30 dark:bg-white/5 backdrop-blur-sm border-t border-slate-200 dark:border-white/10">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.method.title}</h2>
              <p className="text-slate-600 dark:text-white/60">{t.method.subtitle} <br/><span className="text-sm opacity-70">{t.method.click_hint}</span></p>
            </Reveal>
            
            <div className="relative">
              {/* Line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-allpro-rose/30 to-transparent z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {methodSteps.map((item, idx) => (
                  <Reveal key={idx} delay={idx * 150} className="flex flex-col items-center text-center group cursor-pointer">
                    <div 
                      onClick={() => setSelectedMethodStep(item)}
                      className="w-24 h-24 rounded-full glass-panel border border-slate-200 dark:border-white/20 flex items-center justify-center mb-6 shadow-lg bg-white/60 dark:bg-white/5 relative group-hover:scale-110 transition-transform duration-300 hover:bg-white/80 dark:hover:bg-white/10 active:scale-90"
                    >
                      <span className="absolute top-0 right-0 w-8 h-8 bg-allpro-rose rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-slate-100 dark:border-black/50">{item.step}</span>
                      <div className="text-slate-700 dark:text-white/80 group-hover:text-allpro-rose transition-colors">
                          {item.icon}
                      </div>
                    </div>
                    <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-white/60 px-2">{item.desc}</p>
                    <span className="mt-2 text-xs font-bold text-allpro-orange opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-y-[-5px] duration-300 inline-block">{t.method.view_procedures}</span>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: POURQUOI NOUS ? (Avantages) */}
        <section id="avantages" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <Reveal>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                      {t.advantages.title} <br/><span className="text-gradient">{t.advantages.title_highlight}</span> ?
                    </h2>
                    <div className="space-y-6">
                      {t.advantages.items.map((adv, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-xl -mx-4 hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 hover:translate-x-2 cursor-default border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 shrink-0 flex items-center justify-center text-allpro-orange shadow-sm border border-slate-300 dark:border-white/20">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-slate-900 dark:text-white text-lg">{adv.title}</h4>
                                <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">{adv.desc}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                </Reveal>
                <Reveal delay={200} className="relative h-[500px] hidden md:block">
                    {/* Abstract Composition */}
                    <div className="absolute top-10 right-10 w-64 h-80 glass-panel rounded-2xl rotate-6 z-10 animate-float border-slate-200 dark:border-white/10"></div>
                    <div className="absolute top-20 right-24 w-64 h-80 bg-gradient-allpro rounded-2xl -rotate-3 opacity-20 blur-xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-20 w-56 h-56 glass-card rounded-full flex items-center justify-center z-20 animate-float-delayed border-slate-200 dark:border-white/20">
                      <div className="text-center">
                          <span className="block text-4xl font-bold text-slate-800 dark:text-white">100%</span>
                          <span className="text-xs uppercase tracking-widest text-allpro-rose font-bold">{t.advantages.badge}</span>
                      </div>
                    </div>
                </Reveal>
              </div>
          </div>
        </section>

        {/* SECTION 8: CONTACT */}
        <section id="contact" className="py-24 px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <GlassCard className="!p-8 md:!p-16 border-allpro-rose/20 shadow-2xl bg-white/70 dark:bg-black/30 min-h-[600px] flex flex-col justify-center">
                {contactStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
                    <div className="w-24 h-24 rounded-full bg-gradient-allpro flex items-center justify-center mb-8 shadow-2xl shadow-allpro-rose/50 animate-bounce">
                      <Check className="text-white w-12 h-12" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-allpro mb-6 animate-pulse-slow">
                      {t.contact.success.title}
                    </h2>
                    <p className="text-xl md:text-2xl font-heading font-semibold text-slate-800 dark:text-white mb-4 animate-slide-up delay-200">
                      {t.contact.success.subtitle}
                    </p>
                    <p className="text-slate-600 dark:text-white/70 max-w-lg mb-10 animate-slide-up delay-300">
                      {t.contact.success.desc}
                    </p>
                    <button 
                      onClick={resetContactForm}
                      className="px-8 py-3 rounded-full border border-slate-300 dark:border-white/20 hover:bg-white/10 transition-colors text-slate-600 dark:text-white/80 font-medium active:scale-95 duration-200"
                    >
                      {t.contact.success.btn}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">{t.contact.title}</h2>
                      <p className="text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
                        {t.contact.subtitle}
                      </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleContactSubmit}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.name}</label>
                          <input required type="text" placeholder={lang === 'fr' ? "Votre nom" : "Your name"} className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30 hover:border-allpro-rose/50 duration-300 focus:scale-[1.01] focus:shadow-lg" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.email}</label>
                          <input required type="email" placeholder="contact@entreprise.com" className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30 hover:border-allpro-rose/50 duration-300 focus:scale-[1.01] focus:shadow-lg" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.subject}</label>
                        <select className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium cursor-pointer [&>option]:text-black hover:border-allpro-rose/50 duration-300">
                          {t.contact.form.subjects.map((sub, i) => (
                             <option key={i}>{sub}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">{t.contact.form.message}</label>
                        <textarea required rows={5} placeholder={lang === 'fr' ? "Décrivez brièvement vos besoins..." : "Briefly describe your needs..."} className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30 resize-none hover:border-allpro-rose/50 duration-300 focus:scale-[1.01] focus:shadow-lg"></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={contactStatus === 'sending'}
                        className="w-full py-5 rounded-xl bg-gradient-allpro text-white font-bold text-lg shadow-xl neon-btn relative overflow-hidden group mt-4 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 duration-200"
                      >
                        {contactStatus === 'sending' ? (
                          <span className="flex items-center justify-center gap-2">
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             {t.contact.form.sending}
                          </span>
                        ) : (
                          <>
                            <span className="relative z-10 flex items-center justify-center gap-2">{t.contact.form.btn} <ArrowRight size={20} /></span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

                <div className="mt-auto flex flex-col md:flex-row justify-center items-center gap-8 text-slate-600 dark:text-white/70 text-sm font-medium border-t border-slate-200 dark:border-white/10 pt-8 flex-wrap">
                  <span className="flex items-center gap-2 hover:text-allpro-rose transition-colors duration-300 cursor-default"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div> {t.contact.info.response}</span>
                  <span className="flex items-center gap-2 hover:text-allpro-rose transition-colors duration-300 cursor-default"><Mail size={16} /> allproject.mg@gmail.com</span>
                  <span className="flex items-center gap-2 hover:text-allpro-rose transition-colors duration-300 cursor-default"><Smartphone size={16} /> +261 38 80 048 02</span>
                  <span className="flex items-center gap-2 hover:text-allpro-rose transition-colors duration-300 cursor-default"><MapPin size={16} /> {t.contact.info.location}</span>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="glass-panel border-t border-slate-200 dark:border-white/10 mt-auto bg-slate-200/50 dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <Logo variant="footer" slogan={t.footer.slogan} />
                </div>
                <p className="text-slate-600 dark:text-white/60 max-w-sm mb-6 font-medium">
                  {t.footer.desc}
                </p>
                <div className="flex gap-4">
                  {[
                    { Icon: Linkedin, link: "#" },
                    { Icon: Instagram, link: "#" },
                    { Icon: Facebook, link: "https://www.facebook.com/profile.php?id=100087412664101" },
                    { Icon: Youtube, link: "#" }
                  ].map((item, i) => (
                    <a key={i} href={item.link} target={item.link !== '#' ? "_blank" : undefined} rel="noopener noreferrer" className="p-2 bg-slate-200 dark:bg-white/10 rounded-full hover:bg-allpro-rose hover:text-white transition-all text-slate-600 dark:text-white shadow-sm border border-slate-300 dark:border-white/10 active:scale-90 hover:-translate-y-1 duration-300">
                      <item.Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-6">{t.footer.nav}</h4>
                <ul className="space-y-3 text-slate-600 dark:text-white/70 text-sm font-medium">
                  {navItems.filter(i => i.id !== 'contact').map((item) => (
                      <li key={item.id}><button onClick={() => scrollToSection(item.id)} className="hover:text-allpro-rose transition-colors hover:translate-x-1 inline-block duration-300 text-left">{item.label}</button></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-6">{t.footer.legal}</h4>
                <ul className="space-y-3 text-slate-600 dark:text-white/70 text-sm font-medium cursor-pointer">
                  <li><button onClick={() => setActiveLegalSection('mentions')} className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[0]}</button></li>
                  <li><button onClick={() => setActiveLegalSection('confidentialite')} className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[1]}</button></li>
                  <li><button onClick={() => setActiveLegalSection('cgv')} className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[2]}</button></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-300 dark:border-white/10 pt-8 text-center text-xs text-slate-500 dark:text-white/40 font-semibold uppercase tracking-widest">
              {t.footer.copyright}
            </div>
          </div>
        </footer>

        {/* AI Chat Widget */}
        <ChatWidget lang={lang} />

      </div> {/* End Content Wrapper */}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-black/60 dark:bg-black/60 backdrop-blur-md transition-opacity" 
                onClick={() => setSelectedService(null)}
             ></div>
             
             <div className="relative glass-panel bg-white/95 dark:bg-[#12121a]/90 rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-white/20 animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <button 
                        onClick={() => setSelectedService(null)} 
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10 active:scale-90 hover:rotate-90 duration-300"
                    >
                        <X size={24} className="text-slate-900 dark:text-white" />
                    </button>
                    
                    <div className="mb-8 mt-2">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-allpro flex items-center justify-center text-white mb-5 shadow-lg shadow-allpro-rose/20">
                            {selectedService.icon}
                        </div>
                        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">{selectedService.title}</h3>
                    </div>
                    
                    <p className="text-lg text-slate-600 dark:text-white/80 mb-8 leading-relaxed font-medium">
                        {selectedService.longDesc}
                    </p>
                    
                    <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-white/10">
                        <h4 className="font-heading font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-xs">{t.services_section.modal_includes}</h4>
                        <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                            {selectedService.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle className="text-allpro-rose shrink-0 mt-0.5" size={18} />
                                    <span className="text-slate-700 dark:text-white/90 text-sm font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-auto border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-end">
                    <button 
                        onClick={() => { setSelectedService(null); scrollToSection('contact'); }} 
                        className="px-8 py-3 rounded-xl bg-gradient-allpro text-white font-bold shadow-lg hover:shadow-allpro-rose/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 duration-200"
                    >
                        {t.services_section.modal_cta} <ArrowRight size={18} />
                    </button>
                </div>
             </div>
        </div>
      )}
      
      {/* METHOD Detail Modal */}
      {selectedMethodStep && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-black/60 dark:bg-black/60 backdrop-blur-md transition-opacity" 
                onClick={() => setSelectedMethodStep(null)}
             ></div>
             
             <div className="relative glass-panel bg-white/95 dark:bg-[#12121a]/95 rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-white/20 animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
                <button 
                    onClick={() => setSelectedMethodStep(null)} 
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10 active:scale-90 hover:rotate-90 duration-300"
                >
                    <X size={24} className="text-slate-900 dark:text-white" />
                </button>
                
                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <div className="flex items-center gap-4 mb-8">
                       <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-allpro opacity-80">{selectedMethodStep.step}</span>
                       <div className="h-10 w-[1px] bg-slate-300 dark:bg-white/20"></div>
                       <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">{selectedMethodStep.title}</h3>
                    </div>
                    
                    <p className="text-lg text-slate-600 dark:text-white/80 mb-8 leading-relaxed border-l-4 border-allpro-rose/50 pl-4 italic">
                        {selectedMethodStep.details.intro}
                    </p>
                    
                    <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <ClipboardList className="text-allpro-orange" size={24} />
                            <h4 className="font-heading font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">{t.method.procedures_title}</h4>
                        </div>
                        
                        <div className="space-y-4">
                            {selectedMethodStep.details.procedures.map((proc: string, idx: number) => (
                                <div key={idx} className="flex gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-allpro-orange/30 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-allpro-orange/20 flex items-center justify-center text-allpro-orange font-bold text-xs shrink-0 mt-0.5">
                                      {idx + 1}
                                    </div>
                                    <span className="text-slate-700 dark:text-white/90 text-sm font-medium leading-relaxed">{proc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-slate-200/50 dark:from-allpro-aubergine/40 to-transparent rounded-xl border border-allpro-rose/20">
                         <div className="p-3 bg-allpro-rose/20 rounded-full text-allpro-rose">
                            <Flag size={24} />
                         </div>
                         <div>
                            <span className="block text-xs uppercase tracking-widest text-allpro-rose font-bold mb-1">{t.method.deliverable}</span>
                            <span className="text-slate-900 dark:text-white font-bold text-lg">{selectedMethodStep.details.outcome}</span>
                         </div>
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex justify-center">
                    <button 
                        onClick={() => setSelectedMethodStep(null)} 
                        className="text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-widest active:scale-95 duration-200"
                    >
                        {t.method.close}
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* PORTFOLIO PROJECT Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
                onClick={() => setSelectedProject(null)}
             ></div>
             
             <div className="relative glass-panel bg-white/95 dark:bg-[#0B0B15]/95 rounded-[2rem] w-full max-w-5xl shadow-2xl border border-slate-200 dark:border-white/20 animate-fade-in-up overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <button 
                    onClick={() => setSelectedProject(null)} 
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20 active:scale-90"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                    <img 
                        src={selectedProject.image} 
                        alt={selectedProject.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                         <div>
                            <span className="text-allpro-orange font-bold text-xs tracking-wider uppercase mb-2 block">{t.portfolio.filters[selectedProject.category as keyof typeof t.portfolio.filters]}</span>
                            <h2 className="text-4xl font-display font-bold text-white mb-2">{selectedProject.title}</h2>
                            <p className="text-white/80 font-medium">{selectedProject.desc}</p>
                         </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1">{t.portfolio_modal.client}</h4>
                            <p className="text-slate-800 dark:text-white font-semibold">{selectedProject.client}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-1">{t.portfolio_modal.year}</h4>
                            <p className="text-slate-800 dark:text-white font-semibold">{selectedProject.year}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mb-3">{t.portfolio_modal.technologies}</h4>
                        <div className="flex flex-wrap gap-2">
                             {selectedProject.tags.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80 text-sm font-medium border border-slate-200 dark:border-white/5">
                                    {tag}
                                </span>
                             ))}
                        </div>
                    </div>

                    {/* Challenge & Solution */}
                    <div className="space-y-6">
                        <div className="p-5 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                            <h4 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-2">
                                <Target size={18} /> {t.portfolio_modal.challenge}
                            </h4>
                            <p className="text-slate-700 dark:text-white/80 text-sm leading-relaxed">
                                {selectedProject.challenge}
                            </p>
                        </div>

                        <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                            <h4 className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                                <Lightbulb size={18} /> {t.portfolio_modal.solution}
                            </h4>
                            <p className="text-slate-700 dark:text-white/80 text-sm leading-relaxed">
                                {selectedProject.solution}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.portfolio_modal.result}</h4>
                            <p className="text-slate-600 dark:text-white/70 italic border-l-4 border-allpro-rose pl-4 py-1">
                                "{selectedProject.result}"
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-end">
                        <button 
                            onClick={() => setSelectedProject(null)}
                            className="text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white font-bold text-sm uppercase tracking-wider transition-colors"
                        >
                            {t.portfolio_modal.close}
                        </button>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* AUDIT MODAL (New) */}
      {showAuditModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="glass-panel w-full max-w-4xl min-h-[500px] max-h-[90vh] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl shadow-allpro-rose/20 border border-allpro-rose/30">
            <button onClick={() => setShowAuditModal(false)} className="absolute top-4 right-4 z-20 p-2 hover:bg-white/10 rounded-full active:scale-90 hover:rotate-90 duration-300">
              <X className="text-white" />
            </button>

            {/* Background Animation inside Modal */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-allpro-rose/10 rounded-full blur-[100px] animate-pulse-slow"></div>
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-allpro-orange/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            {/* STEP 1: INPUT */}
            {auditStep === 'input' && (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-gradient-allpro p-[2px] mb-8">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Scan className="text-white w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">{t.audit_modal.input_title}</h2>
                <p className="text-white/70 max-w-md mb-8">{t.audit_modal.input_desc}</p>
                
                <div className="w-full max-w-md relative mb-8">
                  <input 
                    type="text" 
                    placeholder={t.audit_modal.placeholder}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-allpro-rose transition-colors"
                    value={auditInput}
                    onChange={(e) => setAuditInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartAudit()}
                  />
                  <div className="absolute right-3 top-3">
                    <button 
                      onClick={handleStartAudit}
                      className="bg-allpro-rose p-1.5 rounded-lg hover:bg-allpro-orange transition-colors active:scale-90 duration-200"
                    >
                      <ArrowRight className="text-white" size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-white/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Zap size={12} /> {t.audit_modal.badges[0]}</span>
                  <span className="flex items-center gap-1"><Shield size={12} /> {t.audit_modal.badges[1]}</span>
                </div>
              </div>
            )}

            {/* STEP 2: LOADING */}
            {auditStep === 'loading' && (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
                 <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 rounded-full border-t-4 border-allpro-rose animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-4 border-allpro-orange animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <BrainCircuit className="text-white w-12 h-12 animate-pulse" />
                    </div>
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">{t.audit_modal.loading}</h3>
                 <div className="flex flex-col gap-2 text-white/60 text-sm">
                   {t.audit_modal.loading_steps.map((step, i) => (
                      <span key={i} className={`animate-fade-in delay-${(i*200) + 100}`}>{step}</span>
                   ))}
                 </div>
              </div>
            )}

            {/* STEP 3: RESULT PRESENTATION */}
            {auditStep === 'result' && auditData && (
              <div className="relative z-10 flex-1 flex flex-col h-full bg-slate-900/50">
                 {/* Top Bar */}
                 <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-allpro-rose flex items-center justify-center text-white font-bold text-xs">AI</div>
                       <span className="text-white font-heading font-bold">{auditData.businessName}</span>
                    </div>
                    <button 
                      onClick={downloadAuditPDF}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold flex items-center gap-2 transition-colors border border-white/10 active:scale-95 duration-200"
                    >
                      <Download size={16} /> {t.audit_modal.download}
                    </button>
                 </div>

                 {/* Main Slide Area */}
                 <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Slides Thumbnails */}
                    <div className="w-20 border-r border-white/10 flex flex-col gap-4 p-4 overflow-y-auto hidden md:flex">
                        {auditData.slides.map((slide, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setCurrentSlide(idx)}
                             className={`w-full aspect-square rounded-lg border flex items-center justify-center transition-all active:scale-95 duration-200 ${currentSlide === idx ? 'border-allpro-rose bg-allpro-rose/20 text-white' : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'}`}
                           >
                              <span className="font-bold">{idx + 1}</span>
                           </button>
                        ))}
                    </div>

                    {/* Current Slide Display */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
                        <div className="absolute top-4 right-4 text-white/20 text-9xl font-bold opacity-10 select-none">
                           0{currentSlide + 1}
                        </div>
                        
                        <div key={currentSlide} className="animate-slide-up max-w-3xl mx-auto w-full">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 bg-gradient-allpro rounded-xl text-white shadow-lg shadow-allpro-rose/20">
                                 {/* Dynamic Icon Rendering Logic */}
                                 {auditData.slides[currentSlide].icon === 'Search' && <Search size={28} />}
                                 {auditData.slides[currentSlide].icon === 'Zap' && <Zap size={28} />}
                                 {auditData.slides[currentSlide].icon === 'BarChart3' && <BarChart3 size={28} />}
                                 {auditData.slides[currentSlide].icon === 'Rocket' && <Rocket size={28} />}
                                 {auditData.slides[currentSlide].icon === 'Shield' && <Shield size={28} />}
                              </div>
                              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{auditData.slides[currentSlide].title}</h2>
                           </div>

                           <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                              <ul className="space-y-6">
                                 {auditData.slides[currentSlide].points.map((point, i) => (
                                    <li key={i} className="flex gap-4 text-lg text-white/90 items-start group">
                                       <span className="w-6 h-6 rounded-full bg-allpro-rose/20 text-allpro-rose flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold border border-allpro-rose/30 group-hover:bg-allpro-rose group-hover:text-white transition-colors">{i+1}</span>
                                       {point}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           
                           {/* Navigation Controls */}
                           <div className="flex justify-between mt-8">
                              <button 
                                disabled={currentSlide === 0}
                                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95 duration-200"
                              >
                                 {t.audit_modal.prev}
                              </button>
                              
                              {currentSlide < auditData.slides.length - 1 ? (
                                <button 
                                  onClick={() => setCurrentSlide(prev => prev + 1)}
                                  className="px-6 py-3 rounded-full bg-white text-allpro-dark font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 active:scale-95 duration-200"
                                >
                                  {t.audit_modal.next} <ChevronRight size={18} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => setShowAuditModal(false)}
                                  className="px-6 py-3 rounded-full bg-gradient-allpro text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 active:scale-95 duration-200"
                                >
                                  {t.audit_modal.finish} <CheckCircle size={18} />
                                </button>
                              )}
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Bottom Status Bar */}
                 <div className="h-12 bg-black/40 border-t border-white/5 flex items-center justify-between px-6 text-xs font-mono text-white/40">
                    <span>{t.audit_modal.status}</span>
                    <span>IA_MODEL: GEMINI_2.5_FLASH</span>
                    <span>SCORE_GLOBAL: {auditData.overallScore}/100</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Legal Modal Example (Simplified for brevity, usually distinct modals) */}
      {activeLegalSection && (
         <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveLegalSection(null)}>
            <div className="glass-panel p-8 rounded-2xl max-w-2xl w-full bg-white dark:bg-slate-900 relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setActiveLegalSection(null)} className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full active:scale-90 duration-200"><X size={24} /></button>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t.legal_content[activeLegalSection].title}</h3>
                <p className="text-slate-600 dark:text-white/80">{t.legal_content[activeLegalSection].content}</p>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;