import React from "react";

/**
 * Profile-only element blocker.
 * Hold Alt (Option on Mac) and click ANY element to hide it.
 * We generate a stable CSS selector, store it in localStorage,
 * and re-apply on future renders + remounts.
 */
type Props = {
  storageKey?: string; // localStorage key namespace
};

const DEFAULT_KEY = "dropsource.profile.blocklist";

function buildSelector(el: Element): string {
  // Prefer ID when present
  if ((el as HTMLElement).id) return `#${CSS.escape((el as HTMLElement).id)}`;

  // Otherwise build a short, fairly-stable path using classes and nth-child
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && parts.length < 6 && node.nodeType === 1 && node.tagName.toLowerCase() !== "html") {
    const tag = node.tagName.toLowerCase();
    const id = (node as HTMLElement).id;
    const classList = Array.from((node as HTMLElement).classList).slice(0, 3); // limit for stability

    let seg = tag;
    if (id) {
      seg += `#${CSS.escape(id)}`;
      parts.unshift(seg);
      break;
    }
    if (classList.length) seg += "." + classList.map(c => CSS.escape(c)).join(".");
    // compute nth-child for uniqueness among siblings of same tag
    let nth = 1;
    let sib = node.previousElementSibling;
    while (sib) {
      if (sib.tagName.toLowerCase() === tag) nth++;
      sib = sib.previousElementSibling;
    }
    seg += `:nth-of-type(${nth})`;
    parts.unshift(seg);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

function loadList(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]") as string[]; } catch { return []; }
}
function saveList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(list))));
}

export default function ElementBlocklist({ storageKey = DEFAULT_KEY }: Props) {
  const key = storageKey;

  React.useEffect(() => {
    const hideBySelectors = () => {
      const selectors = loadList(key);
      selectors.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            (el as HTMLElement).style.setProperty("display", "none", "important");
            (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
            (el as HTMLElement).setAttribute("data-profile-hidden", "1");
          });
        } catch {}
      });
    };

    const onAltClick = (e: MouseEvent) => {
      if (!e.altKey) return; // Alt/Option + click to hide
      const target = e.target as Element;
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();

      const selector = buildSelector(target);
      const list = loadList(key);
      if (!list.includes(selector)) {
        list.push(selector);
        saveList(key, list);
      }
      // Hide immediately
      (target as HTMLElement).style.setProperty("display", "none", "important");
      (target as HTMLElement).style.setProperty("visibility", "hidden", "important");
      (target as HTMLElement).setAttribute("data-profile-hidden", "1");
      // Small toast
      console.log(`[ElementBlocklist] Hidden and saved selector: ${selector}`);
    };

    // Initial pass + keep it enforced
    hideBySelectors();
    const mo = new MutationObserver(hideBySelectors);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("click", onAltClick, true);

    return () => {
      mo.disconnect();
      window.removeEventListener("click", onAltClick, true);
    };
  }, [key]);

  return null;
}

