import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      });
      if (!user || !user.passwordHash) return null;
      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;
      return { id: user.id, name: user.name, email: user.email, image: user.image };
    },
  }),
];

if (googleEnabled) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Untuk Google OAuth: pastikan User + Wallet ada di DB kita (tanpa adapter).
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) {
          await prisma.user.create({
            data: {
              name: user.name || email.split("@")[0],
              email,
              image: user.image,
              wallet: { create: { balance: 0 } },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Lookup DB HANYA saat login (`user` hanya hadir di pemanggilan sign-in),
      // lalu cache id/role/nama di token. Pembacaan session berikutnya
      // (mis. /api/auth/session yang sering dipanggil) tidak menyentuh DB.
      // Konsekuensi: perubahan role/nama baru tampak setelah login ulang.
      if (user) {
        const email = (user.email || token.email)?.toLowerCase().trim();
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, image: true, role: true },
          });
          if (dbUser) {
            token.uid = dbUser.id;
            token.name = dbUser.name;
            token.picture = dbUser.image;
            token.role = dbUser.role;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
