import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tmdbGetProviders } from "@/lib/tmdb";

// Lista os títulos do usuário logado, com o streaming ATUAL (buscado em
// tempo real no TMDB) — o catálogo dos serviços muda com frequência,
// então evitamos guardar uma foto antiga no banco.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const titles = await prisma.title.findMany({
    where: { userId },
    orderBy: { watchedAt: "desc" },
  });

  const withProviders = await Promise.all(
    titles.map(async (t: (typeof titles)[number]) => {
      let providers: Awaited<ReturnType<typeof tmdbGetProviders>> = [];
      try {
        providers = await tmdbGetProviders(t.tmdbId, t.mediaType as "movie" | "tv");
      } catch {
        // se o TMDB falhar momentaneamente, seguimos sem streamings em vez de quebrar a lista
      }
      return { ...t, providers };
    })
  );

  return NextResponse.json({ titles: withProviders });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const tmdbId = Number(body?.tmdbId);
  const mediaType = body?.mediaType === "tv" ? "tv" : "movie";
  const name = String(body?.name ?? "").trim();
  const year = body?.year ? String(body.year) : null;
  const posterUrl = body?.posterUrl ? String(body.posterUrl) : null;
  const overview = body?.overview ? String(body.overview) : null;
  const rating =
    body?.rating === null || body?.rating === undefined || body?.rating === ""
      ? null
      : Math.max(0, Math.min(10, Number(body.rating)));
  const note = body?.note ? String(body.note).slice(0, 2000) : null;

  if (!tmdbId || !name) {
    return NextResponse.json({ error: "Título inválido." }, { status: 400 });
  }

  try {
    const title = await prisma.title.create({
      data: { userId, tmdbId, mediaType, name, year, posterUrl, overview, rating, note },
    });
    return NextResponse.json({ title }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Você já marcou esse título como assistido." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Não foi possível salvar." }, { status: 500 });
  }
}
