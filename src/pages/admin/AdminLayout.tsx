import { useApp } from "@/context/AppContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const AdminLayout = () => {
  const { isAdmin, isLoggedIn } = useApp();

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 font-display text-2xl font-bold">Admin Access Required</h2>
          <p className="mb-4 text-muted-foreground">You need admin privileges to access this page.</p>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex h-12 items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <span className="font-display text-sm font-semibold text-muted-foreground">Admin Dashboard</span>
          </div>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
