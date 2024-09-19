import "../styles/globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
