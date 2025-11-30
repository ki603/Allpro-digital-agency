import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Rocket, Layers, Code, Megaphone, Cpu, ChevronRight, CheckCircle, ArrowRight, Instagram, Linkedin, Facebook, Youtube, Eye, Layout, Image as ImageIcon, Palette, Smartphone, Sparkles, Zap, Globe, Search, BrainCircuit, BarChart3, Fingerprint, Mail, MapPin, Scale, Shield, FileText, ClipboardList, MonitorPlay, Flag, Sun, Moon, Download, Scan, Play } from 'lucide-react';
import ChatWidget from './components/ChatWidget';
import { generateAudit, AuditResult } from './services/geminiService';
import { jsPDF } from 'jspdf';

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
    className={`glass-card p-6 rounded-2xl relative overflow-hidden group ${className} ${onClick ? 'cursor-pointer neon-box-hover' : ''}`}
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
const Logo: React.FC<{ variant?: 'header' | 'footer' }> = ({ variant = 'header' }) => {
  const isFooter = variant === 'footer';
  
  return (
    <div className="group cursor-pointer relative z-50 select-none">
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
                Des idées, des projets
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedMethodStep, setSelectedMethodStep] = useState<any>(null);
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('Tous');
  const [activeLegalSection, setActiveLegalSection] = useState<'mentions' | 'confidentialite' | 'cgv' | null>(null);
  
  // Audit State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditStep, setAuditStep] = useState<'input' | 'loading' | 'result'>('input');
  const [auditInput, setAuditInput] = useState('');
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    
    // Simulate slight delay for effect + API call
    const result = await generateAudit(auditInput);
    
    if (result) {
      setAuditData(result);
      setAuditStep('result');
      setCurrentSlide(0);
    } else {
      // Fallback or error handling
      setAuditStep('input');
      alert("L'analyse a échoué. Veuillez réessayer.");
    }
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

    doc.text("Généré par All'Pro Agency", 105, 280, { align: 'center' });

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

  // Detailed Method Steps
  const methodSteps = [
    { 
      step: "01", 
      title: "Découverte", 
      desc: "Audit & Vision", 
      icon: <Search size={20} />,
      details: {
        intro: "Tout commence par une immersion totale dans votre univers. Nous ne nous contentons pas d'écouter, nous analysons pour comprendre vos véritables enjeux.",
        procedures: [
            "Atelier de cadrage (Workshop) pour définir les objectifs KPI.",
            "Audit technique et concurrentiel (Benchmarking) de votre marché.",
            "Définition des Personas cibles et des parcours utilisateurs.",
            "Rédaction du Cahier des Charges fonctionnel et technique."
        ],
        outcome: "Une feuille de route stratégique claire et chiffrée."
      }
    },
    { 
      step: "02", 
      title: "Création", 
      desc: "Design & UX", 
      icon: <Palette size={20} />,
      details: {
        intro: "Nous donnons vie à votre vision. Nos designers conçoivent des interfaces qui allient esthétique époustouflante et ergonomie intuitive.",
        procedures: [
            "Création de Moodboards pour valider la direction artistique.",
            "Conception des Wireframes (squelettes) pour valider l'UX.",
            "Design des maquettes UI Haute Fidélité (Mobile & Desktop).",
            "Prototypage interactif pour tester la navigation avant le code."
        ],
        outcome: "Une maquette interactive validée prête à être développée."
      }
    },
    { 
      step: "03", 
      title: "Validation", 
      desc: "Feedback Client", 
      icon: <CheckCircle size={20} />,
      details: {
        intro: "La co-construction est au cœur de notre méthode. Rien n'est développé sans votre accord explicite pour éviter les mauvaises surprises.",
        procedures: [
            "Présentation des maquettes et des choix stratégiques.",
            "Cycles d'itérations rapides basés sur vos retours.",
            "Ajustements fins des contenus visuels et textuels.",
            "Signature du BAT (Bon À Tirer) technique et graphique."
        ],
        outcome: "Un accord formel lançant la phase de production."
      }
    },
    { 
      step: "04", 
      title: "Production", 
      desc: "Dév & Intégration", 
      icon: <Code size={20} />,
      details: {
        intro: "Nos développeurs prennent le relais pour transformer les pixels en code performant, sécurisé et évolutif.",
        procedures: [
            "Développement Front-end (React, Tailwind) et Back-end (Node, CMS).",
            "Intégration des contenus et des assets optimisés.",
            "Mise en place des fonctionnalités IA (Chatbots, Automatisation).",
            "Tests QA (Qualité) : Compatibilité mobile, vitesse, sécurité."
        ],
        outcome: "Un produit digital fonctionnel sur environnement de pré-prod."
      }
    },
    { 
      step: "05", 
      title: "Analyse", 
      desc: "Suivi & KPI", 
      icon: <BarChart3 size={20} />,
      details: {
        intro: "Le lancement n'est que le début. Nous vous accompagnons pour garantir la performance et la croissance de votre solution.",
        procedures: [
            "Mise en ligne sur serveur de production sécurisé.",
            "Configuration des outils de tracking (Google Analytics, Pixel).",
            "Formation de vos équipes à l'administration du site.",
            "Suivi mensuel des performances et maintenance corrective."
        ],
        outcome: "Un projet lancé, monitoré et prêt à évoluer."
      }
    },
  ];

  // Legal Content Data
  const legalContent = {
    mentions: {
      title: "Mentions Légales",
      icon: <Scale size={32} />,
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-white/80">
          <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Éditeur du site</h4>
          <p>Le site internet <strong>All'Pro</strong> est édité par l'Agence All'Pro, située à Antananarivo, Madagascar.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Adresse :</strong> Antananarivo-101, Madagascar</li>
            <li><strong>Email :</strong> allproject.mg@gmail.com</li>
            <li><strong>Téléphone :</strong> +261 38 80 048 02</li>
          </ul>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">2. Hébergement</h4>
          <p>Le site est hébergé sur une infrastructure cloud sécurisée assurant une disponibilité et une sécurité optimales des données.</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">3. Propriété Intellectuelle</h4>
          <p>L'ensemble de ce site relève de la législation internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
        </div>
      )
    },
    confidentialite: {
      title: "Politique de Confidentialité",
      icon: <Shield size={32} />,
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-white/80">
          <p>Chez <strong>All'Pro</strong>, la confidentialité de vos données est une priorité. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.</p>
          
          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">1. Collecte des données</h4>
          <p>Nous collectons les informations que vous nous fournissez via notre formulaire de contact (Nom, Email, Téléphone, Nature du projet) uniquement dans le but de répondre à votre demande commerciale.</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">2. Utilisation des données</h4>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Vous recontacter suite à une demande de devis.</li>
            <li>Établir une relation commerciale (facturation, suivi de projet).</li>
            <li>Améliorer nos services grâce à des statistiques anonymisées.</li>
          </ul>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">3. Partage et Sécurité</h4>
          <p>Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles identifiables à des tiers. Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>
          
          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">4. Vos Droits</h4>
          <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez-nous à : allproject.mg@gmail.com.</p>
        </div>
      )
    },
    cgv: {
      title: "Conditions Générales de Vente",
      icon: <FileText size={32} />,
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-white/80">
          <h4 className="font-bold text-slate-900 dark:text-white text-base">1. Objet</h4>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre l'Agence All'Pro et son Client, dans le cadre de la vente de prestations de services digitaux (création de sites web, marketing, design, IA).</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">2. Devis et Commandes</h4>
          <p>Toute prestation fait l'objet d'un devis détaillé. La commande ne devient définitive qu'après acceptation du devis par le Client et, selon le cas, versement d'un acompte (généralement 30% à 50% selon la nature du projet).</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">3. Tarifs et Paiement</h4>
          <p>Les prix sont indiqués dans le devis. Le paiement s'effectue selon les modalités définies (virement bancaire, mobile money, etc.). En cas de retard de paiement, des pénalités pourront être appliquées.</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">4. Délais de Livraison</h4>
          <p>Les délais de réalisation sont donnés à titre indicatif. All'Pro s'engage à tout mettre en œuvre pour respecter les délais annoncés, sous réserve de la fourniture des éléments nécessaires par le Client.</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">5. Propriété et Transfert</h4>
          <p>Le transfert de propriété des réalisations (code source, créations graphiques) ne s'opère qu'après le paiement intégral du prix par le Client.</p>

          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4">6. Litiges</h4>
          <p>En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents d'Antananarivo seront seuls compétents.</p>
        </div>
      )
    }
  };

  // 6 Domaines d'Expertise
  const services = [
    { 
      id: 1,
      icon: <Layers size={32} />, 
      title: "Contenu Digital", 
      desc: "Production visuelle haute fidélité qui raconte votre histoire.",
      longDesc: "L'image est le premier vecteur d'émotion. Notre studio de création produit des contenus visuels qui captent l'attention instantanément.",
      features: ["Shooting Photo & Produit", "Réalisation Vidéo 4K & Drone", "Motion Design", "Direction Artistique"]
    },
    { 
      id: 2,
      icon: <Megaphone size={32} />, 
      title: "Social Media", 
      desc: "Stratégie d'influence et community management.",
      longDesc: "Transformez vos réseaux sociaux en canaux d'acquisition. Nous définissons votre ligne éditoriale et gérons vos communautés au quotidien.",
      features: ["Stratégie Social Media", "Création Reels & TikTok", "Community Management", "Campagnes Ads (Meta/LinkedIn)"]
    },
    { 
      id: 3,
      icon: <Code size={32} />, 
      title: "Web & Apps", 
      desc: "Sites vitrines, E-commerce et solutions SaaS sur mesure.",
      longDesc: "Votre présence en ligne mérite l'excellence. Nous développons des interfaces web et mobiles alliant design immersif et performance technique.",
      features: ["Sites Vitrines Corporate", "E-commerce (Shopify/Woo)", "Web Apps React/Node", "Maintenance & SEO"]
    },
    { 
      id: 4,
      icon: <Rocket size={32} />, 
      title: "Marketing", 
      desc: "Campagnes d'acquisition et growth hacking.",
      longDesc: "Une approche data-driven pour maximiser votre ROI. Nous déployons des campagnes marketing ciblées pour convertir vos prospects.",
      features: ["Campagnes Emailing & CRM", "Copywriting & Storytelling", "SEO / SEA", "Analyse de données"]
    },
    { 
      id: 5,
      icon: <Fingerprint size={32} />, 
      title: "Identité de Marque", 
      desc: "Branding, Logos et Chartes graphiques.",
      longDesc: "Une marque forte est une marque cohérente. Nous construisons votre identité visuelle pour qu'elle soit mémorable et unique sur votre marché.",
      features: ["Création de Logo", "Chartes Graphiques", "Rebranding", "Supports Print & Packaging"]
    },
    { 
      id: 6,
      icon: <Cpu size={32} />, 
      title: "Intégration IA", 
      desc: "Le cœur de notre innovation. Automatisation et Agents.",
      longDesc: "L'IA n'est pas une option, c'est un levier de puissance. Nous intégrons l'intelligence artificielle pour automatiser vos processus et analyser vos données.",
      features: ["Chatbots Intelligents", "Automatisation (Zapier/Make)", "Génération de contenu IA", "Analyse Prédictive"]
    },
  ];

  const portfolioItems = [
    { id: 1, title: "Lumina Fashion", category: "Web", image: "https://picsum.photos/id/1/800/600", desc: "E-shop Minimaliste" },
    { id: 2, title: "TechNova", category: "Branding", image: "https://picsum.photos/id/2/800/600", desc: "Identité Visuelle Tech" },
    { id: 3, title: "Café Aura", category: "Social", image: "https://picsum.photos/id/3/800/600", desc: "Campagne Instagram" },
    { id: 4, title: "EcoDrive", category: "Web", image: "https://picsum.photos/id/4/800/600", desc: "SaaS Dashboard" },
    { id: 5, title: "Urban Pulse", category: "Vidéo", image: "https://picsum.photos/id/5/800/600", desc: "Spot Publicitaire" },
    { id: 6, title: "Zen Spa", category: "Branding", image: "https://picsum.photos/id/6/800/600", desc: "Rebranding complet" },
  ];

  const filteredPortfolio = activePortfolioFilter === 'Tous' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activePortfolioFilter);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans selection:bg-allpro-rose selection:text-white transition-colors duration-300">
      
      {/* Background Slideshow (Global) - z-0 to sit on top of body but behind z-10 content */}
      <BackgroundSlideshow />

      {/* Main Content Wrapper - z-10 to sit on top of background */}
      <div className="relative z-10">

        {/* Navigation */}
        <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300">
          <div className="glass-panel mx-4 mt-4 rounded-2xl px-6 py-3 flex justify-between items-center max-w-7xl md:mx-auto shadow-lg shadow-black/5 dark:shadow-black/20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="header" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 font-heading text-sm font-semibold text-slate-700 dark:text-white/90">
              {['Services', 'Expertise IA', 'Réalisations', 'Méthode', 'Contact'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-').replace('é', 'e'))}
                  className="hover:text-allpro-rose transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-allpro-rose transition-all group-hover:w-full"></span>
                </button>
              ))}
              
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2 rounded-full bg-gradient-allpro text-white shadow-md neon-btn hover:scale-105 transform transition-transform"
              >
                Lancer mon projet
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white"
              >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button className="text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="absolute top-24 left-4 right-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden animate-fade-in z-50">
              {['Services', 'Expertise IA', 'Réalisations', 'Méthode', 'Contact'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-').replace('é', 'e'))}
                  className="text-left font-heading font-semibold text-slate-800 dark:text-white py-3 border-b border-slate-200 dark:border-white/10 last:border-0"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* SECTION 1: HERO (Intro) */}
        <section className="pt-40 pb-20 px-4 min-h-screen flex items-center justify-center relative overflow-hidden">
          
          {/* NEW HERO PARTICLES BACKGROUND (Adaptive) */}
          <HeroParticles isDarkMode={isDarkMode} />
          
          <div className="max-w-6xl mx-auto text-center z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-allpro-rose/30 shadow-lg animate-slide-up bg-white/50 dark:bg-white/5">
              <Sparkles size={16} className="text-allpro-rose dark:text-allpro-yellow" />
              <span className="text-sm font-bold bg-gradient-allpro bg-clip-text text-transparent uppercase tracking-wider">
                Agence Créative & Technologique
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-[1.1] text-slate-900 dark:text-white">
              <span className="block animate-slide-up delay-100">Des <span className="text-gradient">idées</span>, des <span className="text-gradient">projets</span>.</span>
              <span className="block animate-slide-up delay-200 text-3xl md:text-5xl mt-2 font-bold text-slate-600 dark:text-white/80">Transformer vos ambitions en résultats.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-10 font-sans leading-relaxed animate-slide-up delay-300">
              All'Pro fusionne design d'exception, stratégie digitale et intelligence artificielle pour propulser votre entreprise vers le futur.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-400">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-full bg-gradient-allpro text-white font-heading font-bold neon-btn flex items-center justify-center gap-2 group"
              >
                Démarrer un projet <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowAuditModal(true)}
                className="px-8 py-4 rounded-full glass-panel text-slate-700 dark:text-white font-heading font-bold hover:bg-white/40 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/20 flex items-center gap-2 hover:border-allpro-rose/30"
              >
                <Scan size={20} className="text-allpro-rose" />
                Audit IA Gratuit
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: SERVICES (6 Pôles) */}
        <section id="services" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Nos Pôles d'Expertise</h2>
              <p className="text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto">Une synergie complète entre créativité et technologie pour couvrir l'ensemble de vos besoins digitaux.</p>
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
                      En savoir plus <ChevronRight size={16} />
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: AUDIT PROMO (New) */}
        <section className="py-16 px-4">
           <Reveal>
             <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group cursor-pointer" onClick={() => setShowAuditModal(true)}>
                <div className="absolute inset-0 bg-gradient-to-r from-allpro-dark to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                
                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-allpro-rose/20 border border-allpro-rose/30 mb-4">
                         <span className="w-2 h-2 rounded-full bg-allpro-rose animate-pulse"></span>
                         <span className="text-xs font-bold text-allpro-rose uppercase tracking-wider">Outil Gratuit</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Audit Digital <span className="text-gradient">Instantané</span></h2>
                      <p className="text-white/70 text-lg">Analysez votre présence en ligne en 30 secondes grâce à notre IA. Recevez un rapport détaillé avec un score de performance et des recommandations stratégiques.</p>
                   </div>
                   <button className="shrink-0 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-white/10">
                      <Scan size={20} /> Lancer l'analyse
                   </button>
                </div>
             </div>
           </Reveal>
        </section>

        {/* SECTION: FOCUS IA (Page 2 Requirement) */}
        <section id="expertise-ia" className="py-24 px-4 relative overflow-hidden">
          {/* Slightly lighter glass gradient background for section separation */}
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/5 -z-10 transform -skew-y-3 origin-top-left scale-110 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-allpro rounded-[3rem] opacity-10 blur-2xl animate-pulse-slow"></div>
                  <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-slate-200 dark:border-white/20 relative z-10">
                      <BrainCircuit size={64} className="text-allpro-rose mb-6" />
                      <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">L'Intelligence Artificielle comme moteur</h3>
                      <p className="text-slate-600 dark:text-white/80 mb-6 leading-relaxed">
                        Chez All'Pro, l'IA n'est pas un gadget, c'est notre fondation. Elle nous permet d'analyser votre marché plus vite, de produire du contenu plus pertinent et d'automatiser vos tâches chronophages.
                      </p>
                      <ul className="space-y-4">
                        {[
                          "Automatisation des processus métiers (Gain de temps)",
                          "Agents IA Conversationnels 24/7 (Service Client)",
                          "Analyse de données prédictive (Prise de décision)",
                          "Personnalisation de l'expérience utilisateur"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 font-medium text-slate-700 dark:text-white/90">
                            <div className="w-6 h-6 rounded-full bg-allpro-rose/10 dark:bg-allpro-rose/20 flex items-center justify-center text-allpro-rose">
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
                  Notre Cœur <span className="text-gradient">Technologique</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-white/70 mb-8 leading-relaxed">
                  Nous intégrons les modèles d'IA les plus avancés (comme Gemini, GPT-4, Claude) directement dans vos solutions web et marketing. C'est le différenciateur clé qui garantit à vos projets un ROI maximal et une pérennité technologique.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl text-center">
                      <span className="block text-3xl font-bold text-allpro-rose mb-1">+40%</span>
                      <span className="text-xs text-slate-500 dark:text-white/60 uppercase font-bold tracking-wide">Productivité</span>
                  </div>
                  <div className="glass-card p-4 rounded-xl text-center">
                      <span className="block text-3xl font-bold text-allpro-orange mb-1">24/7</span>
                      <span className="text-xs text-slate-500 dark:text-white/60 uppercase font-bold tracking-wide">Disponibilité IA</span>
                  </div>
                </div>

                {/* NEW BUTTON FOR GOOGLE LABS POMELLI */}
                <div className="mt-8">
                    <a 
                      href="https://labs.google.com/u/0/pomelli/onboarding" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20 hover:border-allpro-rose/50 transition-all flex items-center justify-center gap-3 group text-slate-900 dark:text-white font-bold shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-allpro-rose flex items-center justify-center animate-pulse text-white">
                          <MonitorPlay size={16} />
                      </div>
                      <span>Accéder au Lab : Scan & Prototypes</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-center text-xs text-slate-500 dark:text-white/40 mt-3">
                      Outil exclusif pour nos clients : Analyse & Génération instantanée
                    </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION 3: RÉALISATIONS (Portfolio) */}
        <section id="realisations" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <Reveal className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Nos Réalisations</h2>
              <p className="text-slate-600 dark:text-white/60 mb-8">Découvrez comment nous transformons les ambitions en succès tangibles.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['Tous', 'Web', 'Branding', 'Social', 'Vidéo'].map((category, idx) => (
                  <button
                    key={category}
                    onClick={() => setActivePortfolioFilter(category)}
                    className={`px-6 py-2 rounded-full font-heading text-sm font-semibold transition-all duration-300 border ${
                      activePortfolioFilter === category
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-allpro-aubergine border-transparent shadow-lg'
                        : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/20 hover:bg-white/80 dark:hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPortfolio.map((item, index) => (
                <Reveal key={item.id} delay={index * 100}>
                  <div className="group relative rounded-2xl overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/30 h-64 md:h-80 cursor-pointer border border-slate-200 dark:border-white/10">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-allpro-orange font-bold text-xs tracking-wider uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{item.category}</span>
                      <h3 className="text-2xl font-display font-bold text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">{item.title}</h3>
                      <p className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">{item.desc}</p>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Notre Méthode</h2>
              <p className="text-slate-600 dark:text-white/60">Un processus rigoureux en 5 étapes pour garantir l'excellence. <br/><span className="text-sm opacity-70">(Cliquez sur les étapes pour voir les procédures)</span></p>
            </Reveal>
            
            <div className="relative">
              {/* Line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-allpro-rose/30 to-transparent z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {methodSteps.map((item, idx) => (
                  <Reveal key={idx} delay={idx * 150} className="flex flex-col items-center text-center group cursor-pointer">
                    <div 
                      onClick={() => setSelectedMethodStep(item)}
                      className="w-24 h-24 rounded-full glass-panel border border-slate-200 dark:border-white/20 flex items-center justify-center mb-6 shadow-lg bg-white/60 dark:bg-white/5 relative group-hover:scale-110 transition-transform duration-300 hover:bg-white/80 dark:hover:bg-white/10"
                    >
                      <span className="absolute top-0 right-0 w-8 h-8 bg-allpro-rose rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-slate-100 dark:border-black/50">{item.step}</span>
                      <div className="text-slate-700 dark:text-white/80 group-hover:text-allpro-rose transition-colors">
                          {item.icon}
                      </div>
                    </div>
                    <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-white/60 px-2">{item.desc}</p>
                    <span className="mt-2 text-xs font-bold text-allpro-orange opacity-0 group-hover:opacity-100 transition-opacity">Voir procédures</span>
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
                      Pourquoi choisir <br/><span className="text-gradient">All'Pro</span> ?
                    </h2>
                    <div className="space-y-6">
                      {[
                          { title: "Expertise Polyvalente 360°", desc: "Un seul interlocuteur pour gérer votre image, votre tech et votre marketing. Cohérence garantie." },
                          { title: "Haute Expertise Technologique", desc: "Nous maîtrisons les stacks modernes et les IA de pointe pour des produits durables." },
                          { title: "Accompagnement Humain", desc: "Malgré la tech, l'humain reste au centre. Nous sommes disponibles, réactifs et à l'écoute." }
                      ].map((adv, i) => (
                          <div key={i} className="flex gap-4">
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
                          <span className="text-xs uppercase tracking-widest text-allpro-rose font-bold">Sur Mesure</span>
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
              <GlassCard className="!p-8 md:!p-16 border-allpro-rose/20 shadow-2xl bg-white/70 dark:bg-black/30">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">Prêt à lancer votre projet ?</h2>
                  <p className="text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
                    Contactez All’Pro dès aujourd’hui et transformez vos idées en résultats.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">Nom complet</label>
                      <input type="text" placeholder="Votre nom" className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">Email professionnel</label>
                      <input type="email" placeholder="contact@entreprise.com" className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">Sujet</label>
                    <select className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium cursor-pointer [&>option]:text-black">
                      <option>Création Site Web / App</option>
                      <option>Intégration Intelligence Artificielle</option>
                      <option>Stratégie Social Media</option>
                      <option>Branding & Identité</option>
                      <option>Autre demande</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-white/60 ml-1 uppercase tracking-wider">Message</label>
                    <textarea rows={5} placeholder="Décrivez brièvement vos besoins..." className="w-full px-6 py-4 rounded-xl bg-white/40 dark:bg-white/10 border border-slate-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-allpro-rose/50 focus:bg-white/60 dark:focus:bg-white/20 transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-white/30 resize-none"></textarea>
                  </div>

                  <button className="w-full py-5 rounded-xl bg-gradient-allpro text-white font-bold text-lg shadow-xl neon-btn relative overflow-hidden group mt-4">
                    <span className="relative z-10 flex items-center justify-center gap-2">Envoyer ma demande <ArrowRight size={20} /></span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </form>

                <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8 text-slate-600 dark:text-white/70 text-sm font-medium border-t border-slate-200 dark:border-white/10 pt-8 flex-wrap">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div> Réponse sous 24h</span>
                  <span className="flex items-center gap-2"><Mail size={16} /> allproject.mg@gmail.com</span>
                  <span className="flex items-center gap-2"><Smartphone size={16} /> +261 38 80 048 02</span>
                  <span className="flex items-center gap-2"><MapPin size={16} /> Antananarivo-101, Madagascar</span>
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
                  <Logo variant="footer" />
                </div>
                <p className="text-slate-600 dark:text-white/60 max-w-sm mb-6 font-medium">
                  Agence Digitale & IA. <br/>
                  Transformer vos idées en projets, et vos projets en résultats.
                </p>
                <div className="flex gap-4">
                  {[
                    { Icon: Linkedin, link: "#" },
                    { Icon: Instagram, link: "#" },
                    { Icon: Facebook, link: "https://www.facebook.com/profile.php?id=100087412664101" },
                    { Icon: Youtube, link: "#" }
                  ].map((item, i) => (
                    <a key={i} href={item.link} target={item.link !== '#' ? "_blank" : undefined} rel="noopener noreferrer" className="p-2 bg-slate-200 dark:bg-white/10 rounded-full hover:bg-allpro-rose hover:text-white transition-all text-slate-600 dark:text-white shadow-sm border border-slate-300 dark:border-white/10">
                      <item.Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-6">Navigation</h4>
                <ul className="space-y-3 text-slate-600 dark:text-white/70 text-sm font-medium">
                  <li><a href="#services" className="hover:text-allpro-rose transition-colors">Services</a></li>
                  <li><a href="#expertise-ia" className="hover:text-allpro-rose transition-colors">Expertise IA</a></li>
                  <li><a href="#realisations" className="hover:text-allpro-rose transition-colors">Portfolio</a></li>
                  <li><a href="#methode" className="hover:text-allpro-rose transition-colors">Méthode</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-6">Légal</h4>
                <ul className="space-y-3 text-slate-600 dark:text-white/70 text-sm font-medium cursor-pointer">
                  <li><button onClick={() => setActiveLegalSection('mentions')} className="hover:text-allpro-rose transition-colors text-left">Mentions légales</button></li>
                  <li><button onClick={() => setActiveLegalSection('confidentialite')} className="hover:text-allpro-rose transition-colors text-left">Politique de confidentialité</button></li>
                  <li><button onClick={() => setActiveLegalSection('cgv')} className="hover:text-allpro-rose transition-colors text-left">CGV</button></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-300 dark:border-white/10 pt-8 text-center text-xs text-slate-500 dark:text-white/40 font-semibold uppercase tracking-widest">
              © {new Date().getFullYear()} Agence All'Pro. Tous droits réservés.
            </div>
          </div>
        </footer>

        {/* AI Chat Widget */}
        <ChatWidget />

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
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
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
                        <h4 className="font-heading font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-xs">Prestations incluses</h4>
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
                        className="px-8 py-3 rounded-xl bg-gradient-allpro text-white font-bold shadow-lg hover:shadow-allpro-rose/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Demander un devis <ArrowRight size={18} />
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
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
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
                            <h4 className="font-heading font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Procédures & Actions</h4>
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
                            <span className="block text-xs uppercase tracking-widest text-allpro-rose font-bold mb-1">Livrable de l'étape</span>
                            <span className="text-slate-900 dark:text-white font-bold text-lg">{selectedMethodStep.details.outcome}</span>
                         </div>
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 flex justify-center">
                    <button 
                        onClick={() => setSelectedMethodStep(null)} 
                        className="text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Fermer
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* AUDIT MODAL (New) */}
      {showAuditModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="glass-panel w-full max-w-4xl min-h-[500px] max-h-[90vh] rounded-3xl relative overflow-hidden flex flex-col shadow-2xl shadow-allpro-rose/20 border border-allpro-rose/30">
            <button onClick={() => setShowAuditModal(false)} className="absolute top-4 right-4 z-20 p-2 hover:bg-white/10 rounded-full">
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
                <h2 className="text-4xl font-display font-bold text-white mb-4">Scanner votre Projet</h2>
                <p className="text-white/70 max-w-md mb-8">Entrez l'URL de votre site ou décrivez brièvement votre activité. Notre IA générera un audit complet instantanément.</p>
                
                <div className="w-full max-w-md relative mb-8">
                  <input 
                    type="text" 
                    placeholder="ex: www.monsite.com ou 'Boutique de vêtements éco-responsables'"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-allpro-rose transition-colors"
                    value={auditInput}
                    onChange={(e) => setAuditInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartAudit()}
                  />
                  <div className="absolute right-3 top-3">
                    <button 
                      onClick={handleStartAudit}
                      className="bg-allpro-rose p-1.5 rounded-lg hover:bg-allpro-orange transition-colors"
                    >
                      <ArrowRight className="text-white" size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-white/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Zap size={12} /> Analyse Rapide</span>
                  <span className="flex items-center gap-1"><Shield size={12} /> Confidentiel</span>
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
                 <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Analyse IA en cours...</h3>
                 <div className="flex flex-col gap-2 text-white/60 text-sm">
                   <span className="animate-fade-in delay-100">Scan des paramètres SEO...</span>
                   <span className="animate-fade-in delay-300">Évaluation de l'UX...</span>
                   <span className="animate-fade-in delay-500">Génération des stratégies...</span>
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
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold flex items-center gap-2 transition-colors border border-white/10"
                    >
                      <Download size={16} /> Télécharger PDF
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
                             className={`w-full aspect-square rounded-lg border flex items-center justify-center transition-all ${currentSlide === idx ? 'border-allpro-rose bg-allpro-rose/20 text-white' : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'}`}
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
                                className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                 Précédent
                              </button>
                              
                              {currentSlide < auditData.slides.length - 1 ? (
                                <button 
                                  onClick={() => setCurrentSlide(prev => prev + 1)}
                                  className="px-6 py-3 rounded-full bg-white text-allpro-dark font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                                >
                                  Suivant <ChevronRight size={18} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => setShowAuditModal(false)}
                                  className="px-6 py-3 rounded-full bg-gradient-allpro text-white font-bold hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                  Terminer <CheckCircle size={18} />
                                </button>
                              )}
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Bottom Status Bar */}
                 <div className="h-12 bg-black/40 border-t border-white/5 flex items-center justify-between px-6 text-xs font-mono text-white/40">
                    <span>STATUS: ANALYSE_COMPLETE</span>
                    <span>IA_MODEL: GEMINI_2.5_FLASH</span>
                    <span>SCORE_GLOBAL: {auditData.overallScore}/100</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;