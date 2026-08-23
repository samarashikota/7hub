"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-reel-line/70 bg-reel-bg/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-wide text-marquee marquee-title">
            SESSÃO
          </span>
          <span className="font-display text-2xl tracking-wide text-ink">CONTÍNUA</span>
        </Link>

        <nav className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="text-ink-muted hover:text-marquee transition">
                Meus ingressos
              </Link>
              <span className="text-ink-faint hidden sm:inline">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-ink-muted hover:text-marquee transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink-muted hover:text-marquee transition">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-marquee/70 px-3 py-1.5 text-marquee hover:bg-marquee hover:text-reel-bg transition"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
