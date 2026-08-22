# World's Nana — État d'avancement

Dernière mise à jour : 2026-08-22. Ce document donne une vue d'ensemble du projet ; `frontend.md`/`backend.md` restent la référence pour le scope et les contraintes.

## Fait

### Documentation
- `CLAUDE.md` créé (repère pour travailler sur le repo : pas de build, fichiers HTML autonomes, scope versionné V1/V2/V3).
- `frontend.md` mis à jour au fil du prototypage (structure retenue, pistes explorées, fichiers de référence).

### V1 — Home (prototypage, pas encore arbitré)
Deux pistes visuelles explorées en parallèle, aucune encore choisie :

**Piste grille** (proche de l'identité `brique.html`)
- `home-grid-mono.html` — cartes sobres, badge icône teinté.
- `home-grid-color.html` — cartes en aplat de couleur, plus contrasté.
- `home-grid-bento.html` — carte vedette + cartes secondaires (type App Store).

**Piste narrative** (illustration fournie — chambre + portail lumineux, `assets/portal-*.jpg`)
- `home-story-hero.html` — bandeau illustré + panneau plein pour la grille de raccourcis.
- `home-story-triptych.html` — 3 zones de la chambre = 3 humeurs (créer / explorer / se poser).
- `home-story-seuil.html` — trou noir animé (canvas) sur le portail, raccourcis en orbite, aspiration au tap avant ouverture de l'app.

**Socle commun aux deux pistes**
- Icônes de raccourcis en ligne dessinée (SVG maison : musique, dessin, lecture, blocs) — remplacent un premier essai en emoji jugé daté.
- Toggle police dyslexie-friendly (Atkinson Hyperlegible), persisté en `localStorage`.
- Bannière offline non bloquante (`navigator.onLine`).
- PWA : `manifest.webmanifest`, `icon.svg`, `sw.js` (cache offline de tous les prototypes + assets).
- `index.html` : page de comparaison temporaire listant les 6 prototypes.

### Existant avant ce chantier
- `brique.html` — prototype V2 "Brain" (flow carte, planète de progression), autonome, non retouché.
- `07-orbital-eclipse.html` — prototype visuel canvas, sans lien avec le reste.

## En cours
- **Aucun choix arbitré** entre piste grille et piste narrative, ni entre les variantes à l'intérieur de chaque piste — tout est encore au stade prototype/comparatif.
- Palette et typographie de la piste narrative (tons sépia, police Fraunces) volontairement non harmonisées avec `brique.html` tant que la direction n'est pas tranchée.

## Reste à faire

### V1 — avant de sortir du prototypage
- Choisir la structure/traitement visuel définitif du Home (trancher entre les 6 prototypes, ou itérer sur le favori).
- Définir la vraie liste de raccourcis (apps, URL schemes iOS, liens App Store) — actuellement données d'exemple (Musique, Dessiner, Lecture, Jeux éducatifs) codées en dur dans chaque prototype.
- Construire l'écran Home définitif à partir du prototype choisi (aujourd'hui : uniquement des prototypes comparatifs à la racine, pas encore une "vraie" app avec ses données réelles).
- Tester sur iPad réel : ouverture des URL schemes + fallback App Store, installation "Ajouter à l'écran d'accueil", comportement offline réel.
- Vérifier le contraste AA sur la palette finalement retenue (pas encore audité formellement, en particulier pour la piste narrative, plus sombre).
- Arbitrer la police dyslexie-friendly définitive (Lexend / OpenDyslexic / Atkinson Hyperlegible — seule Atkinson est câblée pour l'instant).
- Nettoyer le repo une fois le choix fait : supprimer les prototypes non retenus et `index.html` (page de comparaison temporaire).

### V2 — Brain (non commencé)
- Porter `brique.html` dans la structure de l'app (pas une réécriture).
- Historique de session (IndexedDB, ou Supabase si historique multi-appareil voulu).
- Dashboard interne (strictement données Brain, aucun tracking externe).

### V3 — Intégration Home/Brain
- Non conçu, dépend des retours d'usage de V1/V2.

## Hors scope (rappel, toutes versions)
Tracking d'usage d'apps tierces, API Screen Time/DeviceActivity/Family Controls, blocage applicatif géré par le code — tout le gating Roblox reste 100 % natif iOS, hors app.
