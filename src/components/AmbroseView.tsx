import AmbroseStories from "./AmbroseStories";

export default function AmbroseView() {
  return (
    <section className="s-white band full two-col ambrose-v2">
      <div>
        <div className="p-m">( Ambrose AI )</div>
        <h2 className="h1-home report-title" data-letters>
          Ambrose sees what investors see. <span className="is-ember">Then tells you.</span>
        </h2>
      </div>
      <AmbroseStories />
    </section>
  );
}
