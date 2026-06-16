import { useEffect, useState } from 'react'
import { WelcomeCard } from './components/WelcomeCard'

export function HomePage(): JSX.Element {
  const [appVersion, setAppVersion] = useState<string>('loading...')

  useEffect(() => {
    let isMounted = true

    window.electron.getAppVersion().then((version) => {
      if (isMounted) {
        setAppVersion(version)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-surface px-6 py-10 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <WelcomeCard appVersion={appVersion} />
      </section>
    </main>
  )
}
