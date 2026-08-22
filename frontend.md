# World's Nana — Frontend (Claude Design)

## Contexte
Interface iPad personnalisée pour une fille de 12 ans. Deux zones : accès libre (raccourcis vers apps du store) et Brain (V2, app propre basée sur brique.html). Roblox est géré hors app, via Screen Time natif (voir GatingRoblox.md) — le frontend n'a rien à afficher ni gérer pour ça.

## Ce qui est fixé
- Minimaliste et chaleureux.
- Police adaptée à la dysphasie/dyslexie (ex : Lexend, OpenDyslexic, Atkinson Hyperlegible — à tester, pas figé).
- PWA, pas de contrainte native.
- Rien d'autre n'est arrêté visuellement (couleurs, style graphique) : le but de ce document est de cadrer le prototypage, pas de livrer un design final.

## Direction retenue pour le Home : "Seuil"
Après comparaison de 6 prototypes (une piste grille de cartes et une piste illustration narrative), la direction retenue est **Seuil**, implémentée dans `index.html` : un trou noir animé (canvas, disque d'accrétion + particules) posé sur le portail d'une illustration (chambre d'enfant, porte ouverte sur un tourbillon lumineux — `assets/portal-full.jpg`). Les 4 raccourcis orbitent en continu à la périphérie du trou noir ; toucher un raccourci l'aspire vers le centre (aspiration + rotation, écran qui passe au noir) avant d'ouvrir l'app.
- Palette tons chauds sépia — fond quasi noir `#0A0603`, texte parchemin `#F3E7CE`, accent doré `#E8A94D` — et typographie display Fraunces pour les titres (Atkinson Hyperlegible reste la police de bascule dyslexie). Remplace l'identité `brique.html` (marine/beige/vert) pour cet écran ; `brique.html` reste la référence pour Brain (V2), non encore harmonisé avec le nouveau Home.
- Respecte `prefers-reduced-motion` (rotation/particules coupées, aspiration simplifiée en fondu).
- Icônes de raccourcis en ligne dessinée (SVG maison), pas d'emoji — jugé trop daté visuellement lors d'un essai précédent.
- Pistes explorées puis abandonnées après comparaison : navigation Dock/Bandeau/Rail, grille de cartes (3 traitements sobre/couleur/bento), variantes narratives bandeau-héroïque et triptyque. Historique consultable dans les commits git si besoin de les revoir.

## Écrans V1
1. **Home / Sélecteur** — point d'entrée. Affiche les raccourcis vers apps libres (statiques, non trackés) sous forme de raccourcis en orbite autour du trou noir animé "Seuil" (voir ci-dessus, implémenté dans `index.html`).
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
