import { Nav } from '@/components/nav'
import { DataExplorer } from '@/components/data-explorer'
import { Footer } from '@/components/footer'

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <a
        className="sr-only hover:underline focus-visible:not-sr-only focus-visible:absolute focus-visible:top-0 focus-visible:left-0 focus-visible:bg-accent focus-visible:px-4 focus-visible:py-3 focus-visible:text-accent-foreground"
        href="#main"
      >
        Skip to content
      </a>

      {/* Navbar */}
      <Nav />

      {/* Main Content */}
      <main id="main" className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <DataExplorer />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
