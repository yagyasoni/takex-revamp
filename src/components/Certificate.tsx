"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { certificate } from "@/content/site";

/** The sample certificate from takex.ai. It assesses itself once as it arrives. */
export default function Certificate() {
  const root = useRef<HTMLElement>(null);
  const score = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(root);
      const v = { n: 0 };
      gsap.set(q(".cert-bar b"), { scaleX: 0 });
      if (score.current) score.current.textContent = "0.0";
      gsap
        .timeline({ scrollTrigger: { trigger: q(".cert")[0], start: "top 75%", once: true } })
        .to(v, {
          n: certificate.overall,
          duration: 2.4,
          ease: "power2.out",
          onUpdate: () => {
            if (score.current) score.current.textContent = v.n.toFixed(1);
          },
        })
        .to(q(".cert-bar b"), { scaleX: 1, duration: 1.8, ease: "power2.inOut", stagger: 0.2 }, 0.1);
    },
    { scope: root }
  );

  return (
    <section className="s-black band full two-col cert-band" ref={root}>
      <div>
        <div className="p-m">( Certificate of Readiness™ )</div>
        <h2 className="h1-home report-title" data-letters>
          Certification is
          <br />
          earned, not bought.
        </h2>
      </div>
      <div className="cert-wrap" data-r>
        <div className="cert-glow" aria-hidden />
        <div className="cert">
          <div className="cert-head">
            <div>
              <div className="cert-kicker">Certificate of Readiness™</div>
              <div className="cert-name">{certificate.company}</div>
              <div className="cert-sub">{certificate.sector}</div>
            </div>
            <span className="cert-pill">Issued</span>
          </div>
          <div className="cert-overall">
            <div>
              <div className="cert-label">Overall readiness</div>
              <div className="cert-score">
                <span ref={score}>{certificate.overall.toFixed(1)}</span>
                <small>/ 10</small>
              </div>
            </div>
            <span className="cert-standing">{certificate.standing}</span>
            <i className="cert-bar">
              <b style={{ width: `${certificate.overall * 10}%` }} />
            </i>
          </div>
          <ul className="cert-rows">
            {certificate.rows.map((r) => (
              <li key={r.name}>
                <div>
                  <span>{r.name}</span>
                  <b>{r.score.toFixed(1)}</b>
                </div>
                <i className="cert-bar">
                  <b style={{ width: `${r.score * 10}%` }} />
                </i>
              </li>
            ))}
          </ul>
          <div className="cert-foot">
            <span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.500-7-10V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Verified by <b>Ambrose AI</b>
            </span>
            <span>{certificate.date}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
