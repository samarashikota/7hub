"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-stub mb-2">
        Entrada da sessão
      </p>
      <h1 className="font-display text-4xl text-ink mb-6">Entrar</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
            E-mail
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="voce@email.com"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1">
            Senha
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-marquee text-reel-bg font-semibold py-3 hover:bg-marquee-soft transition disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>

      <p className="text-ink-faint text-sm mt-6">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-marquee hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
