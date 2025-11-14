import type { Timestamp } from "firebase/firestore";

export type JobCategory = 'housekeeper' | 'nanny' | 'driver' | 'butler';

export type Job = {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  salary: number;
  salaryType: 'hour' | 'month' | 'year' | 'day';
  description: string;
  requirements: string[];
  image: string; // id from placeholder-images.json
  createdAt?: Timestamp;
};
