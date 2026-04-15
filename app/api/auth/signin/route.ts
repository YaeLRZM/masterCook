import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    // ── Find user ─────────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }

    // ── Set session cookie ────────────────────────────────────────────────────
    const maxAge = rememberMe
      ? 60 * 60 * 24 * 30  // 30 days
      : 60 * 60 * 24;       // 1 day

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;

  } catch (err) {
    console.error("[signin]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
