import type { Job } from '@/lib/types';

// This file is now a fallback or for seeding, data is fetched from Firestore.
export const jobs: Job[] = [
  {
    id: '1',
    title: 'Femme de Ménage Expérimentée',
    category: 'housekeeper',
    location: 'Abidjan, Cocody',
    salary: 75000,
    salaryType: 'month',
    description: 'Recherche une femme de ménage méticuleuse et fiable pour un appartement de 150m². Tâches incluant nettoyage complet, repassage et gestion du linge. Expérience avec les surfaces délicates est un plus.',
    requirements: ['3+ ans d\'expérience', 'Références vérifiables', 'Autonome et pro-active', 'Français courant'],
    image: 'housekeeper-1',
  },
  {
    id: '2',
    title: 'Nanny Anglophone pour Deux Enfants',
    category: 'nanny',
    location: 'Abidjan, Riviera',
    salary: 150000,
    salaryType: 'month',
    description: 'Famille cherche une nanny anglophone pour s\'occuper de deux enfants (3 et 5 ans) à temps plein. Responsabilités : sorties d\'école, activités ludiques et éducatives, préparation des repas.',
    requirements: ['Anglais langue maternelle ou bilingue', 'Expérience avec les jeunes enfants', 'Certification premiers secours', 'Permis de conduire B'],
    image: 'nanny-1',
  },
  {
    id: '3',
    title: 'Chauffeur Privé pour Famille',
    category: 'driver',
    location: 'Abidjan, Marcory',
    salary: 180000,
    salaryType: 'month',
    description: 'Recherche chauffeur privé discret et professionnel pour assurer les déplacements d\'une famille. Conduite de véhicules de luxe. Flexibilité horaire requise.',
    requirements: ['5+ ans d\'expérience comme chauffeur privé', 'Casier judiciaire vierge', 'Excellente connaissance d\'Abidjan', 'Présentation impeccable'],
    image: 'driver-1',
  },
];
