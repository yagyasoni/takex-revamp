// All landing-page copy lives here. Wording comes from takex.ai.
const live = "https://www.takex.ai";

export const links = {
  start: `${live}/`,
  investors: `${live}/investors`,
};

export const nav = [
  { label: "Founders", href: `${live}/founders` },
  { label: "Investors", href: links.investors },
  { label: "Pricing", href: `${live}/pricing` },
  { label: "Insights", href: `${live}/insights` },
];

// The sample certificate shown on takex.ai.
export const certificate = {
  company: "Orbis Technologies",
  sector: "Deep-tech · Series A",
  overall: 8.4,
  standing: "High Readiness",
  date: "Aug 2026",
  rows: [
    { name: "Team & Execution Capability", score: 8.4 },
    { name: "Problem & Market Opportunity", score: 8.7 },
    { name: "Traction & Validation", score: 7.2 },
    { name: "Competitive Landscape & Defensibility", score: 7.8 },
  ],
};

// From the "What you'll know" section on takex.ai.
export const ambrose = [
  "Whether your startup is ready.",
  "What's costing you conviction.",
  "What's actually working.",
  "Measured for your stage.",
  "What to strengthen first.",
];

// From the "What you'll know" section on takex.ai, shown one at a time.
export const reads = [
  { tag: "Readiness", visual: "gauge", title: "Whether your startup is ready.", body: "A clear readiness score across the 10 dimensions investors weigh, and the reasoning behind every one." },
  { tag: "Gaps", visual: "gaps", title: "What's costing you conviction.", body: "The gaps, the missing proof points, the claims that raise a flag. Named, explained, and put in order." },
  { tag: "Strengths", visual: "bars", title: "What's actually working.", body: "Your real strengths, the parts investors remember. Not flattery. Evidence." },
  { tag: "Stage", visual: "track", title: "Measured for your stage.", body: "What good looks like for your stage in your market, not a Series B in San Francisco." },
  { tag: "Priority", visual: "order", title: "What to strengthen first.", body: "A sequence you can act on, not a list of everything wrong." },
];

// The ten dimensions listed on takex.ai/founders.
export const dimensions = [
  "Team & execution capability",
  "Problem & market opportunity",
  "Solution & product value",
  "Traction & validation",
  "Business model & monetisation",
  "Financials & funding",
  "Competitive landscape & defensibility",
  "Go-to-market strategy",
  "Vision & narrative",
  "Risks & mitigation",
];

export const glitch = {
  line: "seen on merit",
  final: ["A world where funding follows", "merit, not geography."],
};

export const steps = [
  { lead: "Get your", key: "Signal Report." },
  { lead: "Get your", key: "full assessment." },
  { lead: "Get certified.", key: "Get seen." },
];
