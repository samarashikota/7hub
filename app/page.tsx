import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-stub mb-3">
            Seu arquivo pessoal · Sessão encerrada
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-wide text-ink">
            Todo filme que
            <br />
            você já assistiu,
            <br />
            <span className="text-marquee">guardado num ingresso.</span>
          </h1>
          <p className="mt-6 text-ink-muted max-w-md leading-relaxed">
            Cadastre-se, busque o título e a Sessão Contínua traz a capa oficial e mostra em
            qual streaming ele está disponível agora — você só precisa dar a nota, se quiser.
          </p>
          <div className="mt-8 flex gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-marquee text-reel-bg font-semibold px-6 py-3 hover:bg-marquee-soft transition"
              >
                Ir para meus ingressos
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-full bg-marquee text-reel-bg font-semibold px-6 py-3 hover:bg-marquee-soft transition"
                >
                  Criar minha conta
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-reel-line px-6 py-3 text-ink hover:border-marquee transition"
                >
                  Já tenho conta
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="ticket max-w-sm mx-auto shadow-2xl shadow-black/40">
          <div className="stub-notch" style={{ top: "-7px" }} />
          <div className="stub-notch" style={{ bottom: "-7px" }} />
          <div className="bg-reel-card2 rounded-l-[10px] flex items-center justify-center p-2">
            <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-reel-line to-reel-card2 flex items-center justify-center">
              <span className="font-display text-3xl text-ink-faint">?</span>
            </div>
          </div>
          <div className="p-5 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-teal-stub">
                Admissão única
              </p>
              <p className="font-display text-2xl text-ink leading-tight mt-1">
                Próximo da sua lista
              </p>
              <p className="text-ink-faint text-sm mt-2">2026 · Assistido</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-ink-muted">Streaming: —</span>
              <span className="font-mono text-xs text-marquee">★ —</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <Feature
          eyebrow="Bilheteria"
          title="Cadastro seguro"
          text="Senha protegida com hash (bcrypt) e sessão autenticada — só você acessa o seu arquivo."
        />
        <Feature
          eyebrow="Cartaz"
          title="Capa oficial automática"
          text="Ao buscar o título, a capa e a sinopse vêm direto da base do TMDB."
        />
        <Feature
          eyebrow="Onde assistir"
          title="Streaming atual"
          text="Mostramos em quais serviços o título está disponível no Brasil, agora."
        />
      </section>
    </div>
  );
}

function Feature({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="border border-reel-line rounded-lg p-5 bg-reel-card">
      <p className="font-mono text-[10px] uppercase tracking-wider text-teal-stub">{eyebrow}</p>
      <h3 className="font-display text-xl text-ink mt-1">{title}</h3>
      <p className="text-ink-muted text-sm mt-2 leading-relaxed">{text}</p>
    </div>
  );
}
