import { jobs } from '@/lib/jobs';
import JobCard from '@/components/job-card';
import CandidateRecommender from '@/components/candidate-recommender';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <CandidateRecommender />
      <section className="mt-12">
        <h2 className="text-3xl font-bold font-headline tracking-tight text-center mb-8">
          Exemples de Postes à Pourvoir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
