'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending relevant job seekers for a given job offer.
 *
 * - recommendCandidates - A function that takes job offer details and returns a list of recommended candidates.
 * - JobOfferDetails - The input type for the recommendCandidates function, representing the job offer.
 * - RecommendedCandidates - The output type for the recommendCandidates function, representing a list of recommended job seekers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobOfferDetailsSchema = z.object({
  jobTitle: z.string().describe('The title of the job offer.'),
  skillsRequired: z.array(z.string()).describe('List of skills required for the job.'),
  experienceRequired: z.string().describe('Description of the experience required for the job.'),
  jobType: z.string().describe('The type of job being offered (e.g., housekeeper, nanny).'),
  location: z.string().describe('The location of the job in Côte d\'Ivoire.'),
  salaryOffered: z.number().describe('The salary offered for the job in FCFA.'),
});

export type JobOfferDetails = z.infer<typeof JobOfferDetailsSchema>;

const RecommendedCandidatesSchema = z.array(z.object({
  name: z.string().describe("The candidate's fictional name."),
  skills: z.array(z.string()).describe("The candidate's skills."),
  experience: z.string().describe("A brief summary of the candidate's experience."),
  location: z.string().describe("The candidate's preferred work location."),
  expectedSalary: z.number().describe("The candidate's expected salary in FCFA."),
  availability: z.string().describe("The candidate's availability (e.g., 'Immediate', 'In 2 weeks')."),
}));

export type RecommendedCandidates = z.infer<typeof RecommendedCandidatesSchema>;

export async function recommendCandidates(details: JobOfferDetails): Promise<RecommendedCandidates> {
  return recommendCandidatesFlow(details);
}

const prompt = ai.definePrompt({
  name: 'recommendCandidatesPrompt',
  input: {schema: JobOfferDetailsSchema},
  output: {schema: RecommendedCandidatesSchema},
  prompt: `You are an AI recruitment assistant for domestic help jobs in Côte d'Ivoire. The currency is FCFA. Given the following job offer, generate a list of 3 fictional but realistic candidate profiles that would be a good match.

Job Offer Details:
Job Title: {{{jobTitle}}}
Skills Required: {{#each skillsRequired}}{{{this}}}, {{/each}}
Experience Required: {{{experienceRequired}}}
Job Type: {{{jobType}}}
Location: {{{location}}}
Salary Offered: {{{salaryOffered}}} FCFA

Based on this offer, recommend candidates that match the required skills, experience, job type, and location. Their salary expectations should be realistic and around the offered salary. The output must be a JSON array of candidate profiles.

Ensure each candidate profile includes their name, skills, a summary of their experience, preferred location, expected salary in FCFA, and availability.
`,  
});

const recommendCandidatesFlow = ai.defineFlow(
  {
    name: 'recommendCandidatesFlow',
    inputSchema: JobOfferDetailsSchema,
    outputSchema: RecommendedCandidatesSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
