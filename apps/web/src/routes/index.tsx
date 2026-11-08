import { createFileRoute, redirect } from '@tanstack/react-router';

/** Tant que l'accueil n'existe pas (TR4), la page des résultats en tient lieu. */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/resultats' });
  },
});
