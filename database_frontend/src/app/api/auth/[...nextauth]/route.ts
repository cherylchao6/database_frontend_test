import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { AzureADProfile } from "next-auth/providers/azure-ad";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const testID = 10;
const profilePhotoSize = 96;

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
      authorization: { params: { scope: "User.Read.All openid offline_access email profile ProfilePhoto.Read.All" } },
      profile: (profile: AzureADProfile) => {
        return {
          id: profile.sub,// will replaced by jwt callback
          azureId: profile.sub,
          name: profile.name,
          email: profile.email,
          firstName: profile.name,
          lastName: profile.name,
        };
      },
      // ask for additional permissions
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
        if (user) {
          token.id = user.id; // Store the user id in the token
        }

        let base64Image  = null
        try {
          console.log("Fetching profile picture...");
          const profilePictureResponse = await fetch(
            `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (profilePictureResponse.ok) {
            const pictureBuffer = await profilePictureResponse.arrayBuffer();
            base64Image = `data:image/jpeg;base64,${Buffer.from(pictureBuffer).toString("base64")}`;
            token.image = base64Image 
          } else {
            console.error("Failed to fetch profile picture");
            console.error("profilePictureResponse", profilePictureResponse);
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }

        // call api to save user data and get user id
        try {
          const response = await fetch(`${apiUrl}/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              azureId: user.id,
              email: user.email,
              image: base64Image,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            // overwrite the id with the one from the server
            token.id = data.id;
          }
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.access_token,
          user: {
            ...session.user,
            id: token.id ?? testID,
            image: token.image ?? (session.user ? session.user.image : undefined),
          },
        });
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
