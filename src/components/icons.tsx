import type { JobCategory } from '@/lib/types';
import { Baby, Car, ConciergeBell, LucideProps } from 'lucide-react';
import type { FC } from 'react';

const BroomIcon: FC<LucideProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19.4 12.6a4 4 0 0 0-5.6 0l-6 6a4 4 0 0 0-1.2 2.7l-1.3 4.1a.5.5 0 0 0 .6.6l4.1-1.3a4 4 0 0 0 2.7-1.2l6-6a4 4 0 0 0 0-5.6Z" />
    <path d="m14.3 17.5 2.8-2.8" />
    <path d="M18 14V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3" />
    <path d="M22 5h-5" />
  </svg>
);

export const jobIcons: Record<JobCategory, FC<LucideProps>> = {
  housekeeper: BroomIcon,
  nanny: Baby,
  driver: Car,
  butler: ConciergeBell,
};

export const JobIcon: FC<{ category: JobCategory; className?: string }> = ({ category, className }) => {
  const IconComponent = jobIcons[category] || BroomIcon;
  return <IconComponent className={className} />;
};
