import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sessão Contínua — seu arquivo de filmes e séries assistidos",
  description:
    "Guarde o que você já assistiu, com capa oficial, streaming atual e sua nota pessoal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="film-grain min-h-screen">
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
