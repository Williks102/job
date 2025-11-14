import Link from 'next/link';
import Image from 'next/image';
import type { Job } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wallet } from 'lucide-react';
import { JobIcon } from '@/components/icons';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === job.image);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={placeholder.description}
              data-ai-hint={placeholder.imageHint}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute top-3 right-3 bg-card p-2 rounded-full shadow-md">
            <JobIcon category={job.category} className="h-6 w-6 text-foreground" />
          </div>
        </div>
        <div className="p-6 pb-2">
            <Badge variant="secondary" className="mb-2 capitalize">{job.category}</Badge>
            <CardTitle className="font-headline text-xl">{job.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>{job.salary} € / {job.salaryType === 'hour' ? 'heure' : 'mois'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/jobs/${job.id}`}>Voir l'offre</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
