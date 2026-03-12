import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Library, BookOpen, BookmarkCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SidebarLink({
  to,
  label,
  icon,
  isActive,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
      )}
    >
      <span className="h-4 w-4">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAppRoute =
    location.pathname.startsWith("/book") ||
    location.pathname.startsWith("/my-book");

  const handleLogout = async () => {
    // If you add a backend logout endpoint, call it here.
    navigate("/login");
  };

  if (!isAppRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Library className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              LibStream
            </span>
            <span className="text-xs text-slate-400">Library Console</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarLink
            to="/book"
            label="All Books"
            icon={<BookOpen className="h-4 w-4" />}
            isActive={location.pathname === "/book"}
          />
          <SidebarLink
            to="/my-book"
            label="My Books"
            icon={<BookmarkCheck className="h-4 w-4" />}
            isActive={location.pathname.startsWith("/my-book")}
          />
        </nav>

        <div className="px-4 pb-4 pt-2 border-t border-slate-800">
          <Button
            variant="outline"
            className="w-full justify-center bg-black border-none"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full h-full px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

