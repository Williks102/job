"use server";

import { recommendRelevantJobs, type JobSeekerProfile } from "@/ai/flows/recommend-relevant-jobs";
import { z } from "zod";

const JobSeekerProfileSchema = z.object({
  skills: z.array(z.string()).describe('List of skills possessed by the job seeker.'),
  experience: z.string().describe('Description of the job seeker\'s previous experience.'),
  desiredJobType: z.string().describe('The type of job the job seeker is looking for (e.g., housekeeper, nanny).'),
  locationPreferences: z.string().describe('Preferred locations for the job (e.g., city, region).'),
  salaryExpectations: z.number().describe('The job seeker\'s expected salary.'),
});

export async function getRecommendedJobs(profile: JobSeekerProfile) {
  try {
    const validatedProfile = JobSeekerProfileSchema.parse(profile);
    const recommendations = await recommendRelevantJobs(validatedProfile);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    if (error instanceof z.ZodError) {
        return { success: false, error: "Invalid input data." };
    }
    return { success: false, error: "An error occurred while fetching recommendations." };
  }
}
