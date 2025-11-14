"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getRecommendedCandidates } from "@/app/actions";
import type { RecommendedCandidates } from "@/ai/flows/recommend-relevant-jobs";
import { Wand2, User, Briefcase, MapPin, Wallet, Calendar } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  jobTitle: z.string().min(5, { message: "Veuillez entrer un titre de poste." }),
  skillsRequired: z.string().min(2, { message: "Veuillez entrer au moins une compétence." }),
  experienceRequired: z.string().min(10, { message: "Veuillez décrire l'expérience requise." }),
  jobType: z.string().min(2, { message: "Veuillez préciser le type de poste." }),
  location: z.string().min(2, { message: "Veuillez indiquer une localité." }),
  salaryOffered: z.coerce.number().min(0, { message: "Le salaire doit être un nombre positif." }),
});

export default function CandidateRecommender() {
  const [recommendations, setRecommendations] = useState<RecommendedCandidates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      skillsRequired: "",
      experienceRequired: "",
      jobType: "",
      location: "",
      salaryOffered: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const offerDetails = {
        ...values,
        skillsRequired: values.skillsRequired.split(',').map(s => s.trim()),
    };

    const result = await getRecommendedCandidates(offerDetails);

    if (result.success) {
      setRecommendations(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }
  
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-CI').format(salary) + ' FCFA';
  }

  return (
    <section>
      <Card className="bg-primary/20 border-primary/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary-foreground" />
            <CardTitle className="font-headline text-2xl text-primary-foreground">Trouvez le Candidat Idéal</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Décrivez le poste et laissez notre IA vous recommander les meilleurs profils.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre du poste</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Femme de ménage, Nounou" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de poste</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Temps plein, Temps partiel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillsRequired"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Compétences requises</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Nettoyage, Garde d'enfants, Conduite" {...field} />
                      </FormControl>
                      <FormDescription>Séparez les compétences par des virgules.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceRequired"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Expérience requise</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez l'expérience professionnelle souhaitée..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu du poste</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Abidjan, Cocody" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryOffered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire mensuel net proposé (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? "Analyse en cours..." : "Trouver des candidats"}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold font-headline">Recherche de candidats...</h3>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && (
            <div className="mt-8 text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                <h3 className="font-bold">Une erreur est survenue</h3>
                <p>{error}</p>
            </div>
          )}

          {recommendations && (
            <div className="mt-8">
              <h3 className="text-xl font-bold font-headline mb-4">
                {recommendations.length > 0 ? "Profils de candidats recommandés" : "Aucun candidat ne correspond parfaitement pour le moment"}
              </h3>
              <div className="grid lg:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="bg-card flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <User className="h-6 w-6 text-foreground"/>
                           <CardTitle className="text-xl">{rec.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Compétences</h4>
                            <div className="flex flex-wrap gap-2">
                                {rec.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Expérience</h4>
                            <p className="text-sm text-muted-foreground">{rec.experience}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Salaire attendu</p>
                                <p className="font-semibold">{formatSalary(rec.expectedSalary)}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Lieu</p>
                                <p className="font-semibold">{rec.location}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground text-xs">Disponibilité</p>
                                <p className="font-semibold">{rec.availability}</p>
                            </div>
                        </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
