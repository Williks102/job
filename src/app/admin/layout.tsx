import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <AdminSidebar />
      </Sidebar>
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
