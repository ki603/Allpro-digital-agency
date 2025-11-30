import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Instagram, Linkedin, Facebook, Youtube, Sun, Moon, ExternalLink, Target, Lightbulb, Check } from 'lucide-react';
import ChatWidget from './components/ChatWidget';
import { translations, Language } from './translations';
import { Link } from 'react-router-dom';

// --- Helper Components (Duplicated for standalone capability) ---

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

// --- Logo Component ---
const Logo: React.FC<{ variant?: 'header' | 'footer', slogan?: string }> = ({ variant = 'header', slogan }) => {
  const isFooter = variant === 'footer';
  
  return (
    <div className="group cursor-pointer relative z-50 select-none active:scale-95 transition-transform duration-200">
      <div className="absolute -inset-6 bg-gradient-allpro opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col justify-center">
          <span className={`${isFooter ? 'text-5xl' : 'text-3xl'} font-display font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-allpro animate-gradient-x`}>
            All'Pro
          </span>
          
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

const PortfolioPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const navItems = [
    { label: t.nav.services, id: 'services', path: '/#services' },
    { label: t.nav.expertise, id: 'expertise-ia', path: '/#expertise-ia' },
    { label: t.nav.portfolio, id: 'realisations', path: '/portfolio' },
    { label: t.nav.method, id: 'methode', path: '/#methode' },
    { label: t.nav.contact, id: 'contact', path: '/#contact' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans selection:bg-allpro-rose selection:text-white transition-colors duration-300 bg-slate-50 dark:bg-[#050511]">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300">
          <div className="glass-panel mx-4 mt-4 rounded-2xl px-6 py-3 flex justify-between items-center max-w-7xl md:mx-auto shadow-lg shadow-black/5 dark:shadow-black/20">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <Logo variant="header" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 font-heading text-sm font-semibold text-slate-700 dark:text-white/90">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  to={item.path}
                  className={`hover:text-allpro-rose transition-colors relative group active:scale-95 duration-200 ${item.id === 'realisations' ? 'text-allpro-rose' : ''}`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-allpro-rose transition-all group-hover:w-full ${item.id === 'realisations' ? 'w-full' : ''}`}></span>
                </Link>
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

              <Link 
                to="/#contact"
                className="px-6 py-2 rounded-full bg-gradient-allpro text-white shadow-md neon-btn hover:scale-105 transform transition-transform active:scale-95 duration-200"
              >
                {t.nav.launch}
              </Link>
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
                <Link 
                  key={item.id} 
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left font-heading font-semibold text-slate-800 dark:text-white py-3 border-b border-slate-200 dark:border-white/10 last:border-0 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

      {/* Main Content Padding for fixed header */}
      <div className="pt-32 pb-20 px-4 min-h-screen flex flex-col items-center">
          <div className="max-w-7xl mx-auto w-full">
            <Reveal className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">{t.portfolio.title}</h2>
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
      </div>

        {/* Footer */}
        <footer className="glass-panel border-t border-slate-200 dark:border-white/10 mt-auto bg-slate-200/50 dark:bg-black/20 w-full">
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
                    <li key={item.id}><Link to={item.path} className="hover:text-allpro-rose transition-colors hover:translate-x-1 inline-block duration-300">{item.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-slate-900 dark:text-white mb-6">{t.footer.legal}</h4>
                <ul className="space-y-3 text-slate-600 dark:text-white/70 text-sm font-medium cursor-pointer">
                  <li><span className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[0]}</span></li>
                  <li><span className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[1]}</span></li>
                  <li><span className="hover:text-allpro-rose transition-colors text-left hover:translate-x-1 inline-block duration-300">{t.footer.legal_items[2]}</span></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-300 dark:border-white/10 pt-8 text-center text-xs text-slate-500 dark:text-white/40 font-semibold uppercase tracking-widest">
              {t.footer.copyright}
            </div>
          </div>
        </footer>

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

      {/* AI Chat Widget */}
      <ChatWidget lang={lang} />

    </div>
  );
};

export default PortfolioPage;