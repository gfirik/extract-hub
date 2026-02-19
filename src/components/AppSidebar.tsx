import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Inbox, X, Zap } from "lucide-react";

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white tracking-tight">Extract Pipeline</span>
            <span className="block text-xs text-sidebar-foreground">Data Automation</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
          Menu
        </p>
        <NavLink
          to="/"
          end
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-white"
          activeClassName="bg-sidebar-accent text-white shadow-lg shadow-black/20"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/50 transition-colors group-hover:bg-primary/20">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          Dashboard
        </NavLink>
        <NavLink
          to="/sources"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-white"
          activeClassName="bg-sidebar-accent text-white shadow-lg shadow-black/20"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/50 transition-colors group-hover:bg-primary/20">
            <Inbox className="h-4 w-4" />
          </div>
          Sources
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-emerald-600/10 p-4">
          <p className="text-xs font-semibold text-white">Pipeline Active</p>
          <p className="mt-1 text-xs text-sidebar-foreground">Processing incoming data in real-time</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
