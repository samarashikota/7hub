"use client";

import { useState } from "react";
import Image from "next/image";

type Provider = { name: string; logoUrl: string; type: string };

export type SavedTitle = {
  id: string;
  tmdbId: number;
  mediaType: string;
  name: string;
  year: string | null;
  posterUrl: string | null;
  rating: number | null;
  note: string | null;
  watchedAt: string;
  providers: Provider[];
};

export default function TicketCard({
  title,
  onChanged,
}: {
  title: SavedTitle;
  onChanged: () => void;
}) {
  const [rating, setRating] = useState<string>(title.rating?.toString() ?? "");
  const [note, setNote] = useState(title.note ?? "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/titles/${title.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: rating === "" ? null : Number(rating),
          note: note.trim() === "" ? null : note.trim(),
        }),
      });
      setEditing(false);
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Remover "${title.name}" do seu arquivo?`)) return;
    await fetch(`/api/titles/${title.id}`, { method: "DELETE" });
    onChanged();
  }

  const watchedDate = new Date(title.watchedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="ticket">
      <div className="stub-notch" style={{ top: "-7px" }} />
      <div className="stub-notch" style={{ bottom: "-7px" }} />

      <div className="bg-reel-card2 rounded-l-[10px] p-2 flex items-center">
        <div className="w-full aspect-[2/3] relative rounded overflow-hidden bg-reel-line">
          {title.posterUrl ? (
            <Image src={title.posterUrl} alt={title.name} fill sizes="92px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-2xl text-ink-faint">?</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pl-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-teal-stub">
              {title.mediaType === "movie" ? "Filme" : "Série"} · Assistido em {watchedDate}
            </p>
            <h3 className="font-display text-2xl text-ink leading-tight mt-0.5 truncate">
              {title.name}
            </h3>
            <p className="text-ink-faint text-sm">{title.year ?? ""}</p>
          </div>
          <button
            onClick={remove}
            className="font-mono text-[10px] uppercase text-ink-faint hover:text-red-400 transition whitespace-nowrap"
          >
            Remover
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {title.providers.length > 0 ? (
            title.providers.map((p) => (
              <span
                key={p.name}
                className="flex items-center gap-1.5 rounded-full bg-reel-card2 border border-reel-line px-2 py-1"
                title={p.name}
              >
                <span className="relative w-4 h-4 rounded overflow-hidden flex-shrink-0">
                  <Image src={p.logoUrl} alt={p.name} fill sizes="16px" className="object-cover" />
                </span>
                <span className="text-xs text-ink-muted">{p.name}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-ink-faint font-mono">
              Sem streaming disponível no momento
            </span>
          )}
        </div>

        {!editing ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              {title.rating !== null ? (
                <span className="font-mono text-marquee">★ {title.rating}/10</span>
              ) : (
                <span className="text-ink-faint font-mono">Sem nota</span>
              )}
              {title.note && <p className="text-ink-muted text-sm mt-1 max-w-md">{title.note}</p>}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="font-mono text-xs uppercase tracking-wide text-ink-muted hover:text-marquee transition"
            >
              Editar
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-ink-muted">Nota (0–10, opcional)</span>
              <input
                type="number"
                min={0}
                max={10}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="input w-20 py-1.5"
              />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Comentário opcional sobre o que achou..."
              rows={2}
              className="input"
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="font-mono text-xs uppercase rounded-full bg-marquee text-reel-bg px-4 py-1.5 hover:bg-marquee-soft transition disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="font-mono text-xs uppercase text-ink-faint hover:text-ink transition px-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
