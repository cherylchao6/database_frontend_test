import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { AzureADProfile } from "next-auth/providers/azure-ad";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const testID = 10;

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
      authorization: { params: { scope: "openid profile User.Read email" } },
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
    async signIn({ user }) {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        });
        // Optional: Check if the API request was successful
        if (!response.ok) {
          console.log("response", response);
          console.log("response", await response.json());
          user.id = testID.toString();
          // throw new Error("Failed to save user data");
        }
        const data = await response.json();
        user.id = data.id; // Store the id in the user object for the jwt callback
      } catch (error) {
        console.error("Error saving user data:", error);
        // return false; // Return false to cancel the sign-in if necessary
      }

      return true; // Return true to continue the sign-in process
    },
    async jwt({ token, user, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
        if (user) {
          token.id = user.id; // Store the user id in the token
        }
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session", session);
      // console.log("token", token);
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.access_token,
          user: {
            ...session.user,
            id: token.id ?? testID,
          },
        });
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
