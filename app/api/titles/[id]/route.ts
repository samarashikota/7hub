import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const existing = await prisma.title.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  const body = await req.json();
  const data: { rating?: number | null; note?: string | null } = {};

  if ("rating" in body) {
    data.rating =
      body.rating === null || body.rating === "" ? null : Math.max(0, Math.min(10, Number(body.rating)));
  }
  if ("note" in body) {
    data.note = body.note ? String(body.note).slice(0, 2000) : null;
  }

  const title = await prisma.title.update({ where: { id: params.id }, data });
  return NextResponse.json({ title });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  const existing = await prisma.title.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 });
  }

  await prisma.title.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
