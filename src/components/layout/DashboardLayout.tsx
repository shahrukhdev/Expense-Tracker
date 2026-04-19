import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-grow-1 bg-light">
        
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="p-4">{children}</div>

      </div>
    </div>
  );
}