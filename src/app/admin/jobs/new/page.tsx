'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addJob } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const jobFormSchema = z.object({
  title: z.string().min(5, 'Le titre doit comporter au moins 5 caractères.'),
  category: z.enum(['housekeeper', 'nanny', 'driver', 'butler']),
  location: z.string().min(2, 'Le lieu est requis.'),
  salary: z.coerce.number().positive('Le salaire doit être un nombre positif.'),
  salaryType: z.enum(['hour', 'day', 'month', 'year']),
  description: z.string().min(20, 'La description doit comporter au moins 20 caractères.'),
  requirements: z.string().min(5, 'Les conditions sont requises.'),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
        title: '',
        location: '',
        description: '',
        requirements: '',
        category: 'housekeeper',
        salary: 0,
        salaryType: 'month'
    }
  });

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true);
    const result = await addJob(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Succès',
        description: "L'offre d'emploi a été créée.",
      });
      router.push('/admin/jobs');
      router.refresh(); // To refetch jobs on the main page
    } else {
      toast({
        title: 'Erreur',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Créer une Nouvelle Offre</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous pour publier une nouvelle offre d'emploi.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Détails de l'offre</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du poste</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Femme de ménage expérimentée" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="housekeeper">Femme de ménage</SelectItem>
                            <SelectItem value="nanny">Nounou</SelectItem>
                            <SelectItem value="driver">Chauffeur</SelectItem>
                            <SelectItem value="butler">Majordome</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lieu</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Abidjan, Cocody" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Salaire (en FCFA)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Ex: 80000" {...field} onChange={event => field.onChange(+event.target.value)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="salaryType"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type de salaire</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une période" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="month">Par mois</SelectItem>
                            <SelectItem value="day">Par jour</SelectItem>
                            <SelectItem value="hour">Par heure</SelectItem>
                            <SelectItem value="year">Par an</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description du poste</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez en détail les tâches et responsabilités du poste..."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions requises</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Listez les compétences, l'expérience et les qualifications nécessaires..."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Séparez chaque condition par un retour à la ligne.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Créer l'offre
                 </Button>
                 <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                    Annuler
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
