export function Button({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "line" }) {
  return (
    <a className={`btn is-${variant}`} href={href} target="_top">
      <span>{children}</span>
      <span className="arrow-w">
        <span className="line-arrow" />
        <span className="shape-arrow" />
      </span>
    </a>
  );
}

export function Butterfly({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/butterfly.png" alt="" className={`butterfly ${className}`} />;
}

export function Wordmark({ markClass = "" }: { markClass?: string }) {
  return (
    <div className="wordmark" role="img" aria-label="TakeX">
      {"TakeX".split("").map((l, i) => (
        <span className="letter-clip" key={i}>
          <span className="letter" data-letter data-x={l === "X" ? "" : undefined}>
            {l}
          </span>
        </span>
      ))}
      <span className="mark" data-mark>
        <Butterfly className={markClass} />
      </span>
    </div>
  );
}
