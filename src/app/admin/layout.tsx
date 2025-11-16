'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, isAdminEmail } from '@/lib/firebase/auth';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';
import { Skeleton } from '@/components/ui/skeleton';

function AdminLoading() {
    return (
        <div className="flex h-screen w-full">
            <div className="hidden md:flex flex-col gap-4 border-r p-2" style={{ width: 'var(--sidebar-width)'}}>
               <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex flex-col gap-2 p-2 mt-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            <div className="flex-1 p-8">
                 <Skeleton className="h-8 w-64 mb-6" />
                 <Skeleton className="w-full h-96" />
            </div>
        </div>
    )
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user || !isAdminEmail(user.email)) {
        router.push('/login');
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return <AdminLoading />;
  }

  if (!isAuthorized) {
    return null;
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
