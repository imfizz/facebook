import NextAuth from "next-auth"
import Provider from "next-auth/providers/facebook"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Provider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXT_PUBLIC_SECRET
})