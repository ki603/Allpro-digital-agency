import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Tu es l'assistant virtuel expert de l'agence digitale "All'Pro".
Ton identité est ancrée dans le style "Crystal Transparent" : tes réponses sont limpides, énergiques et tournées vers l'avenir.

**TA MISSION :** Transformer les questions des visiteurs en début de projet.

**INFORMATIONS CLÉS SUR ALL'PRO :**
- **Slogan :** "Des idées, des projets."
- **Promesse :** "Transformer vos idées en projets, et vos projets en résultats."
- **Différenciateur :** Une agence hybride Créative & Technologique où l'Intelligence Artificielle est la fondation de la performance.

**NOS 6 PÔLES D'EXPERTISE :**
1. Création de Contenu Digital (Photo, Vidéo, Motion).
2. Réseaux Sociaux (Stratégie, Community Management).
3. Web & Apps (Sites vitrines, E-commerce, SaaS).
4. Marketing & Communication (Branding, Ads).
5. Stratégie Digitale (Audit, Conseil).
6. **Intégration IA (Le cœur du réacteur : Agents IA, Automatisation, Data).**

**NOTRE MÉTHODE EN 5 ÉTAPES :**
1. **Découverte :** Audit & Vision.
2. **Création :** Design & UX.
3. **Validation :** Feedback client.
4. **Production :** Développement & Intégration.
5. **Analyse :** Suivi & Optimisation continue.

**TON COMPORTEMENT :**
- Sois professionnel mais chaleureux (Ton : "Aubergine & Rose").
- Si on te demande un prix : Indique que chaque projet est unique et invite à utiliser le formulaire de contact ou à donner un email pour être recontacté.
- Mets en avant l'IA comme un accélérateur de croissance pour le client.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = getChatSession();
    const result = await chat.sendMessage({ message });
    return result.text || "Désolé, je n'ai pas pu traiter votre demande pour le moment.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Une erreur technique est survenue. Veuillez réessayer plus tard.";
  }
};

export interface AuditSlide {
  title: string;
  points: string[];
  icon: 'Zap' | 'Search' | 'BarChart3' | 'Shield' | 'Rocket';
}

export interface AuditResult {
  businessName: string;
  overallScore: number;
  summary: string;
  slides: AuditSlide[];
}

export const generateAudit = async (businessInfo: string): Promise<AuditResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyse cette entreprise ou ce projet : "${businessInfo}".
      Agis comme un auditeur expert senior. Génère un audit concis, percutant et stratégique.
      
      Retourne UNIQUEMENT un objet JSON (sans markdown) avec la structure suivante :
      {
        "businessName": "Nom de l'entreprise (ou URL)",
        "overallScore": un nombre entre 0 et 100 estimant la maturité digitale apparente,
        "summary": "Une phrase d'accroche résumant le potentiel",
        "slides": [
           { "title": "1. Diagnostic Digital", "points": ["Point faible 1", "Opportunité 1", "Observation clé"], "icon": "Search" },
           { "title": "2. Expérience Utilisateur (UX)", "points": ["Point 1", "Point 2", "Point 3"], "icon": "Zap" },
           { "title": "3. Stratégie & Visibilité", "points": ["SEO", "Social Media", "Branding"], "icon": "BarChart3" },
           { "title": "4. Plan d'Action Recommandé", "points": ["Action immédiate", "Projet moyen terme", "Innovation IA"], "icon": "Rocket" }
        ]
      }
      Sois critique mais constructif. Si l'info est vague, fais des suppositions intelligentes basées sur le secteur.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuditResult;
    }
    return null;
  } catch (error) {
    console.error("Error generating audit:", error);
    return null;
  }
};