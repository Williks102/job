import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { getJobs } from '@/app/actions';
import type { Job } from '@/lib/types';


export const dynamic = 'force-dynamic';

export default async function AdminJobsPage() {
    const { data: jobs, error } = await getJobs();

    const formatSalary = (salary: number, type: 'hour' | 'day' | 'month' | 'year') => {
        const formattedSalary = new Intl.NumberFormat('fr-CI').format(salary);
        switch (type) {
            case 'hour': return `${formattedSalary} FCFA / h`;
            case 'day': return `${formattedSalary} FCFA / j`;
            case 'month': return `${formattedSalary} FCFA / mois`;
            case 'year': return `${formattedSalary} FCFA / an`;
            default: return `${formattedSalary} FCFA`;
        }
    }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Offres</h1>
          <p className="text-muted-foreground">
            Affichez, créez, et gérez vos offres d'emploi.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Offre
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les offres</CardTitle>
          <CardDescription>
            Liste de toutes les offres d'emploi actuellement publiées.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {error && <p className="text-destructive">{error}</p>}
            {!error && !jobs?.length && (
                <div className="text-center text-muted-foreground py-12">
                    <p>Aucune offre d'emploi pour le moment.</p>
                    <Button asChild variant="link" className="mt-2">
                        <Link href="/admin/jobs/new">
                            Créez votre première offre
                        </Link>
                    </Button>
                </div>
            )}
            {jobs && jobs.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Salaire</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{job.category}</Badge>
                      </TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{formatSalary(job.salary, job.salaryType)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
