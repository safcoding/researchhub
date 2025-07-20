import Footer from "@/app/(public)/_shared/footer";
import Header from "@/app/(public)/_shared/header";
import { AdminNav } from "@/app/admin/_shared/adminNav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/utils/supabase/server";
import { LogoutButton } from "@/components/logoutButton";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (user) {
    return (
      <SidebarProvider>
        <AdminNav />
        <SidebarInset>
          <header className="flex h-15 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1>Welcome, {user.email}</h1>
            </div>
            <div className="mr-auto">
              <LogoutButton />
            </div>
          </header>
          <Header />
          {children}
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    );
  }
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}