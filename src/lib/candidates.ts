import type { RecommendedCandidates } from "@/ai/flows/recommend-relevant-jobs";

export const fallbackCandidates: RecommendedCandidates = [
  {
    name: 'Aïcha Koné',
    skills: ['Nettoyage complet', 'Repassage', 'Cuisine simple'],
    experience: '5 ans d\'expérience comme employée de maison pour des familles à Cocody. Références disponibles sur demande.',
    location: 'Abidjan, Cocody',
    expectedSalary: 80000,
    availability: 'Immédiate'
  },
  {
    name: 'Bintou Traoré',
    skills: ['Garde d\'enfants (2-5 ans)', 'Activités d\'éveil', 'Premiers secours'],
    experience: 'A travaillé 3 ans dans une crèche à Marcory et 2 ans comme nounou à domicile. Aime les enfants et est très patiente.',
    location: 'Abidjan, Marcory',
    expectedSalary: 120000,
    availability: 'Sous 2 semaines'
  },
  {
    name: 'Moussa Diarra',
    skills: ['Conduite sécuritaire', 'Entretien de véhicule', 'Excellente connaissance d\'Abidjan'],
    experience: 'Chauffeur pour une société de transport pendant 4 ans, puis chauffeur privé pour un directeur d\'entreprise pendant 6 ans.',
    location: 'Toute la zone d\'Abidjan',
    expectedSalary: 175000,
    availability: 'Immédiate'
  }
];
