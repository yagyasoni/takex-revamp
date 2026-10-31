import { links, nav } from "@/content/site";
import { Button, Wordmark } from "./ui";

export default function Footer() {
  return (
    <footer className="s-black footer">
      <h2 className="h1-home" data-letters>
        See where your startup stands, in under 10 minutes.
      </h2>
      <div className="foot-row" data-r>
        <Button href={links.start} variant="solid">
          Start free
        </Button>
        <div className="foot-links p-m">
          {nav.map((n) => (
            <a key={n.label} href={n.href} target="_top">
              {n.label}
            </a>
          ))}
        </div>
      </div>
      <Wordmark />
    </footer>
  );
}
