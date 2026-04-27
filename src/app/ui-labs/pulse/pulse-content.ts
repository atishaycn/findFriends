export type PulseNode = {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  color: string;
  delay: number;
};

export const pulseNodes: PulseNode[] = [
  {
    id: "starter",
    label: "Starter",
    role: "Rule set",
    x: 12,
    y: 18,
    color: "#ff6b3d",
    delay: 0,
  },
  {
    id: "north",
    label: "Aya",
    role: "First send",
    x: 36,
    y: 12,
    color: "#f5ebd5",
    delay: 0.2,
  },
  {
    id: "studio",
    label: "Pulse",
    role: "Reveal core",
    x: 56,
    y: 28,
    color: "#d6ff57",
    delay: 0.4,
  },
  {
    id: "east",
    label: "Jin",
    role: "Branch",
    x: 82,
    y: 18,
    color: "#59c1ff",
    delay: 0.65,
  },
  {
    id: "south",
    label: "Rae",
    role: "Return lane",
    x: 74,
    y: 66,
    color: "#ff6b3d",
    delay: 0.85,
  },
  {
    id: "west",
    label: "Leo",
    role: "Quiet node",
    x: 24,
    y: 62,
    color: "#f5ebd5",
    delay: 1.05,
  },
  {
    id: "close",
    label: "Loop",
    role: "Valid close",
    x: 48,
    y: 84,
    color: "#d6ff57",
    delay: 1.25,
  },
];

export const pulseEdges = [
  ["starter", "north"],
  ["north", "studio"],
  ["studio", "east"],
  ["studio", "west"],
  ["east", "south"],
  ["west", "close"],
  ["south", "close"],
] as const;

export const pulsePrompts = [
  {
    label: "Name your loop or set a rule",
    note: "Startup frame",
    detail: "The launch moment reads like a command center instead of a form.",
  },
  {
    label: "Send one fresh link into the group chat",
    note: "Traffic control",
    detail: "The board stays focused on one clear handoff, then waits for movement.",
  },
  {
    label: "Hold the reveal until the return is real",
    note: "Suspense layer",
    detail: "The closing line brightens only when the full shape can actually unlock.",
  },
];

export const pulseSignals = [
  {
    title: "Kinetic startup",
    body: "The hero behaves like a launch board, not a marketing panel.",
    accent: "#ff6b3d",
  },
  {
    title: "Bold color planes",
    body: "Cream, ember, acid, and signal-blue stay blocked into clear zones.",
    accent: "#d6ff57",
  },
  {
    title: "Reveal-first motion",
    body: "The graph breathes, the ticker runs, and the loop lane stays live.",
    accent: "#59c1ff",
  },
];

export const pulseMilestones = [
  {
    title: "Stage the rule",
    body: "The first move is loud, fast, and poster-clear.",
  },
  {
    title: "Keep the chain visible",
    body: "Handoffs feel tracked in real time without showing the whole map.",
  },
  {
    title: "Snap into reveal",
    body: "The last edge lands with a visible shift in weight and color.",
  },
];

export const pulseMetrics = [
  { label: "Live invites", value: "08" },
  { label: "Pending close", value: "01" },
  { label: "Signal loops", value: "94%" },
];

export const pulseTicker = [
  "Friend Graph",
  "Concept D",
  "Kinetic startup demo",
  "Bold color blocking",
  "Reveal-first motion",
  "Self-contained route",
];
