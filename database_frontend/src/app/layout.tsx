import "../styles/globals.css";
import DashboardLayout from "@/components/DashboardLayout";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
};

export default RootLayout;