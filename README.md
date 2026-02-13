# Éco-Score Web 🌍

### Le Scanner d'Empreinte Carbone pour le Web

> **Démo en direct :** [https://ecoscore-web.vercel.app](https://ecoscore-web.vercel.app)

Une application SaaS prête pour la production qui analyse l'empreinte carbone de n'importe quel site web. Conçue avec Next.js 16, Supabase et D3.js pour offrir une solution complète de mesure et d'optimisation écologique des sites web.

![Aperçu de Éco-Score Web](https://github.com/user-attachments/assets/placeholder)

## 🏆 Hackathon - Club APPEL EPI Sousse

Ce projet a été développé dans le cadre du hackathon organisé par le **Club APPEL - EPI Sousse**.

### À propos du projet

Éco-Score Web est né de la nécessité de sensibiliser à l'impact environnemental du numérique. Avec l'explosion du nombre de sites web et applications, il est devenu crucial de mesurer et d'optimiser leur empreinte carbone. Notre solution permet aux développeurs, designers et propriétaires de sites web de :

- 📊 **Mesurer** l'empreinte carbone de leurs sites web
- 🎯 **Identifier** les opportunités d'optimisation
- 📈 **Suivre** l'évolution de leurs performances écologiques
- 🌱 **Comparer** avec les standards de l'industrie

## 🚀 Fonctionnalités Principales

### Analyse Complète
- **Analyse Carbone Instantanée** : Estime les émissions de CO₂ et la consommation d'énergie par page vue en temps réel
- **Intégration Lighthouse** : Exécute des audits de performance côté serveur via Google PageSpeed Insights
- **Analyse des Ressources** : Détection et analyse de tous les assets (images, scripts, CSS, fonts)

### Visualisation Interactive
- **Tableau de Bord Visuel** : Graphiques interactifs avec D3.js pour la répartition des ressources et les benchmarks
- **Graphiques Dynamiques** : 
  - Jauge Éco-Score interactive
  - Graphique d'évolution temporelle
  - Répartition par type de ressource
  - Comparaison avec les benchmarks de l'industrie

### Gestion des Analyses
- **Historique des Scans** : Sauvegardez et suivez vos analyses au fil du temps
- **Système d'Authentification** : Compte gratuit avec gestion sécurisée via Supabase
- **Note Éco-Score** : Un score simple de 0 à 100 avec une notation Vert/Modéré/Élevé

## 🎯 Comment ça marche ?

1. **Entrez une URL** : Saisissez l'URL du site web que vous souhaitez analyser
2. **Analyse Automatique** : Notre système récupère et analyse toutes les ressources de la page
3. **Calcul de l'Empreinte** : Estimation des émissions de CO₂ basée sur le poids des ressources et la consommation énergétique
4. **Visualisation** : Consultez les résultats détaillés avec graphiques et recommandations
5. **Suivi** : Sauvegardez vos analyses pour suivre l'évolution dans le temps

## 🛠️ Technologies Utilisées

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Base de données** : [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Visualisation** : [D3.js](https://d3js.org/)
- **Style** : Tailwind CSS v4
- **Performance** : Analyse Lighthouse côté serveur

## 📦 Démarrage

### Prérequis

- Node.js 18+
- npm ou pnpm
- Un projet Supabase

### Installation

1.  **Clonez le dépôt**
    ```bash
    git clone https://github.com/votre-utilisateur/ecoscore-web.git
    cd ecoscore-web
    ```

2.  **Installez les dépendances**
    ```bash
    npm install
    ```

3.  **Configurez les variables d'environnement**
    Copiez `.env.local.example` vers `.env.local` et ajoutez vos identifiants :
    ```bash
    cp .env.local.example .env.local
    ```
   
    Mettez à jour `.env.local` :
    ```env
    NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
    PAGESPEED_API_KEY=votre_cle_api_google (optionnel)
    ```

4.  **Exécutez le Schéma de la Base de Données**
    Copiez le contenu de `supabase/schema.sql` et exécutez-le dans votre éditeur SQL Supabase.

5.  **Démarrez le serveur de développement**
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 📁 Structure du Projet

```
ecoscore-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Routes d'authentification
│   │   ├── (dashboard)/       # Routes du tableau de bord
│   │   ├── api/               # API Routes
│   │   └── scan/              # Pages de scan
│   ├── components/            # Composants React
│   │   ├── charts/           # Composants de visualisation D3.js
│   │   ├── layout/           # Header, Footer, etc.
│   │   ├── scan/             # Composants liés aux scans
│   │   └── ui/               # Composants UI réutilisables
│   ├── lib/                   # Utilitaires et configuration
│   │   └── supabase/         # Configuration Supabase
│   ├── services/             # Services métier
│   │   ├── benchmarks.ts     # Gestion des benchmarks
│   │   ├── carbon.ts         # Calculs d'empreinte carbone
│   │   └── lighthouse.ts     # Intégration Lighthouse
│   └── types/                # Définitions TypeScript
└── supabase/
    └── schema.sql            # Schéma de base de données
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build pour la production
npm run start        # Lancer le serveur de production
npm run lint         # Linter le code
npm run type-check   # Vérifier les types TypeScript
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement dans les paramètres Vercel
3. Déployez automatiquement à chaque push

### Autre plateformes

Ce projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- Railway
- Render
- AWS Amplify

## 📊 Méthodologie de Calcul

Notre calcul d'empreinte carbone est basé sur :

1. **Poids des Ressources** : Analyse du poids total de tous les assets
2. **Transfert de Données** : Estimation de l'énergie consommée pour le transfert
3. **Facteur de Conversion** : Utilisation des facteurs standards de l'industrie (0.5 kWh/GB)
4. **Intensité Carbone** : Application du mix énergétique moyen mondial (475g CO₂/kWh)

## 🔒 Sécurité

- Authentification sécurisée via Supabase Auth
- Row Level Security (RLS) activée sur toutes les tables
- Variables d'environnement pour les clés sensibles
- Protection CSRF via Next.js middleware

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request.

### Guide de Contribution

1. Forkez le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 👥 Équipe

Projet développé pour le hackathon **Club APPEL - EPI Sousse**

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

## 🙏 Remerciements

- **Club APPEL - EPI Sousse** pour l'organisation du hackathon
- **Vercel** pour l'hébergement
- **Supabase** pour la plateforme backend
- La communauté open-source pour les outils utilisés

## 📄 Licence

Ce projet est sous licence MIT.
# -Eco-Score-Web-Le-Scanner-d-Empreinte
