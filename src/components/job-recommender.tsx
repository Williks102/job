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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecommendedJobs } from "@/app/actions";
import type { RecommendedJobOffers } from "@/ai/flows/recommend-relevant-jobs";
import { Wand2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  skills: z.string().min(2, { message: "Veuillez entrer au moins une compétence." }),
  experience: z.string().min(10, { message: "Veuillez décrire brièvement votre expérience." }),
  desiredJobType: z.string().min(2, { message: "Veuillez préciser le type de poste." }),
  locationPreferences: z.string().min(2, { message: "Veuillez indiquer une localité." }),
  salaryExpectations: z.coerce.number().min(0, { message: "Le salaire doit être un nombre positif." }),
});

export default function JobRecommender() {
  const [recommendations, setRecommendations] = useState<RecommendedJobOffers | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: "",
      experience: "",
      desiredJobType: "",
      locationPreferences: "",
      salaryExpectations: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const profile = {
        ...values,
        skills: values.skills.split(',').map(s => s.trim()),
    };

    const result = await getRecommendedJobs(profile);

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
            <CardTitle className="font-headline text-2xl text-primary-foreground">Recommandations Personnalisées</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Utilisez notre IA pour trouver les offres qui vous correspondent parfaitement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compétences</FormLabel>
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
                  name="desiredJobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de poste souhaité</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Femme de ménage, Nounou" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Expérience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez votre expérience professionnelle..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieux préférés</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Abidjan, Bouaké" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryExpectations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire mensuel net attendu (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? "Recherche en cours..." : "Trouver mon job idéal"}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold font-headline">Analyse de votre profil...</h3>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
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
                {recommendations.length > 0 ? "Offres recommandées pour vous" : "Aucune offre ne correspond parfaitement pour le moment"}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="bg-card">
                    <CardHeader>
                        <CardTitle>{rec.jobTitle}</CardTitle>
                        <CardDescription>{rec.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {rec.skillsRequired.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <p className="font-bold text-lg">{formatSalary(rec.salary)}</p>
                        <p className="text-muted-foreground">{rec.location}</p>
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
