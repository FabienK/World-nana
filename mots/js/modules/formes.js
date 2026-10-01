// Dessins plats des scènes de « Dans la bonne case ».
// Les repères sont étirés sur leur boîte (preserveAspectRatio="none"),
// les objets restent carrés. Palette commune à toutes les scènes.

const INK = "#3b2f24", WOOD = "#b89a6e", WOOD_D = "#8a6f4e", CREAM = "#fffaf0", GOLD = "#c9a227";
const METAL = "#c3c8cc", METAL_D = "#8e989f", VERT = "#7f9a6a", VERT_D = "#4d6b3c",
      ROUGE = "#c2705c", BLEU = "#7d9bb5", BLEU_D = "#233a4d", BRIQUE = "#a8654f";
export const SHAPES = {
  lit: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="2" y="10" width="14" height="70" rx="3" fill="${WOOD}"/>
    <rect x="10" y="40" width="88" height="34" rx="4" fill="${CREAM}" stroke="${WOOD_D}" stroke-width="1.5"/>
    <rect x="10" y="40" width="88" height="12" rx="4" fill="#e7d9bd"/>
    <rect x="12" y="74" width="6" height="18" fill="${WOOD_D}"/><rect x="90" y="74" width="6" height="18" fill="${WOOD_D}"/>
  </svg>`,
  tapis: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <ellipse cx="50" cy="50" rx="48" ry="46" fill="#d9c3a5"/>
    <ellipse cx="50" cy="50" rx="34" ry="32" fill="none" stroke="${WOOD_D}" stroke-width="2" stroke-dasharray="4 4"/>
  </svg>`,
  /* Petite console basse contre le mur (croquis utilisateur) : plateau, pieds courts posés sur la plinthe. */
  table: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="14" rx="3" fill="${WOOD}"/>
    <rect x="7" y="14" width="8" height="86" fill="${WOOD_D}"/><rect x="85" y="14" width="8" height="86" fill="${WOOD_D}"/>
  </svg>`,
  lampe: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M20 40 L80 40 L66 4 L34 4 Z" fill="${GOLD}"/>
    <rect x="46" y="40" width="8" height="52" fill="${INK}"/>
    <rect x="26" y="90" width="48" height="10" rx="4" fill="${INK}"/>
  </svg>`,
  etagere: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" rx="6" fill="${WOOD}"/>
    <rect x="4" y="100" width="6" height="30" fill="${WOOD_D}"/><rect x="90" y="100" width="6" height="30" fill="${WOOD_D}"/>
  </svg>`,
  coussin: `<svg viewBox="0 0 100 100">
    <path d="M12 18 Q50 8 88 18 Q98 50 88 82 Q50 92 12 82 Q2 50 12 18 Z" fill="#c88f78" stroke="#5a2a1c" stroke-width="2"/>
    <circle cx="50" cy="50" r="5" fill="#5a2a1c"/>
  </svg>`,
  livre: `<svg viewBox="0 0 100 100">
    <rect x="18" y="12" width="64" height="76" rx="4" fill="#7d9bb5" stroke="#233a4d" stroke-width="2"/>
    <rect x="18" y="12" width="12" height="76" rx="3" fill="#233a4d"/>
    <rect x="40" y="26" width="30" height="4" fill="${CREAM}"/><rect x="40" y="36" width="24" height="4" fill="${CREAM}"/>
  </svg>`,
  chat: `<svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="66" rx="32" ry="24" fill="#7a6350"/>
    <circle cx="50" cy="38" r="20" fill="#7a6350"/>
    <path d="M34 26 L30 6 L46 20 Z" fill="#7a6350"/><path d="M66 26 L70 6 L54 20 Z" fill="#7a6350"/>
    <circle cx="43" cy="38" r="3" fill="${CREAM}"/><circle cx="57" cy="38" r="3" fill="${CREAM}"/>
    <path d="M82 66 Q98 60 92 44" stroke="#7a6350" stroke-width="7" fill="none" stroke-linecap="round"/>
  </svg>`,
  // ----- Cuisine ----------------------------------------------------------------
  evier: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="16" rx="3" fill="${METAL}"/>
    <rect x="18" y="4" width="64" height="9" rx="3" fill="${METAL_D}"/>
    <rect x="46" y="-16" width="6" height="20" fill="${METAL_D}"/>
    <path d="M49 -16 q0 -10 12 -10 q10 0 10 9" fill="none" stroke="${METAL_D}" stroke-width="5"/>
    <rect x="0" y="16" width="100" height="84" fill="${WOOD}"/>
    <rect x="6" y="26" width="40" height="60" rx="3" fill="none" stroke="${WOOD_D}" stroke-width="2"/>
    <rect x="54" y="26" width="40" height="60" rx="3" fill="none" stroke="${WOOD_D}" stroke-width="2"/>
  </svg>`,
  placard: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" rx="4" fill="${WOOD}" stroke="${WOOD_D}" stroke-width="2"/>
    <line x1="50" y1="4" x2="50" y2="96" stroke="${WOOD_D}" stroke-width="2"/>
    <circle cx="44" cy="52" r="3" fill="${INK}"/><circle cx="56" cy="52" r="3" fill="${INK}"/>
  </svg>`,
  frigo: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" rx="6" fill="${CREAM}" stroke="${METAL_D}" stroke-width="2"/>
    <line x1="0" y1="34" x2="100" y2="34" stroke="${METAL_D}" stroke-width="2"/>
    <rect x="76" y="10" width="6" height="16" rx="3" fill="${METAL_D}"/>
    <rect x="76" y="42" width="6" height="26" rx="3" fill="${METAL_D}"/>
  </svg>`,
  chaise: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="20" y="0" width="60" height="42" rx="5" fill="${WOOD}"/>
    <rect x="10" y="42" width="80" height="12" rx="4" fill="${WOOD_D}"/>
    <rect x="16" y="54" width="9" height="46" fill="${WOOD_D}"/><rect x="75" y="54" width="9" height="46" fill="${WOOD_D}"/>
  </svg>`,
  tableCuisine: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="16" rx="4" fill="${WOOD}"/>
    <rect x="8" y="16" width="9" height="84" fill="${WOOD_D}"/><rect x="83" y="16" width="9" height="84" fill="${WOOD_D}"/>
  </svg>`,
  bol: `<svg viewBox="0 0 100 100">
    <path d="M16 40 q34 12 68 0 q-6 40 -34 40 q-28 0 -34 -40 Z" fill="${CREAM}" stroke="${BLEU_D}" stroke-width="2"/>
    <path d="M16 40 q34 12 68 0" fill="none" stroke="${BLEU}" stroke-width="5"/>
  </svg>`,
  pomme: `<svg viewBox="0 0 100 100">
    <path d="M50 28 q-26 -6 -28 26 q-2 30 28 36 q30 -6 28 -36 q-2 -32 -28 -26 Z" fill="${ROUGE}"/>
    <rect x="47" y="14" width="5" height="16" rx="2" fill="${WOOD_D}"/>
    <path d="M52 20 q14 -10 20 0 q-14 8 -20 0 Z" fill="${VERT_D}"/>
  </svg>`,
  torchon: `<svg viewBox="0 0 100 100">
    <rect x="24" y="14" width="52" height="74" rx="5" fill="${CREAM}" stroke="${BLEU}" stroke-width="2"/>
    <line x1="24" y1="34" x2="76" y2="34" stroke="${BLEU}" stroke-width="4"/>
    <line x1="24" y1="66" x2="76" y2="66" stroke="${BLEU}" stroke-width="4"/>
  </svg>`,
  casserole: `<svg viewBox="0 0 100 100">
    <rect x="18" y="42" width="58" height="34" rx="6" fill="${METAL}" stroke="${METAL_D}" stroke-width="2"/>
    <rect x="14" y="38" width="66" height="8" rx="4" fill="${METAL_D}"/>
    <rect x="78" y="40" width="20" height="7" rx="3" fill="${INK}"/>
  </svg>`,
  // ----- Salon --------------------------------------------------------------------
  canape: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="18" width="100" height="46" rx="8" fill="#9a7f63"/>
    <rect x="6" y="34" width="88" height="34" rx="7" fill="#b4967a"/>
    <rect x="0" y="30" width="12" height="40" rx="6" fill="#8a6f4e"/>
    <rect x="88" y="30" width="12" height="40" rx="6" fill="#8a6f4e"/>
    <rect x="12" y="70" width="8" height="24" fill="${WOOD_D}"/><rect x="80" y="70" width="8" height="24" fill="${WOOD_D}"/>
  </svg>`,
  tableBasse: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="14" rx="5" fill="${WOOD}"/>
    <rect x="10" y="14" width="7" height="70" fill="${WOOD_D}"/><rect x="83" y="14" width="7" height="70" fill="${WOOD_D}"/>
    <rect x="16" y="52" width="68" height="6" rx="3" fill="${WOOD_D}" opacity="0.6"/>
  </svg>`,
  tele: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="74" rx="4" fill="${BLEU_D}"/>
    <rect x="5" y="6" width="90" height="62" rx="2" fill="#4a6d87"/>
    <rect x="42" y="74" width="16" height="16" fill="${INK}"/>
    <rect x="26" y="90" width="48" height="8" rx="4" fill="${INK}"/>
  </svg>`,
  plante: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M50 62 q-30 -6 -34 -50 q22 6 34 34 q12 -28 34 -34 q-4 44 -34 50 Z" fill="${VERT}"/>
    <path d="M50 30 v34" stroke="${VERT_D}" stroke-width="3"/>
    <path d="M30 62 h40 l-6 34 h-28 Z" fill="${BRIQUE}"/>
  </svg>`,
  lampadaire: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M24 26 L76 26 L64 2 L36 2 Z" fill="${GOLD}"/>
    <rect x="46" y="26" width="8" height="66" fill="${INK}"/>
    <ellipse cx="50" cy="94" rx="24" ry="6" fill="${INK}"/>
  </svg>`,
  telecommande: `<svg viewBox="0 0 100 100">
    <rect x="34" y="10" width="32" height="80" rx="8" fill="${INK}"/>
    <rect x="40" y="18" width="20" height="12" rx="3" fill="#6f6254"/>
    <circle cx="45" cy="42" r="3.5" fill="${CREAM}"/><circle cx="55" cy="42" r="3.5" fill="${CREAM}"/>
    <circle cx="45" cy="54" r="3.5" fill="${CREAM}"/><circle cx="55" cy="54" r="3.5" fill="${CREAM}"/>
    <circle cx="50" cy="72" r="6" fill="${GOLD}"/>
  </svg>`,
  magazine: `<svg viewBox="0 0 100 100">
    <rect x="16" y="22" width="68" height="56" rx="3" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>
    <rect x="16" y="22" width="68" height="16" fill="${ROUGE}"/>
    <rect x="24" y="46" width="34" height="4" fill="${INK}" opacity="0.5"/>
    <rect x="24" y="56" width="46" height="4" fill="${INK}" opacity="0.35"/>
    <rect x="24" y="66" width="28" height="4" fill="${INK}" opacity="0.35"/>
  </svg>`,

  // ----- Jardin -------------------------------------------------------------------
  banc: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="6" width="100" height="10" rx="4" fill="${WOOD}"/>
    <rect x="0" y="24" width="100" height="10" rx="4" fill="${WOOD}"/>
    <rect x="0" y="44" width="100" height="12" rx="4" fill="${WOOD_D}"/>
    <rect x="10" y="56" width="8" height="44" fill="${WOOD_D}"/><rect x="82" y="56" width="8" height="44" fill="${WOOD_D}"/>
  </svg>`,
  arbre: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <circle cx="50" cy="30" r="30" fill="${VERT}"/>
    <circle cx="26" cy="44" r="18" fill="${VERT_D}" opacity="0.8"/>
    <circle cx="74" cy="44" r="18" fill="${VERT_D}" opacity="0.8"/>
    <rect x="43" y="56" width="14" height="44" fill="${WOOD_D}"/>
  </svg>`,
  cabane: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M50 2 L98 34 H2 Z" fill="${BRIQUE}"/>
    <rect x="10" y="34" width="80" height="66" fill="${WOOD}"/>
    <rect x="38" y="58" width="24" height="42" rx="2" fill="${WOOD_D}"/>
    <rect x="16" y="44" width="16" height="16" rx="2" fill="${CREAM}" stroke="${WOOD_D}" stroke-width="2"/>
  </svg>`,
  potager: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="30" width="100" height="70" rx="4" fill="#8a6a4a"/>
    <rect x="0" y="30" width="100" height="10" rx="4" fill="${WOOD_D}"/>
    <path d="M18 30 q4 -22 10 -22 q6 0 10 22 Z" fill="${VERT}"/>
    <path d="M45 30 q4 -18 9 -18 q5 0 9 18 Z" fill="${VERT_D}"/>
    <path d="M70 30 q4 -22 10 -22 q6 0 10 22 Z" fill="${VERT}"/>
  </svg>`,
  muret: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" fill="#c9b08c"/>
    <g stroke="#a98f6d" stroke-width="2">
      <line x1="0" y1="34" x2="100" y2="34"/><line x1="0" y1="68" x2="100" y2="68"/>
      <line x1="34" y1="0" x2="34" y2="34"/><line x1="70" y1="34" x2="70" y2="68"/>
      <line x1="20" y1="68" x2="20" y2="100"/><line x1="60" y1="68" x2="60" y2="100"/>
    </g>
  </svg>`,
  ballon: `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="34" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>
    <path d="M50 30 l16 12 -6 20 h-20 l-6 -20 Z" fill="${INK}"/>
    <path d="M50 18 v12 M22 44 l16 -2 M78 44 l-16 -2 M36 84 l6 -20 M64 84 l-6 -20" stroke="${INK}" stroke-width="2.5" fill="none"/>
  </svg>`,
  arrosoir: `<svg viewBox="0 0 100 100">
    <path d="M24 40 h40 v38 q0 6 -6 6 h-28 q-6 0 -6 -6 Z" fill="${VERT}" stroke="${VERT_D}" stroke-width="2"/>
    <path d="M64 46 l22 -12 -4 -6 -20 10 Z" fill="${VERT_D}"/>
    <path d="M24 44 q-14 6 -6 26" fill="none" stroke="${VERT_D}" stroke-width="5"/>
    <rect x="30" y="30" width="28" height="8" rx="3" fill="${VERT_D}"/>
  </svg>`,
  chapeau: `<svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="64" rx="42" ry="14" fill="#e0c893"/>
    <path d="M28 62 q2 -34 22 -34 q20 0 22 34 Z" fill="#d8bd82"/>
    <path d="M28 56 q22 8 44 0" fill="none" stroke="${BRIQUE}" stroke-width="6"/>
  </svg>`,
  seau: `<svg viewBox="0 0 100 100">
    <path d="M26 38 h48 l-6 46 h-36 Z" fill="${METAL}" stroke="${METAL_D}" stroke-width="2"/>
    <rect x="22" y="32" width="56" height="8" rx="4" fill="${METAL_D}"/>
    <path d="M28 34 q22 -26 44 0" fill="none" stroke="${METAL_D}" stroke-width="4"/>
  </svg>`,
  boite: `<svg viewBox="0 0 100 100">
    <rect x="14" y="30" width="72" height="58" rx="4" fill="#93ad83" stroke="#2d4a23" stroke-width="2"/>
    <rect x="8" y="18" width="84" height="16" rx="3" fill="#2d4a23"/>
    <rect x="46" y="18" width="8" height="70" fill="${GOLD}"/>
  </svg>`,
};
