import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { UserRole } from "@/types/prisma";
import { verifyPassword } from "@/lib/auth-utils";

// Define an interface for the accounts in the user record
interface UserAccount {
  provider: string;
  // Add other fields as needed
}

// Extended auth options to include the account linking property
interface ExtendedAuthOptions extends NextAuthOptions {
  allowDangerousEmailAccountLinking?: boolean;
  cookies?: {
    state?: {
      name: string;
      options: {
        httpOnly: boolean;
        sameSite: string;
        path: string;
        secure: boolean;
        maxAge: number;
      };
    };
  };
}

export const authOptions: ExtendedAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Default role for new Google sign-ins is STUDENT
          // You can change this default as needed
          role: UserRole.STUDENT
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If user doesn't exist
        if (!user) {
          throw new Error("No user found with this email. Please sign up first.");
        }
        
        // If user tried to login using Google previously
        if (!user.password) {
          throw new Error("This account was created with Google. Please use Google Sign-In instead.");
        }

        const isValidPassword = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password. Please try again.");
        }

        return user;
      },
    }),
  ],
  // Increase state cookie max age to help with the "state cookie missing" error
  cookies: {
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 900 // 15 minutes in seconds (default is 900)
      }
    }
  },
  // Increase session token max age
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable automatic account linking by email
  // This is the key configuration to solve the OAuthAccountNotLinked error
  allowDangerousEmailAccountLinking: true,
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // If it's a Google sign-in, update the user role in our database from token
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        
        if (existingUser) {
          token.role = existingUser.role;
          
          // If this is a sign in event, make sure we use the up-to-date role from the database
          if (account.type === "oauth" && trigger === "signIn") {
            try {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { lastLogin: new Date() }
              });
            } catch (error) {
              console.error("Error updating lastLogin:", error);
            }
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect callback called with:", { url, baseUrl });
      
      // If the url is already set (like callback from credential provider) and not an auth endpoint, use it
      if (url.startsWith(baseUrl) && !url.includes('/api/auth')) {
        console.log("Returning original URL:", url);
        return url;
      }
      
      try {
        console.log("Attempting to get session for redirection");
        // Get the current session to determine the role
        const response = await fetch(`${baseUrl}/api/auth/session`);
        const session = await response.json();
        console.log("Session data for redirection:", session);
        
        if (session?.user?.role) {
          // Redirect based on role
          const role = session.user.role.toUpperCase();
          console.log("User role for redirection:", role);
          
          switch (role) {
            case UserRole.ADMIN:
              console.log("Redirecting to admin dashboard");
              return `${baseUrl}/admin/dashboard`;
            case UserRole.TEACHER:
              console.log("Redirecting to teacher dashboard");
              return `${baseUrl}/teacher/dashboard`;
            case UserRole.STUDENT:
              console.log("Redirecting to student dashboard");
              return `${baseUrl}/student/dashboard`;
            default:
              console.log("No matching role, redirecting to baseUrl");
              return baseUrl;
          }
        } else {
          console.log("No session user role found");
        }
      } catch (error) {
        console.error("Error in redirect callback:", error);
      }
      
      // Default redirect to baseUrl if anything goes wrong
      console.log("Falling back to default redirect:", baseUrl);
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // For Google sign-ins, ensure the user has a role
      if (account?.provider === "google") {
        // If user already exists but this is a new OAuth connection
        if (!isNewUser && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });
          
          // If user exists and has a role, no need to update
          if (existingUser && existingUser.role) {
            return;
          }
        }
        
        // For new users or users without a role, set default role
        if (user.id) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                role: UserRole.STUDENT, // Default role for Google sign-ins
                lastLogin: new Date()
              }
            });
          } catch (error) {
            console.error("Error updating user role:", error);
          }
        }
      }
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
