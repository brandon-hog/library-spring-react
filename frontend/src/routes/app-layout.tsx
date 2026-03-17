import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Library, BookOpen, BookmarkCheck, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAppRoute =
    location.pathname.startsWith("/book") ||
    location.pathname.startsWith("/my-book");

  const handleLogout = async () => {
    navigate("/login");
  };

  if (!isAppRoute) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-slate-800 bg-slate-900">
          <div className="flex  items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Library className="text-white" size={20} />
            </div>
            <div className="flex flex-col group-data-[state=collapsed]/sidebar-provider:hidden">
              <span className="text-white text-sm font-semibold tracking-tight">
                LibStream
              </span>
              <span className="text-xs text-slate-400">Library Console</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="space-y-1 bg-slate-900">
          <SidebarMenu className="flex flex-col gap-2 justify-center">
            <SidebarMenuItem className="mt-2 mx-2">
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/book"}
                tooltip="All Books"
                className={cn(
                  "text-slate-200 hover:bg-slate-800/80 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                )}
              >
                <Link to="/book">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="group-data-[state=collapsed]/sidebar-provider:hidden">
                    All Books
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="mx-2">
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith("/my-book")}
                tooltip="My Books"
                className={cn(
                  "text-slate-200 hover:bg-slate-800/80 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                )}
              >
                <Link to="/my-book">
                  <BookmarkCheck className="h-4 w-4 shrink-0" />
                  <span className="group-data-[state=collapsed]/sidebar-provider:hidden">
                    My Books
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-800 bg-slate-900">
          <Button
            variant="outline"
            className="w-full justify-center bg-black hover:bg-slate-800 border-none cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0 text-white" />
            <span className="text-white group-data-[state=collapsed]/sidebar-provider:hidden">
              Log out
            </span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/80 px-3 backdrop-blur supports-backdrop-filter:bg-white/60">
          <SidebarTrigger />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-700">
              Library Console
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}