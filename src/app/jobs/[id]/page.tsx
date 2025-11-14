import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, MapPin, Wallet } from 'lucide-react';
import WhatsAppButton from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { JobIcon } from '@/components/icons';
import type { Job } from '@/lib/types';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';

type Props = {
  params: { id: string };
};

const formatSalary = (salary: number, type: Job['salaryType']) => {
    const formattedSalary = new Intl.NumberFormat('fr-CI').format(salary);
    switch (type) {
        case 'hour': return `${formattedSalary} FCFA / heure`;
        case 'day': return `${formattedSalary} FCFA / jour`;
        case 'month': return `${formattedSalary} FCFA / mois`;
        case 'year': return `${formattedSalary} FCFA / an`;
        default: return `${formattedSalary} FCFA`;
    }
}

async function getJob(id: string): Promise<Job | null> {
    try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Job;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}

export async function generateStaticParams() {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const paths = querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
    return paths;
  } catch (error) {
    console.error("Error fetching job IDs for static generation:", error);
    return [];
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.id);

  if (!job) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === job.image);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux offres
            </Link>
        </Button>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-80 w-full">
            {placeholder && (
              <Image
                src={placeholder.imageUrl}
                alt={placeholder.description}
                data-ai-hint={placeholder.imageHint}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute top-4 right-4 bg-card p-3 rounded-full shadow-lg">
                <JobIcon category={job.category} className="h-8 w-8 text-foreground" />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <Badge variant="secondary" className="mb-4 capitalize">{job.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">{job.title}</h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <span>{formatSalary(job.salary, job.salaryType)}</span>
                </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8">{job.description}</p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold font-headline mb-4">Conditions requises</h2>
                    <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <span>{req}</span>
                        </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-6 border-t">
                    <h2 className="text-xl font-bold font-headline mb-4">Intéressé(e)?</h2>
                    <p className="text-muted-foreground mb-4">Cliquez sur le bouton ci-dessous pour envoyer les détails de cette offre via WhatsApp.</p>
                    <WhatsAppButton jobTitle={job.title} jobLocation={job.location} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
