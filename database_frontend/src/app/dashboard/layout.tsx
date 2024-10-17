import DashboardLayout from "@/components/DashboardLayout"

export default function Layout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }