// Glisser-déposer en pointer events (souris, doigt, stylet) avec détection
// du simple « tap ». Partagé par le Puzzle de phrases et Dans la bonne case.

const DRAG_THRESHOLD = 8; // px de mouvement avant de considérer un glisser

/**
 * Rend `el` déplaçable.
 *  - onTap()                         : relâché sans bouger
 *  - onDragStart()                   : le glisser commence
 *  - onDragMove(x, y)                : position du pointeur (viewport)
 *  - onDrop(x, y, cancelled)         : relâché après un glisser
 *  - ghost (défaut true)             : l'élément lui-même suit le pointeur en
 *    position fixed, un espace réservé garde sa place dans le flux.
 */
export function makeDraggable(el, { onTap, onDragStart, onDragMove, onDrop, ghost = true } = {}) {
  el.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const rect = el.getBoundingClientRect();
    const offX = startX - rect.left, offY = startY - rect.top;
    let dragging = false;
    let placeholder = null;

    const onMove = (ev) => {
      if (!dragging) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
        dragging = true;
        if (ghost) {
          placeholder = document.createElement(el.tagName);
          placeholder.className = el.className;
          placeholder.style.visibility = "hidden";
          placeholder.style.width = `${rect.width}px`;
          placeholder.style.height = `${rect.height}px`;
          el.after(placeholder);
          el.classList.add("dragging");
          el.style.width = `${rect.width}px`;
        }
        onDragStart?.();
      }
      if (ghost) {
        el.style.left = `${ev.clientX - offX}px`;
        el.style.top = `${ev.clientY - offY}px`;
      }
      onDragMove?.(ev.clientX, ev.clientY);
    };

    const onUp = (ev) => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      try { el.releasePointerCapture(e.pointerId); } catch { /* déjà relâché */ }
      if (!dragging) { onTap?.(); return; }
      if (ghost) {
        el.classList.remove("dragging");
        el.style.left = el.style.top = el.style.width = "";
        placeholder?.remove();
      }
      onDrop?.(ev.clientX, ev.clientY, ev.type === "pointercancel");
    };

    try { el.setPointerCapture(e.pointerId); } catch { /* pointeur inconnu : on suit sans capture */ }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  });
}

/** Premier élément sous (x, y) qui correspond au sélecteur (ignore l'élément glissé). */
export function dropTargetAt(x, y, selector) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.classList?.contains("dragging")) continue;
    const hit = el.closest?.(selector);
    if (hit) return hit;
  }
  return null;
}
