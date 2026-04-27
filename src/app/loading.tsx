export default function Loading() {
  return (
    <main className="page-shell">
      <div className="content-wrap flex min-h-[100dvh] items-center justify-center py-12">
        <section className="glass-panel w-full max-w-3xl p-8 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div className="skeleton h-4 w-28 rounded-full" />
            <div className="skeleton h-9 w-32 rounded-full" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="skeleton h-12 w-4/5 rounded-2xl" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-5/6 rounded-full" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="skeleton min-h-72 rounded-[2rem]" />
            <div className="space-y-4">
              <div className="skeleton h-28 rounded-[1.75rem]" />
              <div className="skeleton h-28 rounded-[1.75rem]" />
              <div className="skeleton h-28 rounded-[1.75rem]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
