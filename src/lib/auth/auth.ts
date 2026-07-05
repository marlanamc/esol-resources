import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { trackLogin } from "@/lib/gamification";
import { logger } from "@/lib/logger";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { SESSION } from "@/lib/constants";
import { normalizeUserRole } from "./roles";

function isMobileUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// SECURITY: Validate authentication secret on module load
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
if (!authSecret) {
    throw new Error('CRITICAL: NEXTAUTH_SECRET or AUTH_SECRET must be set in environment variables');
}

if (authSecret.length < 32) {
    throw new Error('CRITICAL: NEXTAUTH_SECRET must be at least 32 characters for security');
}

export const authOptions: NextAuthOptions = {
    secret: authSecret,
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
                        logger.warn('Authentication attempt with missing credentials');
                        return null;
                    }

                    const reqHeaders = await headers();
                    const ip = getClientIp(reqHeaders);
                    const key = `auth:login:${ip}`;
                    if (!(await checkRateLimit(key))) {
                        logger.warn('Login rate limit exceeded', { ip });
                        return null;
                    }

                    const username = credentials.username.trim().toLowerCase();

                    const user = await prisma.user.findUnique({
                        where: { username },
                    });

                    if (!user) {
                        logger.warn('Authentication failed: user not found', { username });
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        logger.warn('Authentication failed: invalid password', {
                            username,
                            userId: user.id,
                        });
                        return null;
                    }

                    logger.info('User logged in successfully', {
                        username: user.username,
                        userId: user.id,
                        role: user.role,
                    });

                    // Track login for activity calendar
                    trackLogin(user.id).catch(err => {
                        logger.error('Failed to track login activity', err, {
                            userId: user.id,
                        });
                    });

                    const role = normalizeUserRole(user.role);

                    // Detect if login is from mobile device
                    const userAgent = reqHeaders.get('user-agent');
                    const isMobile = isMobileUserAgent(userAgent);

                    return {
                        id: user.id,
                        email: null,
                        name: user.name ?? user.username,
                        username: user.username,
                        role,
                        mustChangePassword: user.mustChangePassword,
                        isMobile,
                    };
                } catch (error) {
                    logger.error('Authentication error', error);
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
                token.isMobile = user.isMobile;

                // Set expiration based on device type
                // Mobile: 30 days, Desktop: 12 hours
                const maxAgeSeconds = user.isMobile
                    ? SESSION.MOBILE_DAYS * 24 * 60 * 60
                    : SESSION.DESKTOP_HOURS * 60 * 60;
                token.exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
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
