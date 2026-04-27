import Link from "next/link";
import {
  ArrowUpRight,
  CircleDashed,
  Graph,
  LinkSimpleHorizontal,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import styles from "./monolith.module.css";

const stats = [
  { value: "14", label: "people threaded into the chain" },
  { value: "01", label: "final snap that reveals the graph" },
  { value: "06", label: "warning states before the loop closes" },
];

const rails = [
  {
    step: "01",
    title: "Starter writes the rule",
    detail: "One clear prompt. One share link. No dashboard ceremony.",
  },
  {
    step: "02",
    title: "Friends pass it forward",
    detail: "Each claim adds one new edge and keeps the larger graph hidden.",
  },
  {
    step: "03",
    title: "Closure unlocks the poster",
    detail: "A valid closing edge flips the whole round into public geometry.",
  },
];

const roster = [
  ["Sunny", "origin"],
  ["Mina", "north branch"],
  ["Dev", "east branch"],
  ["Jules", "south branch"],
  ["Kai", "west branch"],
  ["Rae", "closing edge"],
] as const;

export function ConceptFMonolith() {
  return (
    <main className={styles.page}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.canvas}>
        <section className={styles.hero}>
          <div className={styles.posterEdge} aria-hidden="true" />
          <div className={styles.heroTopline}>
            <span className={styles.kicker}>Friend Graph</span>
            <span className={styles.kicker}>UI Concept F</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.year}>2026</p>
              <h1 className={styles.headline}>
                The round should feel like a public poster, not a polite app.
              </h1>
              <p className={styles.summary}>
                Concept F turns the finished graph into a stark printed artifact:
                heavy borders, oversized labels, and one warm accent marking the
                closing edge.
              </p>

              <div className={styles.actionRow}>
                <Link href="/studio" className={styles.primaryAction}>
                  Open studio
                  <ArrowUpRight size={18} weight="bold" />
                </Link>
                <Link href="/" className={styles.secondaryAction}>
                  Return home
                </Link>
              </div>
            </div>

            <aside className={styles.heroPanel}>
              <div className={styles.panelHeader}>
                <Graph size={22} weight="bold" />
                <span>Poster behavior</span>
              </div>
              <ul className={styles.panelList}>
                <li>Full graph remains hidden until a valid closing link lands.</li>
                <li>Warnings read as hard stamps, not soft helper text.</li>
                <li>Every section uses strong geometry before decoration.</li>
              </ul>
            </aside>
          </div>

          <div className={styles.statGrid}>
            {stats.map((stat) => (
              <article key={stat.label} className={styles.statBlock}>
                <span className={styles.statValue}>{stat.value}</span>
                <p className={styles.statLabel}>{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.middleGrid}>
          <article className={styles.blueprint}>
            <div className={styles.sectionTopline}>
              <span className={styles.sectionLabel}>Signal path</span>
              <span className={styles.sectionMeta}>3 moves</span>
            </div>

            <div className={styles.railStack}>
              {rails.map((item) => (
                <div key={item.step} className={styles.railItem}>
                  <div className={styles.railIndex}>{item.step}</div>
                  <div>
                    <h2 className={styles.railTitle}>{item.title}</h2>
                    <p className={styles.railDetail}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.graphCard}>
            <div className={styles.sectionTopline}>
              <span className={styles.sectionLabel}>Reveal frame</span>
              <span className={styles.sectionMeta}>loop locked</span>
            </div>

            <div className={styles.graphFrame} aria-hidden="true">
              <div className={styles.gridLines} />
              <div className={`${styles.node} ${styles.nodeOrigin}`}>
                <span>01</span>
              </div>
              <div className={`${styles.node} ${styles.nodeA}`}>
                <span>02</span>
              </div>
              <div className={`${styles.node} ${styles.nodeB}`}>
                <span>03</span>
              </div>
              <div className={`${styles.node} ${styles.nodeC}`}>
                <span>04</span>
              </div>
              <div className={`${styles.node} ${styles.nodeD}`}>
                <span>05</span>
              </div>
              <div className={styles.edgeHorizontal} />
              <div className={styles.edgeVertical} />
              <div className={styles.edgeDiagonal} />
              <div className={styles.edgeClosing} />
              <div className={styles.closingStamp}>closure</div>
            </div>
          </article>
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.roster}>
            <div className={styles.sectionTopline}>
              <span className={styles.sectionLabel}>Printed roster</span>
              <span className={styles.sectionMeta}>participants</span>
            </div>

            <div className={styles.rosterTable}>
              {roster.map(([name, role], index) => (
                <div key={name} className={styles.rosterRow}>
                  <span className={styles.rosterIndex}>
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className={styles.rosterName}>{name}</span>
                  <span className={styles.rosterRole}>{role}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.notice}>
            <div className={styles.noticeStamp}>rule</div>
            <p className={styles.noticeText}>
              Direct back-sends do not count as a loop. They trigger a visible
              warning and the round keeps moving until a fresh closing edge appears.
            </p>

            <div className={styles.noticeGrid}>
              <div className={styles.noticeCard}>
                <SealCheck size={22} weight="fill" />
                <div>
                  <p className={styles.noticeTitle}>Counts as finish</p>
                  <p className={styles.noticeBody}>
                    A new connection closes the shape without returning straight back.
                  </p>
                </div>
              </div>

              <div className={styles.noticeCard}>
                <CircleDashed size={22} weight="bold" />
                <div>
                  <p className={styles.noticeTitle}>Only a warning</p>
                  <p className={styles.noticeBody}>
                    A sender tries to bounce directly to the branch they came from.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerRule} />
          <p className={styles.footerText}>Friend Graph concept study / brutalist poster system</p>
          <p className={styles.footerText}>
            <LinkSimpleHorizontal size={16} weight="bold" className={styles.footerIcon} />
            one accent, hard borders, no hidden chrome
          </p>
        </footer>
      </div>
    </main>
  );
}
