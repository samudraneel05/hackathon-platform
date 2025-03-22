import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "857454556951-37rvmian7896dc822opdktrfpo28dn6d.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // You can add custom logic here (e.g., check if user exists in your database)
      return true; // Allow sign in
    },
    async session({ session, token }) {
      // Add custom session data if needed
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 