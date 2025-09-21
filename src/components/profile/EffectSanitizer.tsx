import React from "react";

/**
 * Profile-only "UltraKill" for any lingering flair/badge/widget.
 * Removes (and keeps removing) ANY small floating node in the lower-right.
 * Hits fixed/absolute AND nested elements. Leaves other pages untouched.
 */
function isLowerRightSmall(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;

  // Skip the actual app/container roots
  const tag = el.tagName.toLowerCase();
  if (tag === "html" || tag === "body" || tag === "main") return false;

  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  // Consider "small" up to 200x200 so we catch blue-square widgets
  const isSmall = rect.width <= 200 && rect.height <= 200;
  if (!isSmall) return false;

  // Lower-right quadrant within 320px from each edge (more generous)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nearRight = (vw - rect.right) < 320;
  const nearBottom = (vh - rect.bottom) < 320;
  if (!(nearRight && nearBottom)) return false;

  // Overlay-ish: either positioned or high stacking… or clearly decorative
  const cs = getComputedStyle(el);
  const pos = cs.position;
  const zi  = parseInt(cs.zIndex || "0", 10);
  const overlayish = (pos === "fixed" || pos === "absolute" || zi >= 30);

  // Name hints (case-insensitive)
  const cls = (el.className || "").toString().toLowerCase();
  const id  = (el.id || "").toLowerCase();
  const namey = ["flair","spark","sparkle","cursor","trail","paw","confetti","burst","badge","fab","float"]
    .some(s => cls.includes(s) || id.includes(s));

  return overlayish || namey;
}

function sweep() {
  // Brutal sweep over a shallow subset first (faster)
  document.querySelectorAll<HTMLElement>("button,div,canvas,svg").forEach((el) => {
    if (isLowerRightSmall(el)) el.remove();
  });

  // If something is wrapped, sweep all nodes too (heavier, but safe)
  document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
    if (isLowerRightSmall(el)) el.remove();
  });
}

export default function EffectSanitizer() {
  React.useEffect(() => {
    // First blast
    sweep();

    // Keep blasting: late mounts / re-renders
    const mo = new MutationObserver(() => sweep());
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Safety: periodic sweep as a last resort
    const interval = window.setInterval(sweep, 500);

    return () => {
      mo.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}