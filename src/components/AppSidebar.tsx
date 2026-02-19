import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Inbox } from "lucide-react";

const AppSidebar = () => {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <span className="text-xs font-bold text-primary-foreground">EP</span>
        </div>
        <span className="text-sm font-bold text-foreground tracking-tight">Extract Pipeline</span>
      </div>

      <nav className="mt-2 flex flex-col gap-0.5 px-3">
        <NavLink
          to="/"
          end
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeClassName="bg-muted text-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/sources"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          activeClassName="bg-muted text-foreground"
        >
          <Inbox className="h-4 w-4" />
          Sources
        </NavLink>
      </nav>
    </aside>
  );
};

export default AppSidebar;
