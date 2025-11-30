export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      services: "Services",
      expertise: "Expertise IA",
      portfolio: "Réalisations",
      method: "Méthode",
      contact: "Contact",
      launch: "Lancer mon projet"
    },
    hero: {
      badge: "Agence Créative & Technologique",
      title_part1: "Des",
      title_part2: "idées",
      title_part3: "des",
      title_part4: "projets",
      subtitle: "Transformer vos ambitions en résultats.",
      desc: "All'Pro fusionne design d'exception, stratégie digitale et intelligence artificielle pour propulser votre entreprise vers le futur.",
      btn_start: "Démarrer un projet",
      btn_audit: "Audit IA Gratuit"
    },
    services_section: {
      title: "Nos Pôles d'Expertise",
      subtitle: "Une synergie complète entre créativité et technologie pour couvrir l'ensemble de vos besoins digitaux.",
      items: [
        { title: "Contenu Digital", desc: "Production visuelle haute fidélité qui raconte votre histoire.", longDesc: "L'image est le premier vecteur d'émotion. Notre studio de création produit des contenus visuels qui captent l'attention instantanément.", features: ["Shooting Photo & Produit", "Réalisation Vidéo 4K & Drone", "Motion Design", "Direction Artistique"] },
        { title: "Social Media", desc: "Stratégie d'influence et community management.", longDesc: "Transformez vos réseaux sociaux en canaux d'acquisition. Nous définissons votre ligne éditoriale et gérons vos communautés au quotidien.", features: ["Stratégie Social Media", "Création Reels & TikTok", "Community Management", "Campagnes Ads (Meta/LinkedIn)"] },
        { title: "Web & Apps", desc: "Sites vitrines, E-commerce et solutions SaaS sur mesure.", longDesc: "Votre présence en ligne mérite l'excellence. Nous développons des interfaces web et mobiles alliant design immersif et performance technique.", features: ["Sites Vitrines Corporate", "E-commerce (Shopify/Woo)", "Web Apps React/Node", "Maintenance & SEO"] },
        { title: "Marketing", desc: "Campagnes d'acquisition et growth hacking.", longDesc: "Une approche data-driven pour maximiser votre ROI. Nous déployons des campagnes marketing ciblées pour convertir vos prospects.", features: ["Campagnes Emailing & CRM", "Copywriting & Storytelling", "SEO / SEA", "Analyse de données"] },
        { title: "Identité de Marque", desc: "Branding, Logos et Chartes graphiques.", longDesc: "Une marque forte est une marque cohérente. Nous construisons votre identité visuelle pour qu'elle soit mémorable et unique sur votre marché.", features: ["Création de Logo", "Chartes Graphiques", "Rebranding", "Supports Print & Packaging"] },
        { title: "Intégration IA", desc: "Le cœur de notre innovation. Automatisation et Agents.", longDesc: "L'IA n'est pas une option, c'est un levier de puissance. Nous intégrons l'intelligence artificielle pour automatiser vos processus et analyser vos données.", features: ["Chatbots Intelligents", "Automatisation (Zapier/Make)", "Génération de contenu IA", "Analyse Prédictive"] }
      ],
      learn_more: "En savoir plus",
      modal_includes: "Prestations incluses",
      modal_cta: "Demander un devis"
    },
    audit_promo: {
        badge: "Outil Gratuit",
        title: "Audit Digital",
        title_gradient: "Instantané",
        desc: "Analysez votre présence en ligne en 30 secondes grâce à notre IA. Recevez un rapport détaillé avec un score de performance et des recommandations stratégiques.",
        cta: "Lancer l'analyse"
    },
    ia_section: {
        badge_title: "L'Intelligence Artificielle comme moteur",
        intro_title: "L'Intelligence Artificielle comme moteur",
        intro_desc: "Chez All'Pro, l'IA n'est pas un gadget, c'est notre fondation. Elle nous permet d'analyser votre marché plus vite, de produire du contenu plus pertinent et d'automatiser vos tâches chronophages.",
        list: [
            "Automatisation des processus métiers (Gain de temps)",
            "Agents IA Conversationnels 24/7 (Service Client)",
            "Analyse de données prédictive (Prise de décision)",
            "Personnalisation de l'expérience utilisateur"
        ],
        main_title: "Notre Cœur",
        main_title_gradient: "Technologique",
        main_desc: "Nous intégrons les modèles d'IA les plus avancés (comme Gemini, GPT-4, Claude) directement dans vos solutions web et marketing. C'est le différenciateur clé qui garantit à vos projets un ROI maximal et une pérennité technologique.",
        stats: { prod: "Productivité", avail: "Disponibilité IA" },
        lab_btn: "Accéder au Lab : Scan & Prototypes",
        lab_note: "Outil exclusif pour nos clients : Analyse & Génération instantanée"
    },
    portfolio: {
        title: "Nos Réalisations",
        subtitle: "Découvrez comment nous transformons les ambitions en succès tangibles.",
        filters: { all: "Tous", web: "Web", branding: "Branding", social: "Social", video: "Vidéo" },
        view_project: "Voir le projet"
    },
    portfolio_modal: {
        client: "Client",
        year: "Année",
        challenge: "Le Défi",
        solution: "La Solution",
        result: "Résultat",
        technologies: "Technologies & Expertises",
        close: "Fermer"
    },
    method: {
        title: "Notre Méthode",
        subtitle: "Un processus rigoureux en 5 étapes pour garantir l'excellence.",
        click_hint: "(Cliquez sur les étapes pour voir les procédures)",
        steps: [
            { title: "Découverte", desc: "Audit & Vision", details: { intro: "Tout commence par une immersion totale dans votre univers.", outcome: "Une feuille de route stratégique claire et chiffrée.", procedures: ["Atelier de cadrage", "Audit technique", "Définition Personas", "Cahier des Charges"] } },
            { title: "Création", desc: "Design & UX", details: { intro: "Nous donnons vie à votre vision.", outcome: "Une maquette interactive validée.", procedures: ["Moodboards", "Wireframes", "Design UI", "Prototypage"] } },
            { title: "Validation", desc: "Feedback Client", details: { intro: "La co-construction est au cœur de notre méthode.", outcome: "Un accord formel.", procedures: ["Présentation", "Itérations", "Ajustements", "Signature BAT"] } },
            { title: "Production", desc: "Dév & Intégration", details: { intro: "Nos développeurs prennent le relais.", outcome: "Un produit digital fonctionnel.", procedures: ["Dev Front/Back", "Intégration", "Fonctionnalités IA", "Tests QA"] } },
            { title: "Analyse", desc: "Suivi & KPI", details: { intro: "Le lancement n'est que le début.", outcome: "Un projet lancé et monitoré.", procedures: ["Mise en ligne", "Tracking", "Formation", "Suivi mensuel"] } }
        ],
        view_procedures: "Voir procédures",
        procedures_title: "Procédures & Actions",
        deliverable: "Livrable de l'étape",
        close: "Fermer"
    },
    advantages: {
        title: "Pourquoi choisir",
        title_highlight: "All'Pro",
        items: [
            { title: "Expertise Polyvalente 360°", desc: "Un seul interlocuteur pour gérer votre image, votre tech et votre marketing. Cohérence garantie." },
            { title: "Haute Expertise Technologique", desc: "Nous maîtrisons les stacks modernes et les IA de pointe pour des produits durables." },
            { title: "Accompagnement Humain", desc: "Malgré la tech, l'humain reste au centre. Nous sommes disponibles, réactifs et à l'écoute." }
        ],
        badge: "Sur Mesure"
    },
    contact: {
        title: "Prêt à lancer votre projet ?",
        subtitle: "Contactez All’Pro dès aujourd’hui et transformez vos idées en résultats.",
        form: {
            name: "Nom complet",
            email: "Email professionnel",
            subject: "Sujet",
            message: "Message",
            subjects: ["Création Site Web / App", "Intégration Intelligence Artificielle", "Stratégie Social Media", "Branding & Identité", "Autre demande"],
            btn: "Envoyer ma demande",
            sending: "Envoi en cours..."
        },
        success: {
            title: "Message Envoyé !",
            subtitle: "Votre vision est entre de bonnes mains.",
            desc: "Nous avons bien reçu votre demande. Un expert All'Pro analysera votre projet et vous recontactera sous 24h ouvrées.",
            btn: "Envoyer un autre message"
        },
        info: {
            response: "Réponse sous 24h",
            location: "Antananarivo-101, Madagascar"
        }
    },
    footer: {
        desc: "Agence Digitale & IA. Transformer vos idées en projets, et vos projets en résultats.",
        nav: "Navigation",
        legal: "Légal",
        legal_items: ["Mentions légales", "Politique de confidentialité", "CGV"],
        copyright: "© 2024 Agence All'Pro. Tous droits réservés.",
        slogan: "Des idées, des projets"
    },
    audit_modal: {
        input_title: "Scanner votre Projet",
        input_desc: "Entrez l'URL de votre site ou décrivez brièvement votre activité. Notre IA générera un audit complet instantanément.",
        placeholder: "ex: www.monsite.com ou 'Boutique de vêtements'",
        badges: ["Analyse Rapide", "Confidentiel"],
        loading: "Analyse IA en cours...",
        loading_steps: ["Scan des paramètres SEO...", "Évaluation de l'UX...", "Génération des stratégies..."],
        download: "Télécharger PDF",
        status: "STATUS: ANALYSE_COMPLETE",
        prev: "Précédent",
        next: "Suivant",
        finish: "Terminer"
    },
    legal_content: {
        mentions: {
            title: "Mentions Légales",
            content: "Le site All'Pro est édité par l'Agence All'Pro, Antananarivo, Madagascar. Email: allproject.mg@gmail.com. Hébergement sécurisé Cloud."
        },
        confidentialite: {
            title: "Politique de Confidentialité",
            content: "Nous collectons vos données (Nom, Email) uniquement pour répondre à votre demande. Aucune vente à des tiers."
        },
        cgv: {
            title: "CGV",
            content: "Toute prestation fait l'objet d'un devis. Acompte de 30-50% à la commande. Transfert de propriété après paiement complet."
        }
    }
  },
  en: {
    nav: {
      services: "Services",
      expertise: "AI Expertise",
      portfolio: "Portfolio",
      method: "Method",
      contact: "Contact",
      launch: "Start Project"
    },
    hero: {
      badge: "Creative & Tech Agency",
      title_part1: "Your",
      title_part2: "ideas",
      title_part3: "our",
      title_part4: "projects",
      subtitle: "Turning ambitions into results.",
      desc: "All'Pro merges exceptional design, digital strategy, and artificial intelligence to propel your business into the future.",
      btn_start: "Start a project",
      btn_audit: "Free AI Audit"
    },
    services_section: {
      title: "Our Expertise",
      subtitle: "Complete synergy between creativity and technology to cover all your digital needs.",
      items: [
        { title: "Digital Content", desc: "High-fidelity visual production that tells your story.", longDesc: "Image is the first vector of emotion. Our creative studio produces visual content that captures attention instantly.", features: ["Photo & Product Shooting", "4K Video & Drone", "Motion Design", "Art Direction"] },
        { title: "Social Media", desc: "Influence strategy and community management.", longDesc: "Transform your social networks into acquisition channels. We define your editorial line and manage your communities daily.", features: ["Social Media Strategy", "Reels & TikTok Creation", "Community Management", "Ads Campaigns (Meta/LinkedIn)"] },
        { title: "Web & Apps", desc: "Showcase sites, E-commerce, and custom SaaS solutions.", longDesc: "Your online presence deserves excellence. We develop web and mobile interfaces combining immersive design and technical performance.", features: ["Corporate Showcase Sites", "E-commerce (Shopify/Woo)", "React/Node Web Apps", "Maintenance & SEO"] },
        { title: "Marketing", desc: "Acquisition campaigns and growth hacking.", longDesc: "A data-driven approach to maximize your ROI. We deploy targeted marketing campaigns to convert your prospects.", features: ["Emailing & CRM Campaigns", "Copywriting & Storytelling", "SEO / SEA", "Data Analysis"] },
        { title: "Brand Identity", desc: "Branding, Logos, and Graphic Charters.", longDesc: "A strong brand is a consistent brand. We build your visual identity to be memorable and unique in your market.", features: ["Logo Creation", "Graphic Charters", "Rebranding", "Print & Packaging"] },
        { title: "AI Integration", desc: "The core of our innovation. Automation and Agents.", longDesc: "AI is not an option, it's a power lever. We integrate artificial intelligence to automate your processes and analyze your data.", features: ["Smart Chatbots", "Automation (Zapier/Make)", "AI Content Generation", "Predictive Analysis"] }
      ],
      learn_more: "Learn more",
      modal_includes: "Included Services",
      modal_cta: "Request a Quote"
    },
    audit_promo: {
        badge: "Free Tool",
        title: "Instant Digital",
        title_gradient: "Audit",
        desc: "Analyze your online presence in 30 seconds with our AI. Receive a detailed report with a performance score and strategic recommendations.",
        cta: "Start Analysis"
    },
    ia_section: {
        badge_title: "Artificial Intelligence as an Engine",
        intro_title: "Artificial Intelligence as an Engine",
        intro_desc: "At All'Pro, AI is not a gadget, it's our foundation. It allows us to analyze your market faster, produce more relevant content, and automate your time-consuming tasks.",
        list: [
            "Business Process Automation (Time Saving)",
            "24/7 Conversational AI Agents (Customer Service)",
            "Predictive Data Analysis (Decision Making)",
            "User Experience Personalization"
        ],
        main_title: "Our Tech",
        main_title_gradient: "Core",
        main_desc: "We integrate the most advanced AI models (like Gemini, GPT-4, Claude) directly into your web and marketing solutions. This is the key differentiator ensuring maximum ROI and technological longevity.",
        stats: { prod: "Productivity", avail: "AI Availability" },
        lab_btn: "Access Lab: Scan & Prototypes",
        lab_note: "Exclusive tool for our clients: Analysis & Instant Generation"
    },
    portfolio: {
        title: "Our Portfolio",
        subtitle: "Discover how we transform ambitions into tangible success.",
        filters: { all: "All", web: "Web", branding: "Branding", social: "Social", video: "Video" },
        view_project: "View Project"
    },
    portfolio_modal: {
        client: "Client",
        year: "Year",
        challenge: "The Challenge",
        solution: "The Solution",
        result: "Result",
        technologies: "Technologies & Expertise",
        close: "Close"
    },
    method: {
        title: "Our Method",
        subtitle: "A rigorous 5-step process to guarantee excellence.",
        click_hint: "(Click on steps to see procedures)",
        steps: [
            { title: "Discovery", desc: "Audit & Vision", details: { intro: "It all starts with total immersion in your universe.", outcome: "A clear and quantified strategic roadmap.", procedures: ["Scoping Workshop", "Technical Audit", "Persona Definition", "Specifications"] } },
            { title: "Creation", desc: "Design & UX", details: { intro: "We bring your vision to life.", outcome: "A validated interactive mockup.", procedures: ["Moodboards", "Wireframes", "UI Design", "Prototyping"] } },
            { title: "Validation", desc: "Client Feedback", details: { intro: "Co-construction is at the heart of our method.", outcome: "A formal agreement.", procedures: ["Presentation", "Iterations", "Adjustments", "Final Approval"] } },
            { title: "Production", desc: "Dev & Integration", details: { intro: "Our developers take over.", outcome: "A functional digital product.", procedures: ["Front/Back Dev", "Integration", "AI Features", "QA Testing"] } },
            { title: "Analysis", desc: "Tracking & KPI", details: { intro: "Launch is just the beginning.", outcome: "A launched and monitored project.", procedures: ["Go Live", "Tracking Setup", "Training", "Monthly Monitoring"] } }
        ],
        view_procedures: "View Procedures",
        procedures_title: "Procedures & Actions",
        deliverable: "Step Deliverable",
        close: "Close"
    },
    advantages: {
        title: "Why choose",
        title_highlight: "All'Pro",
        items: [
            { title: "360° Versatile Expertise", desc: "A single point of contact to manage your image, tech, and marketing. Consistency guaranteed." },
            { title: "High Tech Expertise", desc: "We master modern stacks and cutting-edge AIs for sustainable products." },
            { title: "Human Support", desc: "Despite tech, humans remain at the center. We are available, reactive, and attentive." }
        ],
        badge: "Tailor Made"
    },
    contact: {
        title: "Ready to launch your project?",
        subtitle: "Contact All’Pro today and transform your ideas into results.",
        form: {
            name: "Full Name",
            email: "Professional Email",
            subject: "Subject",
            message: "Message",
            subjects: ["Web / App Creation", "AI Integration", "Social Media Strategy", "Branding & Identity", "Other Request"],
            btn: "Send Request",
            sending: "Sending..."
        },
        success: {
            title: "Message Sent!",
            subtitle: "Your vision is in good hands.",
            desc: "We have received your request. An All'Pro expert will analyze your project and contact you within 24 business hours.",
            btn: "Send another message"
        },
        info: {
            response: "Response within 24h",
            location: "Antananarivo-101, Madagascar"
        }
    },
    footer: {
        desc: "Digital Agency & AI. Transforming your ideas into projects, and your projects into results.",
        nav: "Navigation",
        legal: "Legal",
        legal_items: ["Legal Mentions", "Privacy Policy", "T&C"],
        copyright: "© 2024 All'Pro Agency. All rights reserved.",
        slogan: "Ideas, projects"
    },
    audit_modal: {
        input_title: "Scan your Project",
        input_desc: "Enter your site URL or briefly describe your activity. Our AI will generate a complete audit instantly.",
        placeholder: "ex: www.mysite.com or 'Eco-friendly clothing store'",
        badges: ["Rapid Analysis", "Confidential"],
        loading: "AI Analysis in progress...",
        loading_steps: ["Scanning SEO parameters...", "UX Evaluation...", "Generating strategies..."],
        download: "Download PDF",
        status: "STATUS: ANALYSIS_COMPLETE",
        prev: "Previous",
        next: "Next",
        finish: "Finish"
    },
    legal_content: {
        mentions: {
            title: "Legal Mentions",
            content: "The All'Pro site is edited by All'Pro Agency, Antananarivo, Madagascar. Email: allproject.mg@gmail.com. Secure Cloud Hosting."
        },
        confidentialite: {
            title: "Privacy Policy",
            content: "We collect your data (Name, Email) solely to respond to your request. No sale to third parties."
        },
        cgv: {
            title: "Terms & Conditions",
            content: "Any service is subject to a quote. 30-50% deposit upon order. Transfer of ownership after full payment."
        }
    }
  }
};