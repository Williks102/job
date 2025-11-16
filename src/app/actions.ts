"use server";

import { recommendCandidates, type JobOfferDetails } from "@/ai/flows/recommend-relevant-jobs";
import { z } from "zod";
import { collection, addDoc, getDocs, Timestamp, doc, getDoc }from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Job } from "@/lib/types";
import { isFirebaseError, FirestorePermissionError, errorEmitter } from "@/lib/firebase/error-handler";
import { signInWithEmail, signOut, isAdminEmail } from "@/lib/firebase/auth";

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

const loginFormSchema = z.object({
  email: z.string().email("L'adresse e-mail n'est pas valide."),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
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

export async function addJob(formData: unknown, user: { uid: string }) {
    if (!user || !isAdminEmail(user.uid)) {
        return { success: false, error: "Action non autorisée." };
    }

    try {
        const validatedData = jobFormSchema.parse(formData);
        const requirementsArray = validatedData.requirements.split('\n').map(req => req.trim()).filter(req => req.length > 0);

        const newJob = {
            ...validatedData,
            requirements: requirementsArray,
            createdAt: Timestamp.now(),
            employerId: user.uid,
            image: `housekeeper-${Math.floor(Math.random() * 2) + 1}`,
        };

        const jobsCollection = collection(db, "jobListings");
        await addDoc(jobsCollection, newJob);
        
        return { success: true, message: "Offre d'emploi créée avec succès." };

    } catch (error) {
        if (isFirebaseError(error) && error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError(
                'write',
                collection(db, "jobListings"),
                {...error}
            );
            errorEmitter.emit('permission-error', permissionError);
            return { success: false, error: permissionError.publicMessage };
        }
        console.error("Error adding job:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: "Données du formulaire invalides." };
        }
        return { success: false, error: "Une erreur est survenue lors de la création de l'offre." };
    }
}

export async function getJobs() {
    try {
        const jobsCollection = collection(db, "jobListings");
        const querySnapshot = await getDocs(jobsCollection);
        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            jobs.push({ id: doc.id, ...data } as Job);
        });
        return { success: true, data: jobs, error: null };
    } catch (error) {
        if (isFirebaseError(error) && error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError(
                'read',
                collection(db, "jobListings"),
                {...error}
            );
            errorEmitter.emit('permission-error', permissionError);
            return { success: false, data: [], error: permissionError.publicMessage };
        }
        console.error("Error fetching jobs:", error);
        return { success: false, data: [], error: "Impossible de charger les offres d'emploi." };
    }
}

export async function handleLogin(formData: unknown) {
  try {
    const validatedData = loginFormSchema.parse(formData);
    const { email, password } = validatedData;
    
    if (!isAdminEmail(email)) {
        return { success: false, error: 'Accès non autorisé. Cet espace est réservé aux administrateurs.' };
    }

    await signInWithEmail(email, password);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données de connexion invalides." };
    }
    if (isFirebaseError(error)) {
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return { success: false, error: 'Email ou mot de passe incorrect.' };
            case 'auth/too-many-requests':
                return { success: false, error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' };
            default:
                 return { success: false, error: 'Une erreur est survenue lors de la connexion.' };
        }
    }
    return { success: false, error: 'Une erreur inconnue est survenue.' };
  }
}

export async function handleLogout() {
    await signOut();
}

export async function getJob(id: string): Promise<{ job: Job | null, error: string | null}> {
    try {
        const docRef = doc(db, "jobListings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { job: { id: docSnap.id, ...docSnap.data() } as Job, error: null };
        } else {
            return { job: null, error: "Offre non trouvée" };
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return { job: null, error: "Erreur lors de la récupération de l'offre." };
    }
}
