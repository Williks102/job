import JobCard from '@/components/job-card';
import CandidateRecommender from '@/components/candidate-recommender';
import { getJobs } from './actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function JobList() {
  const { data: jobs, error } = await getJobs();

  if (error) {
    return <p className="text-destructive text-center">{error}</p>
  }
  
  if (!jobs || jobs.length === 0) {
    return <p className="text-muted-foreground text-center">Aucune offre disponible pour le moment.</p>
  }

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
  )
}

function JobListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}


export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <CandidateRecommender />
      <section className="mt-12">
        <h2 className="text-3xl font-bold font-headline tracking-tight text-center mb-8">
          Toutes nos offres d'emploi
        </h2>
        <Suspense fallback={<JobListSkeleton />}>
          <JobList />
        </Suspense>
      </section>
    </div>
  );
}
