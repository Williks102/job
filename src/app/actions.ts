"use server";

import { recommendCandidates, type JobOfferDetails } from "@/ai/flows/recommend-relevant-jobs";
import { z } from "zod";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Job } from "@/lib/types";

const JobOfferDetailsSchema = z.object({
    jobTitle: z.string().describe('The title of the job offer.'),
    skillsRequired: z.array(z.string()).describe('List of skills required for the job.'),
    experienceRequired: z.string().describe('Description of the experience required for the job.'),
    jobType: z.string().describe('The type of job being offered (e.g., housekeeper, nanny).'),
    location: z.string().describe('The location of the job in Côte d\'Ivoire.'),
    salaryOffered: z.number().describe('The salary offered for the job in FCFA.'),
});

const jobFormSchema = z.object({
  title: z.string().min(5, 'Le titre doit comporter au moins 5 caractères.'),
  category: z.enum(['housekeeper', 'nanny', 'driver', 'butler']),
  location: z.string().min(2, 'Le lieu est requis.'),
  salary: z.coerce.number().positive('Le salaire doit être un nombre positif.'),
  salaryType: z.enum(['hour', 'day', 'month', 'year']),
  description: z.string().min(20, 'La description doit comporter au moins 20 caractères.'),
  requirements: z.string().min(5, 'Les conditions sont requises.'),
});


export async function getRecommendedCandidates(details: JobOfferDetails) {
  try {
    const validatedDetails = JobOfferDetailsSchema.parse(details);
    const recommendations = await recommendCandidates(validatedDetails);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error("Error getting candidate recommendations:", error);
    if (error instanceof z.ZodError) {
        return { success: false, error: "Invalid input data." };
    }
    return { success: false, error: "An error occurred while fetching recommendations." };
  }
}

export async function addJob(formData: unknown) {
    try {
        const validatedData = jobFormSchema.parse(formData);
        const requirementsArray = validatedData.requirements.split('\n').map(req => req.trim()).filter(req => req.length > 0);

        const newJob = {
            ...validatedData,
            requirements: requirementsArray,
            createdAt: Timestamp.now(),
             // This is a placeholder, you'll need to update image logic
            image: `housekeeper-${Math.floor(Math.random() * 2) + 1}`,
        };

        await addDoc(collection(db, "jobs"), newJob);
        
        return { success: true, message: "Offre d'emploi créée avec succès." };

    } catch (error) {
        console.error("Error adding job:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: "Données du formulaire invalides." };
        }
        return { success: false, error: "Une erreur est survenue lors de la création de l'offre." };
    }
}

export async function getJobs() {
    try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            jobs.push({ id: doc.id, ...data } as Job);
        });
        return { success: true, data: jobs };
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return { success: false, error: "Impossible de charger les offres d'emploi." };
    }
}
