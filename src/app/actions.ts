"use server";

import { recommendCandidates, type JobOfferDetails } from "@/ai/flows/recommend-relevant-jobs";
import { z } from "zod";

const JobOfferDetailsSchema = z.object({
    jobTitle: z.string().describe('The title of the job offer.'),
    skillsRequired: z.array(z.string()).describe('List of skills required for the job.'),
    experienceRequired: z.string().describe('Description of the experience required for the job.'),
    jobType: z.string().describe('The type of job being offered (e.g., housekeeper, nanny).'),
    location: z.string().describe('The location of the job in Côte d\'Ivoire.'),
    salaryOffered: z.number().describe('The salary offered for the job in FCFA.'),
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
