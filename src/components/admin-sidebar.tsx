'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, Briefcase, Settings, LogOut } from 'lucide-react';
import { handleLogout } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, isAdminEmail } from '@/lib/firebase/auth';
import { useEffect, useState } from 'react';

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutGrid },
  { href: '/admin/jobs', label: 'Offres', icon: Briefcase },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setIsAdmin(isAdminEmail(user?.email));
  }, []);

  const onLogout = async () => {
    await handleLogout();
    toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté avec succès.',
    });
    router.push('/login');
    router.refresh();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-headline tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
              Domicile Emploi
            </span>
          </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Paramètres">
                    <Link href="#">
                        <Settings/>
                        <span>Paramètres</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} tooltip="Déconnexion" variant="outline">
                    <LogOut/>
                    <span>Déconnexion</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
