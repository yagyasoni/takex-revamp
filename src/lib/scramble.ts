/** Splits text nodes into per-character spans so each glyph can animate alone. */
export function splitChars(el: HTMLElement) {
  const out: { span: HTMLSpanElement; original: string }[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent ?? "") {
        if (ch === " " || ch === " " || ch === "\n") {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = ch;
        frag.appendChild(span);
        out.push({ span, original: ch });
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      [...node.childNodes].forEach(walk);
    }
  };
  walk(el);
  return out;
}
