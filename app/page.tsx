import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Capas do TMDB expandidas (Filmes e Séries aclamadas)
const samplePosters = [
  "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // Um Sonho de Liberdade
  "/8c4a8kE7PizaGQQnditMmI1xbRp.jpg", // Matrix
  "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", // O Senhor dos Anéis
  "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", // Vingadores
  "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // Batman: O Cavaleiro das Trevas
  "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", // Breaking Bad
  "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", // Game of Thrones
  "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", // Oppenheimer
  "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", // Dune
  "/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg", // Dark
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-stub mb-3">
            Seu arquivo pessoal
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-wide text-ink">
            Todo filme e série que
            <br />
            você já assistiu,
            <br />
            <span className="text-marquee">registrado.</span>
          </h1>
          <p className="mt-6 text-ink-muted max-w-md leading-relaxed">
            Cadastre-se, busque o título e o 7Hub traz a capa oficial e mostra em
            qual streaming ele está disponível agora - você também pode dar uma nota, se quiser.
          </p>
          <div className="mt-8 flex gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-marquee text-reel-bg font-semibold px-6 py-3 hover:bg-marquee-soft transition"
              >
                Ir para meu Hub
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
                FILME/SÉRIE
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

      {/* NOVO SLIDER DE CAPAS (DE PONTA A PONTA) */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-4">
        {/* Container para alinhar o texto com o resto do site */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            Explore milhares de títulos
          </p>
        </div>
        
        {/* O scroll de ponta a ponta com degradê nas duas pontas */}
        <div 
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-8 pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ 
            maskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)", 
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)" 
          }}
        >
          {samplePosters.map((path, i) => (
            <div
              key={i}
              // Tamanhos responsivos (120px mobile -> 180px desktop)
              className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] aspect-[2/3] shrink-0 snap-start rounded-lg overflow-hidden border border-reel-line shadow-lg bg-reel-card2 hover:-translate-y-2 hover:shadow-2xl hover:border-marquee transition-all duration-300"
            >
              <img
                // Atualizado para /w342 para as imagens não perderem qualidade em telas maiores
                src={`https://image.tmdb.org/t/p/w342${path}`}
                alt="Capa de filme ou série"
                className="w-full h-full object-cover"
                loading="lazy"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <Feature
          eyebrow="Bilheteria"
          title="Cadastro seguro"
          text="Senha protegida com hash (bcrypt) e sessão autenticada - só você acessa o seu arquivo."
        />
        <Feature
          eyebrow="Cartaz"
          title="Capa oficial automática"
          text="Ao buscar o título, a capa e a sinopse vêm direto da base do TMDB (The Movie Database)."
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