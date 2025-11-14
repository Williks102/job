import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';
import { checkAdminPrivileges } from '@/lib/firebase/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkAdminPrivileges();
  if (!isAdmin) {
    redirect('/login');
  }
  
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <AdminSidebar />
      </Sidebar>
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
