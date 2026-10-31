import { ambrose } from "@/content/site";

export default function Ambrose() {
  return (
    <section className="s-white band full two-col ambrose">
      <div>
        <div className="p-m">( Ambrose AI )</div>
        <h2 className="h1-home report-title" data-letters>
          Ambrose sees what investors see. <span className="is-ember">Then tells you.</span>
        </h2>
      </div>
      <ol className="ambrose-list" data-r>
        {ambrose.map((a, i) => (
          <li key={a}>
            <span className="ambrose-num">0{i + 1}</span>
            <span>{a}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
