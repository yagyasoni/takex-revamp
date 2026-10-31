import { steps } from "@/content/site";

/** Small looping prototypes: the report gets read, the scores move, the certificate is verified. */
const PROTOS = [
  <div className="proto-report" key="report" aria-hidden>
    <i />
    <i />
    <i />
    <i />
    <b />
  </div>,
  <div className="proto-bars" key="bars" aria-hidden>
    <i />
    <i />
    <i />
    <i />
    <i />
  </div>,
  <svg className="proto-verified" key="verified" viewBox="0 0 48 48" fill="none" aria-hidden>
    <path className="shield" d="M24 5l15 6v11c0 10-6.500 17.500-15 21-8.500-3.500-15-11-15-21V11z" />
    <path className="check" d="M16.500 24.500l5.500 5.500 10-11" />
  </svg>,
];

export default function Steps() {
  return (
    <section className="s-black band full spread">
      <h2 className="h1-home" data-letters>
        From deck to
        <br />
        certified, in 3 steps.
      </h2>
      <ol className="steps">
        {steps.map((s, i) => (
          <li className="step" key={s.key} data-r>
            <div className="proto">{PROTOS[i]}</div>
            <div className="step-text">
              <span className="step-num">0{i + 1}</span>
              <h3 className="step-title">
                <span>{s.lead}</span> {s.key}
              </h3>
              <span className="step-track" style={{ "--i": i } as React.CSSProperties} aria-hidden>
                <b />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
