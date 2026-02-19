import { ReactNode, useState } from "react";
import AppSidebar from "./AppSidebar";
import { Menu, Zap } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:overflow-y-auto">
        {/* Mobile header - Fixed position */}
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur-lg px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-md">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">Extract Pipeline</span>
          </div>
        </div>

        {/* Content with top padding for fixed header on mobile */}
        <div className="animate-fade-in pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
