# World's Nana — Frontend (Claude Design)

## Contexte
Interface iPad personnalisée pour une fille de 12 ans. Deux zones : accès libre (raccourcis vers apps du store) et Brain (V2, app propre basée sur brique.html). Roblox est géré hors app, via Screen Time natif (voir GatingRoblox.md) — le frontend n'a rien à afficher ni gérer pour ça.

## Ce qui est fixé
- Minimaliste et chaleureux.
- Police adaptée à la dysphasie/dyslexie (ex : Lexend, OpenDyslexic, Atkinson Hyperlegible — à tester, pas figé).
- PWA, pas de contrainte native.
- Rien d'autre n'est arrêté visuellement (couleurs, style graphique) : le but de ce document est de cadrer le prototypage, pas de livrer un design final.

## Base de référence fournie (pattern, pas design final)
- `brique.html` : seul fichier de prototype présent dans le repo, base du prototypage V1. Identité visuelle Brain existante — fond marine #1B2333, beige #F5F1E8, accent vert #8FB89D, police ui-rounded/SF Pro Rounded. Flow carte-par-carte (session), écran d'accueil avec "planète" de progression.
- Structure de navigation V1 : grille de cartes (card grid). Les 3 premiers essais (Dock/Bandeau/Rail, esquissés dans `home-selector-miniature.html`, absent du repo) ont été abandonnés. Icônes des raccourcis en ligne dessinée (SVG), pas d'emoji — jugé trop daté visuellement.
- 3 traitements visuels prototypés sur cette structure : `home-grid-mono.html` (cartes sobres, proches de l'identité brique.html), `home-grid-color.html` (cartes en aplat de couleur, plus contrasté), `home-grid-bento.html` (carte vedette + cartes secondaires, type "App Store").

## Piste alternative en cours d'exploration : illustration narrative
En parallèle de la grille, une direction visuelle basée sur une illustration (une chambre d'enfant, une porte ouverte sur un tourbillon lumineux — `assets/portal-*.jpg`) est prototypée pour poser une ambiance "théâtre" plutôt qu'un simple menu d'icônes. Pas encore arbitrée face à la piste grille — à comparer avant de trancher.
- `home-story-seuil.html` : trou noir animé (canvas, disque d'accrétion + particules) posé sur le portail de l'illustration, les 4 raccourcis orbitent à sa périphérie. Toucher un raccourci l'aspire vers le centre (aspiration + rotation) avant d'ouvrir l'app. Respecte `prefers-reduced-motion` (rotation/particules coupées, aspiration simplifiée en fondu).
- `home-story-hero.html` : bandeau illustré en haut pour l'ambiance, panneau plein (fort contraste) en dessous pour la grille de raccourcis — sépare théâtre et fonction.
- `home-story-triptych.html` : la chambre découpée en 3 zones/humeurs (créer / explorer sans raccourci / se poser), affichées en 3 colonnes sur iPad.
Palette distincte de brique.html (tons chauds sépia proches de l'illustration, police display Fraunces pour les titres) — à n'harmoniser avec le reste qu'une fois la direction choisie.

## Écrans V1
1. **Home / Sélecteur** — point d'entrée. Affiche les raccourcis vers apps libres (statiques, non trackés) en grille de cartes. Traitement visuel à choisir parmi les 3 variantes prototypées (voir ci-dessus), ou une 4e option si aucune ne convient à l'usage réel.
2. **Raccourcis apps libres** — liste ou grille de shortcuts (Musique, dessin, jeux éducatifs — liste définie séparément). Simple deep-link, pas d'état interne à gérer.
3. **État offline / connexion faible** — les raccourcis vers apps store restent cliquables hors ligne (ils ouvrent l'app native), mais l'interface elle-même (Home) doit rester utilisable et lisible sans réseau. Prévoir un état visuel dégradé mais non bloquant.

## Écrans V2 (à concevoir mais pas prioritaires en V1)
4. **Brain — accueil** — reprend/adapte l'écran planète de brique.html.
5. **Brain — session** — flow carte (mot, définition, esquisse, question) déjà présent dans brique.html, à retravailler visuellement selon direction retenue.
6. **Brain — historique** — liste des sessions passées, thèmes explorés.
7. **Dashboard interne Brain** — visualisation légère des thèmes vus / fréquence, périmètre strictement interne à Brain (aucune donnée sur apps externes, décision actée : pas de tracking hors app).

## Contraintes d'accessibilité
- Bascule police dyslexie-friendly (au moins une option testable en V1 sur le Home, prioritaire sur Brain qui arrive en V2).
- Contraste suffisant quel que soit le thème retenu (viser AA minimum).
- Cibles tactiles larges (utilisatrice 12 ans, iPad).
- Pas de bloc de texte dense — aération, hiérarchie visuelle claire.

## Hors scope frontend V1
- Tout écran lié à Brain (V2).
- Tout affichage de métriques/dashboard (V2, périmètre Brain uniquement).
- Toute UI de gestion du gating Roblox (géré nativement par iOS, hors app).

## Livrable attendu de Claude Design
2 à 3 directions de prototypage pour le Home (une par pattern de navigation testé), avec au moins une variante de police dyslexie-friendly appliquée, avant choix final.
