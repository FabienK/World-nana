# World's Nana — Backend/Architecture (Claude Code)

## Décision d'architecture
PWA de bout en bout. Aucune brique native, aucun entitlement Apple requis — le gating Roblox est géré manuellement hors app via Screen Time (voir GatingRoblox.md), et le tracking d'usage des apps externes a été explicitement écarté (Option C actée : pas de mesure, pas de deep-link timestamp, pas de rotation basée sur usage externe).

Conséquence directe : le backend V1 est volontairement simple, pas d'API système, pas de permission à demander à l'utilisatrice.

## V1 — Fondations

### Fonctionnalités
- Sélecteur d'accueil (Home) : liste/grille de raccourcis statiques.
- Raccourcis = simples liens (URL scheme iOS quand disponible, ex. `music://`, sinon lien App Store si l'app n'est pas installée) vers Musique, apps de dessin, apps éducatives.
- Aucun tracking, aucune écriture de log sur ces lancements (décision Option C).
- Mode offline : l'app doit s'ouvrir et rester utilisable sans réseau (service worker, cache des assets statiques, pas de dépendance à un backend distant pour l'écran Home).
- Mode connexion faible : dégrader proprement (pas de blocage, pas de timeout bloquant l'UI).

### Stockage
- Aucune donnée utilisateur sensible en V1. Préférences locales uniquement (police choisie, thème) — `localStorage`/IndexedDB côté client, pas de backend serveur nécessaire pour V1.

### Stack suggérée
- Framework front léger (React ou vanilla JS selon ce que Claude Design produit), service worker pour l'offline (Workbox ou manuel), déploiement statique (Vercel).
- Pas de base de données V1.

## V2 — Brain

### Fonctionnalités
- Intégration de brique.html (déjà en HTML/CSS/JS pur, donc portage direct en composants de l'app plutôt que réécriture).
- Sessions courtes (5–10 min), historique par session : thème/mot travaillé, date, résultat.
- Dashboard interne : ratio et fréquence, strictement calculé sur les données Brain (aucune donnée externe — cohérent avec Option C).
- Logique de "roulement" : uniquement sur le contenu proposé par Brain (thèmes/mots déjà vus vs nouveaux), pas sur les apps externes.

### Stockage
- Historique de session à persister durablement (au-delà du cache navigateur) : IndexedDB local a minima, ou backend léger (Supabase) si tu veux un historique qui survit à une réinstallation/reset de l'app ou consultable depuis un autre appareil (toi, par ex., pour suivre sa progression).
- Si Supabase : une table `sessions` (id, date, thème, durée, résultat) suffit pour V2, pas besoin de comptes multi-utilisateurs.

## V3 — Intégration fine
- Lien entre Home et Brain (ex. mise en avant de Brain depuis le Home, statut de la session du jour visible).
- Non détaillé à ce stade — dépend de ce que V1/V2 auront révélé à l'usage.

## Hors scope backend (toutes versions)
- Toute API Screen Time / DeviceActivity / Family Controls.
- Tout tracking d'usage d'app tierce (Musique, dessin, jeux, Roblox).
- Tout mécanisme de blocage applicatif géré par le code (le blocage est 100% côté Réglages iOS, hors app).
