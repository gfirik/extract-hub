import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
