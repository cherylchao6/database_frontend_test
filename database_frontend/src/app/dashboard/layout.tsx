import DashboardLayout from "@/components/DashboardLayout";

// Layout component
export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen justify-between">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
