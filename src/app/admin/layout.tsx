import { AdminNav } from "@/app/admin/_shared/adminNav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import { LogoutButton } from "@/components/logoutButton";
import { createClient } from "@/lib/utils/supabase/server";

export default async  function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

    return (
    <SidebarProvider>
      <AdminNav/>
        <SidebarInset>
          <header className="flex h-10 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1>Welcome, {user?.email}</h1>
            </div>
            <div className="ml-auto px-3">
              <LogoutButton />
            </div>
          </header>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    );
}
