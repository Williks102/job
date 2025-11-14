'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending relevant job offers to job seekers based on their profile.
 *
 * - recommendRelevantJobs - A function that takes a job seeker's profile and returns a list of recommended job offers.
 * - JobSeekerProfile - The input type for the recommendRelevantJobs function, representing the job seeker's profile.
 * - RecommendedJobOffers - The output type for the recommendRelevantJobs function, representing a list of recommended job offers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobSeekerProfileSchema = z.object({
  skills: z.array(z.string()).describe('List of skills possessed by the job seeker.'),
  experience: z.string().describe('Description of the job seeker\'s previous experience.'),
  desiredJobType: z.string().describe('The type of job the job seeker is looking for (e.g., housekeeper, nanny).'),
  locationPreferences: z.string().describe('Preferred locations for the job (e.g., city, region in Côte d\'Ivoire).'),
  salaryExpectations: z.number().describe('The job seeker\'s expected salary in FCFA.'),
});

export type JobSeekerProfile = z.infer<typeof JobSeekerProfileSchema>;

const RecommendedJobOffersSchema = z.array(z.object({
  jobTitle: z.string().describe('The title of the job offer.'),
  company: z.string().describe('The name of the company offering the job.'),
  location: z.string().describe('The location of the job in Côte d\'Ivoire.'),
  description: z.string().describe('A brief description of the job offer.'),
  skillsRequired: z.array(z.string()).describe('A list of skills required for the job.'),
  salary: z.number().describe('The salary offered for the job in FCFA.'),
}));

export type RecommendedJobOffers = z.infer<typeof RecommendedJobOffersSchema>;

export async function recommendRelevantJobs(profile: JobSeekerProfile): Promise<RecommendedJobOffers> {
  return recommendRelevantJobsFlow(profile);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantJobsPrompt',
  input: {schema: JobSeekerProfileSchema},
  output: {schema: RecommendedJobOffersSchema},
  prompt: `You are an AI job recommendation system for jobs in Côte d'Ivoire. The currency is FCFA. Given the following job seeker profile, recommend a list of relevant job offers.

Job Seeker Profile:
Skills: {{#each skills}}{{{this}}}, {{/each}}
Experience: {{{experience}}}
Desired Job Type: {{{desiredJobType}}}
Location Preferences: {{{locationPreferences}}}
Salary Expectations: {{{salaryExpectations}}} FCFA

Based on this profile, recommend job offers that match the job seeker's skills, experience, desired job type, location preferences and salary expectations. The output must be a JSON array.

Ensure that each job offer includes the job title, company, location, description, skills required and salary in FCFA.
`,  
});

const recommendRelevantJobsFlow = ai.defineFlow(
  {
    name: 'recommendRelevantJobsFlow',
    inputSchema: JobSeekerProfileSchema,
    outputSchema: RecommendedJobOffersSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
