# World's Nana — État d'avancement

Dernière mise à jour : 2026-08-22. Ce document donne une vue d'ensemble du projet ; `frontend.md`/`backend.md` restent la référence pour le scope et les contraintes.

## Fait

### Documentation
- `CLAUDE.md` créé (repère pour travailler sur le repo : pas de build, fichiers HTML autonomes, scope versionné V1/V2/V3).
- `frontend.md` mis à jour au fil du prototypage puis de la décision finale (direction retenue, contraintes, écrans V1/V2).

### V1 — Home
**Direction retenue : "Seuil"** — implémentée dans `index.html`, écran d'entrée réel de l'app (plus un prototype de comparaison).
- Trou noir animé (canvas : disque d'accrétion tournant + particules qui spiralent vers le centre) posé sur le portail d'une illustration fournie (chambre d'enfant, porte ouverte sur un tourbillon lumineux — `assets/portal-full.jpg`).
- Les 4 raccourcis orbitent en continu à la périphérie du trou noir. Toucher un raccourci l'aspire vers le centre (aspiration + rotation, écran qui passe au noir) avant d'ouvrir l'app (scheme iOS + fallback App Store).
- Icônes de raccourcis en ligne dessinée (SVG maison), pas d'emoji.
- Toggle police dyslexie-friendly (Atkinson Hyperlegible), persisté en `localStorage`.
- Bannière offline non bloquante (`navigator.onLine`).
- Respecte `prefers-reduced-motion` (rotation/particules coupées, aspiration simplifiée en fondu).
- PWA : `manifest.webmanifest`, `icon.svg`, `sw.js` (cache offline de `index.html` + assets).

**Pistes explorées puis abandonnées** (supprimées du repo, consultables dans l'historique git) : navigation Dock/Bandeau/Rail, grille de cartes (3 traitements sobre/couleur/bento), variantes narratives bandeau-héroïque et triptyque.

### Existant avant ce chantier
- `brique.html` — prototype V2 "Brain" (flow carte, planète de progression), autonome, non retouché.
- `07-orbital-eclipse.html` — prototype visuel canvas, sans lien avec le reste.

## En cours
- Rien en cours — le choix de direction pour le Home vient d'être arbitré et le repo nettoyé en conséquence.

## Reste à faire

### V1 — avant de sortir du prototypage
- Définir la vraie liste de raccourcis (apps, URL schemes iOS, liens App Store) — actuellement données d'exemple (Musique, Dessiner, Lecture, Jeux éducatifs) codées en dur dans `index.html`.
- Tester sur iPad réel : ouverture des URL schemes + fallback App Store, installation "Ajouter à l'écran d'accueil", comportement offline réel, performance de l'animation canvas.
- Vérifier le contraste AA sur la palette sépia retenue (pas encore audité formellement).
- Arbitrer la police dyslexie-friendly définitive (Lexend / OpenDyslexic / Atkinson Hyperlegible — seule Atkinson est câblée pour l'instant).
- Harmoniser (ou assumer la rupture volontaire) entre l'identité "Seuil" du Home et l'identité `brique.html` de Brain (V2).

### V2 — Brain (non commencé)
- Porter `brique.html` dans la structure de l'app (pas une réécriture).
- Historique de session (IndexedDB, ou Supabase si historique multi-appareil voulu).
- Dashboard interne (strictement données Brain, aucun tracking externe).

### V3 — Intégration Home/Brain
- Non conçu, dépend des retours d'usage de V1/V2.

## Hors scope (rappel, toutes versions)
Tracking d'usage d'apps tierces, API Screen Time/DeviceActivity/Family Controls, blocage applicatif géré par le code — tout le gating Roblox reste 100 % natif iOS, hors app.
