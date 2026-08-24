import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { tmdbSearch, tmdbGetProviders } from "@/lib/tmdb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await tmdbSearch(q);

    // Busca o streaming atual de cada resultado em paralelo, para que a
    // pessoa veja onde assistir mesmo sem precisar adicionar o título antes.
    const withProviders = await Promise.all(
      results.map(async (r) => {
        let providers: Awaited<ReturnType<typeof tmdbGetProviders>> = [];
        try {
          providers = await tmdbGetProviders(r.tmdbId, r.mediaType);
        } catch {
          // se falhar para um item específico, seguimos sem streaming pra ele
        }
        return { ...r, providers };
      })
    );

    return NextResponse.json({ results: withProviders });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Erro ao buscar no TMDB." },
      { status: 502 }
    );
  }
}
