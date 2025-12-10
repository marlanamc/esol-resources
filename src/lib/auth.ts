import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "development-secret-change-in-production",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        console.log('[Auth] Missing credentials');
                        return null;
                    }

                    const username = credentials.username.trim().toLowerCase();

                    const user = await prisma.user.findUnique({
                        where: { username },
                    });

                    if (!user) {
                        console.log(`[Auth] User not found: ${username}`);
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        console.log(`[Auth] Invalid password for: ${username}`);
                        return null;
                    }

                    console.log(`[Auth] Successful login: ${user.username} (${user.role})`);
                    return {
                        id: user.id,
                        email: null,
                        name: user.name ?? user.username,
                        username: user.username,
                        role: user.role,
                        mustChangePassword: user.mustChangePassword,
                    };
                } catch (error) {
                    console.error('[Auth] Error during authorization:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            },
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                (token as any).username = (user as any).username;
                (token as any).mustChangePassword = (user as any).mustChangePassword;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).username = (token as any).username;
                (session.user as any).mustChangePassword = (token as any).mustChangePassword;
            }
            return session;
        },
    },
};
