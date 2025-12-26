import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { trackLogin } from "./gamification";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
                    
                    // Track login for activity calendar
                    trackLogin(user.id).catch(err => {
                        console.error('[Auth] Failed to track login:', err);
                    });
                    
                    const role = user.role === "teacher" ? "teacher" : "student";

                    return {
                        id: user.id,
                        email: null,
                        name: user.name ?? user.username,
                        username: user.username,
                        role,
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
                token.mustChangePassword = user.mustChangePassword;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id ?? session.user.id;
                session.user.role = token.role ?? session.user.role;
                session.user.username = token.username ?? session.user.username;
                session.user.mustChangePassword =
                    token.mustChangePassword ?? session.user.mustChangePassword;
            }
            return session;
        },
    },
};
