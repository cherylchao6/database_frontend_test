// pages/_app.tsx
// source: https://nextjs.org/docs/pages/building-your-application/routing/custom-app
// create a custom app component to wrap the pages in a layout
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import DashboardLayout from "@/components/DashboardLayout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}
