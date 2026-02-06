/**
 * Static categories for dishes with emojis
 * Categories are organized by type: Course, Cuisine, and Dish Type
 */

export interface Category {
  id: string;
  name: string;
  emoji: string;
  type: 'course' | 'cuisine' | 'dish-type';
}

export const DISH_CATEGORIES: Category[] = [
  // Course Types (French culinary courses)
  { id: 'entree', name: 'Entrée', emoji: '🥗', type: 'course' },
  { id: 'plat-principal', name: 'Plat principal', emoji: '🍽️', type: 'course' },
  { id: 'dessert', name: 'Dessert', emoji: '🍰', type: 'course' },
  { id: 'petit-dejeuner', name: 'Petit déjeuner', emoji: '🥐', type: 'course' },
  { id: 'brunch', name: 'Brunch', emoji: '🥞', type: 'course' },
  { id: 'apero', name: 'Apéro', emoji: '🍷', type: 'course' },
  
  // World Cuisines
  { id: 'tunisien', name: 'Tunisien', emoji: '🇹🇳', type: 'cuisine' },
  { id: 'italien', name: 'Italien', emoji: '🇮🇹', type: 'cuisine' },
  { id: 'francais', name: 'Français', emoji: '🇫🇷', type: 'cuisine' },
  { id: 'mexicain', name: 'Mexicain', emoji: '🇲🇽', type: 'cuisine' },
  { id: 'japonais', name: 'Japonais', emoji: '🇯🇵', type: 'cuisine' },
  { id: 'chinois', name: 'Chinois', emoji: '🇨🇳', type: 'cuisine' },
  { id: 'indien', name: 'Indien', emoji: '🇮🇳', type: 'cuisine' },
  { id: 'americain', name: 'Américain', emoji: '🇺🇸', type: 'cuisine' },
  { id: 'libanais', name: 'Libanais', emoji: '🇱🇧', type: 'cuisine' },
  { id: 'marocain', name: 'Marocain', emoji: '🇲🇦', type: 'cuisine' },
  { id: 'turc', name: 'Turc', emoji: '🇹🇷', type: 'cuisine' },
  { id: 'grec', name: 'Grec', emoji: '🇬🇷', type: 'cuisine' },
  { id: 'espagnol', name: 'Espagnol', emoji: '🇪🇸', type: 'cuisine' },
  { id: 'thai', name: 'Thaïlandais', emoji: '🇹🇭', type: 'cuisine' },
  { id: 'vietnamien', name: 'Vietnamien', emoji: '🇻🇳', type: 'cuisine' },
  { id: 'coreen', name: 'Coréen', emoji: '🇰🇷', type: 'cuisine' },
  { id: 'algerien', name: 'Algérien', emoji: '🇩🇿', type: 'cuisine' },
  { id: 'egyptien', name: 'Égyptien', emoji: '🇪🇬', type: 'cuisine' },
  { id: 'bresilien', name: 'Brésilien', emoji: '🇧🇷', type: 'cuisine' },
  { id: 'argentin', name: 'Argentin', emoji: '🇦🇷', type: 'cuisine' },
  { id: 'peruvien', name: 'Péruvien', emoji: '🇵🇪', type: 'cuisine' },
  { id: 'portugais', name: 'Portugais', emoji: '🇵🇹', type: 'cuisine' },
  { id: 'caribeen', name: 'Caribéen', emoji: '🏝️', type: 'cuisine' },
  { id: 'africain', name: 'Africain', emoji: '🌍', type: 'cuisine' },
  { id: 'russe', name: 'Russe', emoji: '🇷🇺', type: 'cuisine' },
  { id: 'mediterraneen', name: 'Méditerranéen', emoji: '🌊', type: 'cuisine' },
  { id: 'oriental', name: 'Oriental', emoji: '🕌', type: 'cuisine' },
  { id: 'fusion', name: 'Fusion', emoji: '🌐', type: 'cuisine' },
  
  // Popular Dish Types
  { id: 'pizza', name: 'Pizza', emoji: '🍕', type: 'dish-type' },
  { id: 'pasta', name: 'Pâtes', emoji: '🍝', type: 'dish-type' },
  { id: 'burger', name: 'Burger', emoji: '🍔', type: 'dish-type' },
  { id: 'sushi', name: 'Sushi', emoji: '🍣', type: 'dish-type' },
  { id: 'tacos', name: 'Tacos', emoji: '🌮', type: 'dish-type' },
  { id: 'sandwich', name: 'Sandwich', emoji: '🥪', type: 'dish-type' },
  { id: 'salade', name: 'Salade', emoji: '🥗', type: 'dish-type' },
  { id: 'soupe', name: 'Soupe', emoji: '🍲', type: 'dish-type' },
  { id: 'grillade', name: 'Grillade', emoji: '🍖', type: 'dish-type' },
  { id: 'barbecue', name: 'Barbecue', emoji: '🔥', type: 'dish-type' },
  { id: 'poulet', name: 'Poulet', emoji: '🍗', type: 'dish-type' },
  { id: 'poisson', name: 'Poisson', emoji: '🐟', type: 'dish-type' },
  { id: 'fruits-mer', name: 'Fruits de mer', emoji: '🦞', type: 'dish-type' },
  { id: 'vegetarien', name: 'Végétarien', emoji: '🥬', type: 'dish-type' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱', type: 'dish-type' },
  { id: 'wrap', name: 'Wrap', emoji: '🌯', type: 'dish-type' },
  { id: 'ramen', name: 'Ramen', emoji: '🍜', type: 'dish-type' },
  { id: 'curry', name: 'Curry', emoji: '🍛', type: 'dish-type' },
  { id: 'kebab', name: 'Kebab', emoji: '🥙', type: 'dish-type' },
  { id: 'crepe', name: 'Crêpe', emoji: '🥞', type: 'dish-type' },
  { id: 'gateau', name: 'Gâteau', emoji: '🎂', type: 'dish-type' },
  { id: 'patisserie', name: 'Pâtisserie', emoji: '🧁', type: 'dish-type' },
  { id: 'glace', name: 'Glace', emoji: '🍨', type: 'dish-type' },
  { id: 'couscous', name: 'Couscous', emoji: '🍚', type: 'dish-type' },
  { id: 'tajine', name: 'Tajine', emoji: '🥘', type: 'dish-type' },
  { id: 'paella', name: 'Paella', emoji: '🥘', type: 'dish-type' },
  { id: 'risotto', name: 'Risotto', emoji: '🍚', type: 'dish-type' },
  { id: 'wok', name: 'Wok', emoji: '🥡', type: 'dish-type' },
  { id: 'nems', name: 'Nems', emoji: '🥟', type: 'dish-type' },
  { id: 'dim-sum', name: 'Dim Sum', emoji: '🥟', type: 'dish-type' },
  { id: 'poke-bowl', name: 'Poké Bowl', emoji: '🥙', type: 'dish-type' },
  { id: 'bowl', name: 'Bowl', emoji: '🥗', type: 'dish-type' },
  { id: 'steak', name: 'Steak', emoji: '🥩', type: 'dish-type' },
  { id: 'frites', name: 'Frites', emoji: '🍟', type: 'dish-type' },
  { id: 'omelette', name: 'Omelette', emoji: '🍳', type: 'dish-type' },
  { id: 'quiche', name: 'Quiche', emoji: '🥧', type: 'dish-type' },
  { id: 'tarte', name: 'Tarte', emoji: '🥧', type: 'dish-type' },
];

/**
 * Get category by name (case-insensitive)
 */
export const getCategoryByName = (name: string): Category | undefined => {
  const normalizedName = name.toLowerCase().trim();
  return DISH_CATEGORIES.find(cat => 
    cat.name.toLowerCase() === normalizedName || 
    cat.id === normalizedName
  );
};

/**
 * Get emoji for a category name
 */
export const getCategoryEmoji = (name: string): string => {
  const category = getCategoryByName(name);
  return category?.emoji || '🍽️';
};

/**
 * Get categories by type
 */
export const getCategoriesByType = (type: 'course' | 'cuisine' | 'dish-type'): Category[] => {
  return DISH_CATEGORIES.filter(cat => cat.type === type);
};

/**
 * Get all category names
 */
export const getAllCategoryNames = (): string[] => {
  return DISH_CATEGORIES.map(cat => cat.name);
};
