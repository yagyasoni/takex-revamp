/** Wraps each character in an inline span; words still wrap normally, so the layout never shifts. */
export function splitLetters(el: HTMLElement) {
  const out: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent ?? "") {
        if (/\s/.test(ch)) {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        const span = document.createElement("span");
        span.textContent = ch;
        frag.appendChild(span);
        out.push(span);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      [...node.childNodes].forEach(walk);
    }
  };
  walk(el);
  return out;
}
