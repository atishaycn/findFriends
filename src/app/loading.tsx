export default function Loading() {
  return (
    <main className="app-shell">
      <div className="page-frame flex min-h-[100dvh] items-center justify-center">
        <div className="glass-panel flex w-full max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
          <div className="h-3 w-20 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-[rgba(18,23,20,0.52)]">
            Drawing connections...
          </p>
        </div>
      </div>
    </main>
  );
}
