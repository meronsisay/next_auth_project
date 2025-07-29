import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth ,signOut} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("https://akil-backend.onrender.com/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          console.log(data)

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Invalid credentials");
          }

         
          return {
            id: data.data.id || data.data._id || data.data.email,
            name: data.data.name,
            email: data.data.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}){
      if(user){
        token.user = user;
      }
      return token
    },
    async session({session, token}){
      session.user = token.user as any;
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
});
