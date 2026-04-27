import styles from "./canopy.module.css";

type Node = {
  name: string;
  role: string;
  note: string;
  top: string;
  left: string;
};

const nodes: Node[] = [
  {
    name: "Mina",
    role: "starts the round",
    note: "Sets the rule and opens the graph.",
    top: "8%",
    left: "24%",
  },
  {
    name: "Theo",
    role: "passes first",
    note: "Sends the turn toward the quieter branch.",
    top: "24%",
    left: "66%",
  },
  {
    name: "Rina",
    role: "holds the pivot",
    note: "Keeps the middle of the canopy hidden until close.",
    top: "45%",
    left: "16%",
  },
  {
    name: "Noor",
    role: "unexpected return",
    note: "Comes back late enough to change the reveal.",
    top: "58%",
    left: "73%",
  },
  {
    name: "Jules",
    role: "final handoff",
    note: "Locks the ending pattern into place.",
    top: "80%",
    left: "40%",
  },
];

const principles = [
  "Editorial pacing instead of dashboard density.",
  "A pale paper field with one dark green accent.",
  "The graph feels hidden, then legible, then social.",
];

const walkthrough = [
  {
    step: "01",
    title: "Name the round",
    body: "A single rule anchors the whole page. Typography does the heavy lifting first.",
  },
  {
    step: "02",
    title: "Watch the canopy grow",
    body: "Early sends appear as soft traces, not full ownership maps. The scene stays suspenseful.",
  },
  {
    step: "03",
    title: "Close and reveal",
    body: "When the round ends, the branches resolve into one legible friend graph with who-passed-to-whom clarity.",
  },
];

const captions = [
  "Pale field. Dark ink. One strong accent.",
  "Large type frames the room before details enter.",
  "Relationship structure arrives as atmosphere first, data second.",
];

export function CanopyConcept() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Friend Graph / Concept A / Canopy</p>
          <h1 className={styles.title}>
            The graph opens like an editorial spread instead of a utilitarian tool.
          </h1>
          <p className={styles.lede}>
            Concept A treats the reveal as a light, spacious social artifact. It is quiet
            on purpose: pale background, strong headlines, restrained color, and a graph
            that feels discovered rather than dumped on screen.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#demo">
              View the reveal
            </a>
            <a className={styles.secondaryAction} href="#principles">
              Read the framing
            </a>
          </div>
        </div>

        <aside className={styles.heroPanel} id="demo" aria-label="Friend graph demo preview">
          <div className={styles.panelTopline}>
            <span>Round 05</span>
            <span>Rule: send it to the person who made you laugh first</span>
          </div>

          <div className={styles.graphStage}>
            <svg
              className={styles.graphLines}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M26 11 C35 16, 54 18, 66 25" />
              <path d="M26 11 C20 25, 18 36, 16 47" />
              <path d="M16 47 C32 45, 56 47, 73 60" />
              <path d="M66 25 C70 36, 72 48, 73 60" />
              <path d="M16 47 C23 64, 31 73, 40 82" />
              <path d="M73 60 C65 72, 52 78, 40 82" />
            </svg>

            {nodes.map((node) => (
              <article
                key={node.name}
                className={styles.node}
                style={{ top: node.top, left: node.left }}
              >
                <p className={styles.nodeName}>{node.name}</p>
                <p className={styles.nodeRole}>{node.role}</p>
                <p className={styles.nodeNote}>{node.note}</p>
              </article>
            ))}
          </div>

          <div className={styles.panelFoot}>
            <div>
              <span className={styles.footLabel}>Reveal mode</span>
              <p>Soft branches during play, full graph only when the round closes.</p>
            </div>
            <div>
              <span className={styles.footLabel}>Visual note</span>
              <p>More magazine spread than product dashboard.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.ribbons} aria-label="Concept framing">
        {captions.map((caption) => (
          <p key={caption} className={styles.ribbon}>
            {caption}
          </p>
        ))}
      </section>

      <section className={styles.editorialSection} id="principles">
        <div className={styles.sectionLead}>
          <p className={styles.sectionLabel}>Why this direction works</p>
          <h2 className={styles.sectionTitle}>
            It makes a social mechanic feel intentional, warm, and worth lingering on.
          </h2>
        </div>

        <div className={styles.principleLayout}>
          <div className={styles.principlesList}>
            {principles.map((principle) => (
              <div key={principle} className={styles.principleRow}>
                <span className={styles.principleMark} />
                <p>{principle}</p>
              </div>
            ))}
          </div>

          <div className={styles.pullQuote}>
            <p>
              The graph should feel like a discovered pattern between friends, not a
              transactional receipt of who tapped whom.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.sequenceSection}>
        <div className={styles.sequenceIntro}>
          <p className={styles.sectionLabel}>Landing to reveal</p>
          <h2 className={styles.sectionTitle}>A simple page flow with editorial rhythm.</h2>
        </div>

        <div className={styles.sequenceGrid}>
          {walkthrough.map((item) => (
            <article key={item.step} className={styles.sequenceItem}>
              <span className={styles.sequenceStep}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bottomBand}>
        <div className={styles.bottomIntro}>
          <p className={styles.sectionLabel}>Design summary</p>
          <h2 className={styles.sectionTitle}>
            Airy enough for a first impression, precise enough for a real product demo.
          </h2>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>01</span>
            <p className={styles.metricLabel}>accent color</p>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>02</span>
            <p className={styles.metricLabel}>type families</p>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>100%</span>
            <p className={styles.metricLabel}>self-contained subtree</p>
          </div>
        </div>
      </section>
    </main>
  );
}
