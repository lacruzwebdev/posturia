import NextAuth from "next-auth"
import LinkedIn from "next-auth/providers/linkedin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      authorization: { params: { scope: "openid profile w_member_social email" } },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          picture: profile.picture,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.sub = profile.sub as string
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        id: token.sub,
        picture: token.picture,
      }
    },
  },
})
