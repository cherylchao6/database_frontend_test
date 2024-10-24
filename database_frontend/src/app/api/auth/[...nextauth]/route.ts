import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { AzureADProfile } from "next-auth/providers/azure-ad";

const {
  NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
  NEXT_PUBLIC_AZURE_AD_TENANT_ID,
  NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
} = process.env;

if (
  !NEXT_PUBLIC_AZURE_AD_CLIENT_ID ||
  !NEXT_PUBLIC_AZURE_AD_TENANT_ID ||
  !NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET
) {
  throw new Error("The Azure AD environment variables are not set.");
}

const handler = NextAuth({
  secret: NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
  providers: [
    AzureADProvider({
      clientId: NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      clientSecret: NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
      tenantId: NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      // For default directory, the permissions is User.Read
      // authorization: {
      //   params: { scope: "User.Read.All openid offline_access" },
      // },
      // authorization: { params: { scope: "openid profile User.Read email" } },
      profile: (profile: AzureADProfile) => {
        console.log(profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.name,
          lastName: profile.name,
        };
      },
      // ask for additional permissions
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session", session);
      // console.log("token", token);
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.access_token,
        });
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
