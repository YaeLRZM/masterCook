import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // ── Validation ────────────────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    // ── Check duplicate ───────────────────────────────────────────────────────
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 409 });
    }

    // ── Create user ───────────────────────────────────────────────────────────
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
      },
    });

    // ── Set session cookie ────────────────────────────────────────────────────
    const token = await signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, userId: user.id }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;

  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
