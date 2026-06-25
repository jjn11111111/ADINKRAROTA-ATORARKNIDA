import { AuthProvider } from "../auth/provider";
import { SpinCycle } from "../components/spin-cycle";

export default function Home() {
  return (
    <AuthProvider>
      <main className="site-shell">
        <section className="hero">
          <p className="eyebrow">Adinkrarota production</p>
          <h1>Tarot, Adinkra, and timing in one clean working app.</h1>
          <p>
            The production surface is now centered on Spin Cycle. Public visitors receive the
            case-study narrative; members receive the interactive workflow backed by a protected API.
          </p>
          <a className="text-link" href="/index.html">
            Open the legacy deck archive
          </a>
        </section>

        <SpinCycle />
      </main>
    </AuthProvider>
  );
}
