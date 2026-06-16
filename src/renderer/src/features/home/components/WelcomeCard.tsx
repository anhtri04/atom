interface WelcomeCardProps {
  appVersion: string
}

const stackItems = ['Electron', 'Vite', 'React', 'TypeScript', 'TailwindCSS']

export function WelcomeCard({ appVersion }: WelcomeCardProps): JSX.Element {
  return (
    <div className="w-full rounded-3xl border border-slate-700/70 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/40 backdrop-blur">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
        Electron Starter
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Build desktop features with a modern React stack.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
        This app is initialized with a feature-based renderer structure, secure preload bridge,
        strict TypeScript, Vite bundling, and TailwindCSS styling.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {stackItems.map((item) => (
          <span
            key={item}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
        <span className="text-slate-500">App version:</span>{' '}
        <span className="font-mono text-cyan-200">{appVersion}</span>
      </div>
    </div>
  )
}
