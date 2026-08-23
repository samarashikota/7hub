const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

function apiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY não configurada. Adicione sua chave no arquivo .env (veja .env.example)."
    );
  }
  return key;
}

export type TmdbSearchResult = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  name: string;
  year: string | null;
  posterUrl: string | null;
  overview: string;
};

export type StreamingProvider = {
  name: string;
  logoUrl: string;
  type: "flatrate" | "ads" | "free" | "rent" | "buy";
};

/** Busca filmes e séries por texto (ignora resultados de "pessoa"). */
export async function tmdbSearch(query: string): Promise<TmdbSearchResult[]> {
  const url = `${TMDB_BASE}/search/multi?api_key=${apiKey()}&query=${encodeURIComponent(
    query
  )}&language=pt-BR&include_adult=false`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Falha ao buscar no TMDB (${res.status})`);
  const data = await res.json();

  return (data.results ?? [])
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .slice(0, 12)
    .map((r: any) => {
      const isMovie = r.media_type === "movie";
      const rawDate: string | undefined = isMovie ? r.release_date : r.first_air_date;
      return {
        tmdbId: r.id,
        mediaType: isMovie ? "movie" : "tv",
        name: isMovie ? r.title : r.name,
        year: rawDate ? rawDate.slice(0, 4) : null,
        posterUrl: r.poster_path ? `${IMG_BASE}/w342${r.poster_path}` : null,
        overview: r.overview ?? "",
      };
    });
}

/**
 * Retorna os streamings (assinatura/inclusos por anúncio) disponíveis
 * no Brasil para o título, segundo o TMDB (dados via JustWatch).
 */
export async function tmdbGetProviders(
  tmdbId: number,
  mediaType: "movie" | "tv"
): Promise<StreamingProvider[]> {
  const url = `${TMDB_BASE}/${mediaType}/${tmdbId}/watch/providers?api_key=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = await res.json();
  const br = data.results?.BR;
  if (!br) return [];

  const groups: { key: "flatrate" | "ads" | "free"; label: StreamingProvider["type"] }[] = [
    { key: "flatrate", label: "flatrate" },
    { key: "ads", label: "ads" },
    { key: "free", label: "free" },
  ];

  const seen = new Set<string>();
  const providers: StreamingProvider[] = [];

  for (const group of groups) {
    const list = br[group.key];
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      if (seen.has(p.provider_name)) continue;
      seen.add(p.provider_name);
      providers.push({
        name: p.provider_name,
        logoUrl: `${IMG_BASE}/w92${p.logo_path}`,
        type: group.label,
      });
    }
  }

  return providers;
}
