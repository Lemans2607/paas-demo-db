
/**
 * Local AI Service - "The Lion's Cub"
 * This simulates a local on-device model for true offline capability.
 * Enhanced with dynamic response templates based on input keywords.
 */

export const localProcess = async (input: string, taskType: string): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  const inputLower = input.toLowerCase();
  
  // Helper to extract keywords
  const hasKeyword = (words: string[]) => words.some(w => inputLower.includes(w));

  // ADVANCED DAO LOCAL ANALYSIS
  if (taskType === 'DAO') {
    const isBTP = hasKeyword(['béton', 'route', 'construction', 'btp', 'chantier']);
    const isService = hasKeyword(['formation', 'consulting', 'étude', 'logiciel']);
    
    return `[MODE HORS LIGNE - MODÈLE LOCAL V2.5 - LION CUB]
 
 🛡️ **Analyse de Conformité DAO (Moteur Local)**
 
 1. **Classification** : ${isBTP ? "Marché de Travaux (BTP)" : isService ? "Prestation Intellectuelle" : "Fournitures Générales"}
    *Détection basée sur l'analyse lexicale locale.*

 2. **Pièces Administratives Critiques** : 
    - ❌ Caisse Nationale de Prévoyance Sociale (CNPS) : Mention non détectée ou à vérifier manuellement.
    - ✅ Attestation de Non-Faillite : Présumée requise par défaut.
 
 3. **Analyse de Risque Financier** : 
    - Termes détectés : ${input.match(/caution|garantie|pénalité/gi)?.join(', ') || "Aucun terme critique évident"}.
    - **Recommandation** : En l'absence de connexion Cloud, vérifiez manuellement l'Article sur les "Pénalités de Retard".
 
 *Note : Synchronisez avec le Cloud pour une vérification juridique via Gemini 3 Pro.*`;
  }

  // ADVANCED PODCAST SCRIPT LOCAL
  if (taskType === 'PODCAST') {
    const topic = input.length > 30 ? input.substring(0, 30) + "..." : input;
    
    return `[MODE HORS LIGNE - SCRIPT GENERATOR LOCAL]
 
 🎙️ **Script Podcast Express (Gabarit Local)**
 
 **Intro Musicale (Suggérée)** : Afro-beat dynamique.

 **Hôte A** : Salut la communauté ! Aujourd'hui on parle de : "${topic}".
 
 **Hôte B** : C'est un sujet clé. J'ai lu le texte que tu m'as envoyé. Il y a 3 piliers.
 
 **Hôte A** : Vas-y, je t'écoute.
 
 **Hôte B** :
 1. Le problème central soulevé par le texte.
 2. La solution technique proposée.
 3. L'impact concret sur le terrain.
 
 **Hôte A** : C'est super clair. Et pour ceux qui veulent aller plus loin ?
 
 **Hôte B** : Relisez le document source, page par page. C'est dense mais riche !
 
 *Note : Voix neuronale indisponible hors ligne.*`;
  }

  // ADVANCED SUMMARY/NOTEBOOK LOCAL
  if (taskType === 'SUMMARY') {
    return `[RÉSUMÉ LOCAL - ZÉRO DATA - MOTEUR "LION CUB"]
 
 **Métadonnées du Document**
 • Longueur : ${input.length} caractères.
 • Densité : ${input.split(' ').length} mots environ.
 
 **Extraction Rapide** :
 • Le texte semble aborder des concepts techniques.
 • Des listes ou énumérations ont été identifiées.
 
 **Structure Suggérée pour Révision** :
 I. Introduction
 II. Développement Principal (Le cœur du sujet "${input.substring(0, 15)}...")
 III. Conclusion Pratique
 
 **Action Suggérée** :
 Ce résumé est généré par analyse de fréquence de mots. Pour une compréhension sémantique (comprendre le sens), le mode Online est requis.`;
  }

  // PITCH DECK LOCAL
  if (taskType === 'PITCH') {
      return `[MODE HORS LIGNE - PITCH GENERATOR]
      
      📊 **Structure Pitch Deck (Gabarit Universel)**
      
      1. **Slide Titre** : "${input.substring(0, 20)}..."
      2. **Problème** : Définissez la douleur client.
      3. **Solution** : Votre produit/service.
      4. **Marché** : Taille et opportunité au Cameroun.
      5. **Business Model** : Comment gagnez-vous de l'argent ?
      6. **Équipe** : Qui êtes-vous ?
      7. **Demande** : Combien cherchez-vous ?
      
      *Remplissez ces cases manuellement. L'IA Générative est hors ligne.*`;
  }

  // FALLBACK CHAT
  return `[🦁 LION CUB LOCAL] : Je suis en mode autonomie.
  
  J'ai analysé votre message : "${input}"
  
  Mes capacités hors ligne sont limitées à :
  1. Compter les mots (${input.split(' ').length}).
  2. Détecter l'urgence (Mots clés : Urgent, Aide, Panne).
  3. Préparer une réponse type.
  
  Pour une conversation fluide avec Yann (Gemini 3 Pro), veuillez activer internet.`;
};
