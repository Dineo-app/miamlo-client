// Utility functions

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
};

// Add more utility functions as needed
