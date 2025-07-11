import { AdminNav } from "@/components/adminNav";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    return (
    <SidebarProvider>
      <AdminNav/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    );
}
