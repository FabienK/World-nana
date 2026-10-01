// Synthèse et reconnaissance vocales partagées (Web Speech API).
// fr-FR, une seule voix à la fois (cancel() avant chaque lecture), voix
// choisie dans les réglages ou meilleure voix française détectée.

import { getSettings } from "./storage.js";

const synth = window.speechSynthesis;
export const ttsAvailable = Boolean(synth);

// Classement : voix « premium » et voix naturelles connues d'abord, voix
// fantaisie d'Apple (Eddy, Grandma, Rocko…) en dernier.
const PREMIUM = /premium|enhanced|améliorée|neural|natural|google|microsoft|siri/i;
const KNOWN_GOOD = /^(thomas|amélie|amelie|audrey|aurélie|aurelie|marie|daniel|nicolas|chantal|virginie|julie|paul|léa|lea|denise|henri)\b/i;
const NOVELTY = /^(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bahh|bells|boing|bubbles|cellos|fred|good news|bad news|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox)\b/i;

function rank(v) {
  if (NOVELTY.test(v.name)) return 3;
  if (PREMIUM.test(v.name)) return 0;
  if (KNOWN_GOOD.test(v.name)) return 1;
  return 2;
}

/** Voix françaises disponibles, les meilleures d'abord. */
export function listVoices() {
  if (!synth) return [];
  return synth
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("fr"))
    .sort((a, b) => {
      const ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      const fa = a.lang === "fr-FR" ? 0 : 1, fb = b.lang === "fr-FR" ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return a.name.localeCompare(b.name, "fr");
    });
}

/** Appelle cb() maintenant et à chaque fois que la liste des voix change. */
export function onVoicesReady(cb) {
  if (!synth) return;
  cb(listVoices());
  synth.addEventListener?.("voiceschanged", () => cb(listVoices()));
}

function currentVoice() {
  const voices = listVoices();
  const wanted = getSettings().voiceURI;
  return voices.find((v) => v.voiceURI === wanted) || voices[0] || null;
}

/**
 * Lit un texte. options : rate, pitch, voiceURI (force une voix),
 * onBoundary(charIndex), onEnd().
 */
export function speak(text, { rate, pitch = 1, voiceURI, onBoundary, onEnd } = {}) {
  if (!synth) return null;
  stop();
  const msg = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, " ").trim());
  msg.lang = "fr-FR";
  msg.rate = rate ?? getSettings().rate ?? 0.9;
  msg.pitch = pitch;
  const voice = voiceURI ? listVoices().find((v) => v.voiceURI === voiceURI) : currentVoice();
  if (voice) msg.voice = voice;
  if (onBoundary) msg.onboundary = (e) => onBoundary(e.charIndex, e);
  if (onEnd) msg.onend = onEnd;
  synth.speak(msg);
  return msg;
}

/** Lecture conditionnelle : ne parle que si « voix automatique » est activée. */
export function say(text, opts) {
  return getSettings().voiceAuto ? speak(text, opts) : null;
}

export function stop() {
  if (synth && (synth.speaking || synth.pending)) synth.cancel();
}

// ----- Reconnaissance vocale (Chrome / Edge / Safari récent) -------------

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
export const sttAvailable = Boolean(Recognition);

/** Écoute une phrase courte et appelle onResult(texte). null si non supporté. */
export function listen({ onResult, onError, onEnd } = {}) {
  if (!Recognition) return null;
  const rec = new Recognition();
  rec.lang = "fr-FR";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => onResult?.(e.results[0][0].transcript);
  rec.onerror = (e) => onError?.(e.error);
  rec.onend = () => onEnd?.();
  try {
    rec.start();
  } catch (err) {
    onError?.(err.message);
    return null;
  }
  return { stop: () => rec.stop() };
}
