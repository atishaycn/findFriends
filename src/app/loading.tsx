export default function Loading() {
  return (
    <main className="paper-grid min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="ink-panel flex flex-col items-center gap-4 px-8 py-10 text-center">
          <div className="h-3 w-20 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-accent" />
          </div>
          <p className="text-sm uppercase tracking-[0.28em] text-ink/52">
            Drawing connections...
          </p>
        </div>
      </div>
    </main>
  );
}
