import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface PlatPromotion {
  id: string;
  platId: string;
  reductionValue: number;
  reductionEnds: string;
  isActive: boolean;
}

interface PlatChef {
  id: string;
  firstName: string;
  lastName: string;
  chefCoverImg: string | null;
  averageRating: number;
}

interface PublicPlatResponse {
  id: string;
  name: string;
  description: string;
  estimatedCookTime: number;
  price: number;
  categories: string[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  promotion: PlatPromotion | null;
  chef: PlatChef;
  averageRating: number;
  distanceKm: number | null;
  isChefOpen: boolean;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse {
  items: PublicPlatResponse[];
  pagination: PaginationInfo;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'cookTime';

// ─── Category helper (emoji mapping) ────────────────────────────────────────────
const CATEGORY_EMOJIS: Record<string, string> = {
  'Entrée': '🥗', 'Plat principal': '🍽️', 'Dessert': '🍰', 'Petit déjeuner': '🥐',
  'Brunch': '🥞', 'Apéro': '🍷', 'Tunisien': '🇹🇳', 'Italien': '🇮🇹',
  'Français': '🇫🇷', 'Mexicain': '🇲🇽', 'Japonais': '🇯🇵', 'Chinois': '🇨🇳',
  'Indien': '🇮🇳', 'Américain': '🇺🇸', 'Libanais': '🇱🇧', 'Marocain': '🇲🇦',
  'Turc': '🇹🇷', 'Grec': '🇬🇷', 'Espagnol': '🇪🇸', 'Thaïlandais': '🇹🇭',
  'Vietnamien': '🇻🇳', 'Coréen': '🇰🇷', 'Algérien': '🇩🇿', 'Égyptien': '🇪🇬',
  'Brésilien': '🇧🇷', 'Pizza': '🍕', 'Pâtes': '🍝', 'Burger': '🍔',
  'Sushi': '🍣', 'Tacos': '🌮', 'Sandwich': '🥪', 'Salade': '🥗',
  'Soupe': '🍲', 'Grillade': '🍖', 'Barbecue': '🔥', 'Poulet': '🍗',
  'Poisson': '🐟', 'Végétarien': '🥬', 'Vegan': '🌱', 'Couscous': '🍚',
  'Tajine': '🥘', 'Kebab': '🥙', 'Curry': '🍛', 'Ramen': '🍜',
  'Crêpe': '🥞', 'Gâteau': '🎂', 'Pâtisserie': '🧁', 'Glace': '🍨',
};

const getCategoryEmoji = (cat: string) => CATEGORY_EMOJIS[cat] || '🍴';

// ─── SVG Icons (inline for zero deps) ──────────────────────────────────────────
const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconStar = () => (
  <svg className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IconClock = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <polyline points="12 6 12 12 16 14" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
const IconMapPin = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconChefHat = () => (
  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-1.5 0-2.8.6-3.8 1.5A5.5 5.5 0 003 9.5C3 12.5 5 15 5 15h14s2-2.5 2-5.5a5.5 5.5 0 00-5.2-5A5 5 0 0012 3zM7 15v2a2 2 0 002 2h6a2 2 0 002-2v-2" />
  </svg>
);
const IconLocation = () => (
  <svg className="w-16 h-16 text-[#ffd60a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconTag = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconFilter = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);
const IconChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const IconChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── PlatsPage component ────────────────────────────────────────────────────────
const PlatsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Location state — restore from localStorage if available
  const [locationStatus, setLocationStatus] = useState<'idle' | 'asking' | 'loading' | 'granted' | 'denied'>(() => {
    const saved = localStorage.getItem('miamlo_user_location');
    if (saved) {
      try {
        const { lat, lng, ts } = JSON.parse(saved);
        // Expire stored location after 24 hours
        if (Date.now() - ts < 24 * 60 * 60 * 1000 && lat && lng) {
          return 'granted';
        }
      } catch { /* ignore corrupt data */ }
    }
    return 'idle';
  });
  const [latitude, setLatitude] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('miamlo_user_location');
      if (saved) {
        const { lat, ts } = JSON.parse(saved);
        if (Date.now() - ts < 24 * 60 * 60 * 1000) return lat;
      }
    } catch { /* ignore */ }
    return null;
  });
  const [longitude, setLongitude] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('miamlo_user_location');
      if (saved) {
        const { lng, ts } = JSON.parse(saved);
        if (Date.now() - ts < 24 * 60 * 60 * 1000) return lng;
      }
    } catch { /* ignore */ }
    return null;
  });

  // Data state
  const [plats, setPlats] = useState<PublicPlatResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;

  // Refs
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // SEO
  useEffect(() => {
    document.title = t('plats.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('plats.seoDescription'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('plats.seoDescription');
      document.head.appendChild(meta);
    }
  }, [t]);

  // Ask for location on mount (skip if already restored from storage)
  useEffect(() => {
    if (locationStatus === 'granted' && latitude !== null && longitude !== null) return;
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('asking');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch categories whenever location is obtained
  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/public/plats/categories`, {
          params: { latitude, longitude, radiusKm: 30 },
        });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch {
        // Silently ignore — categories are optional
      }
    };

    fetchCategories();
  }, [latitude, longitude]);

  // Fetch plats
  const fetchPlats = useCallback(async (page: number = 1) => {
    if (latitude === null || longitude === null) return;

    setIsLoading(true);
    setError(null);

    // Build sort params
    let sortBy: string | undefined;
    let sortOrder: string | undefined;
    switch (sortOption) {
      case 'newest': sortBy = 'newest'; sortOrder = 'desc'; break;
      case 'price_asc': sortBy = 'price'; sortOrder = 'asc'; break;
      case 'price_desc': sortBy = 'price'; sortOrder = 'desc'; break;
      case 'rating': sortBy = 'rating'; sortOrder = 'desc'; break;
      case 'cookTime': sortBy = 'cookTime'; sortOrder = 'asc'; break;
    }

    try {
      const params: Record<string, string | number> = {
        latitude,
        longitude,
        radiusKm: 30,
        page,
        pageSize,
      };
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      if (maxCookTime) params.maxCookTime = maxCookTime;
      if (minRating) params.minRating = minRating;

      const res = await axios.get(`${API_BASE_URL}/public/plats/search`, { params });

      if (res.data?.success) {
        const data: PaginatedResponse = res.data.data;
        setPlats(data.items);
        setPagination(data.pagination);
      } else {
        setPlats([]);
        setPagination(null);
      }
    } catch {
      setError(t('plats.errorFetchPlats'));
      setPlats([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, searchQuery, selectedCategory, sortOption, maxCookTime, minRating, pageSize, t]);

  // Fetch when location granted or filters change
  useEffect(() => {
    if (locationStatus === 'granted' && latitude !== null && longitude !== null) {
      fetchPlats(currentPage);
    }
  }, [locationStatus, latitude, longitude, currentPage, fetchPlats]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
  };

  // Request geolocation & persist to localStorage
  const requestLocation = () => {
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationStatus('granted');
        // Save to localStorage (valid for 24h)
        localStorage.setItem('miamlo_user_location', JSON.stringify({ lat, lng, ts: Date.now() }));
      },
      () => {
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Page change
  const goToPage = (page: number) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Calculate discounted price
  const getDiscountedPrice = (plat: PublicPlatResponse) => {
    if (plat.promotion?.isActive && plat.promotion.reductionValue > 0) {
      return plat.price * (1 - plat.promotion.reductionValue / 100);
    }
    return null;
  };

  // ─── RENDER: Location modal ─────────────────────────────────────────────────
  const renderLocationModal = () => {
    if (locationStatus !== 'asking') return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_24px_48px_rgba(0,0,0,0.2)] text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#ffd60a]/15 flex items-center justify-center">
            <IconLocation />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('plats.locationModalTitle')}
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {t('plats.locationModalDescription')}
          </p>
          <button
            onClick={requestLocation}
            className="w-full px-6 py-3 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-base transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)] mb-3"
          >
            {t('plats.locationModalButton')}
          </button>
          <button
            onClick={() => setLocationStatus('denied')}
            className="w-full px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            {t('plats.locationModalDismiss')}
          </button>
        </div>
      </div>
    );
  };

  // ─── RENDER: Location denied / empty state ──────────────────────────────────
  const renderLocationDenied = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-28 h-28 rounded-full bg-[#ffd60a]/10 flex items-center justify-center mb-6">
        <svg className="w-14 h-14 text-[#ffd60a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {t('plats.locationDeniedTitle')}
      </h2>
      <p className="text-gray-600 mb-2 max-w-md leading-relaxed">
        {t('plats.locationDeniedDescription')}
      </p>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">
        {t('plats.locationDeniedHint')}
      </p>
      <button
        onClick={requestLocation}
        className="px-8 py-3 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-base transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)]"
      >
        {t('plats.locationDeniedButton')}
      </button>
    </div>
  );

  // ─── RENDER: Loading skeleton ───────────────────────────────────────────────
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] animate-pulse">
          <div className="h-44 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-3">
              <div className="h-3 bg-gray-200 rounded w-12" />
              <div className="h-3 bg-gray-200 rounded w-12" />
              <div className="h-3 bg-gray-200 rounded w-12" />
            </div>
            <div className="flex justify-between items-center pt-1">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── RENDER: Plat card ──────────────────────────────────────────────────────
  const renderPlatCard = (plat: PublicPlatResponse) => {
    const discountedPrice = getDiscountedPrice(plat);
    const hasPromo = discountedPrice !== null;

    return (
      <div
        key={plat.id}
        className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group cursor-pointer flex flex-col"
        onClick={() => navigate(`/plats/${plat.id}`)}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {plat.imageUrl ? (
            <img
              src={plat.imageUrl}
              alt={plat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ffd60a]/20 to-[#ffd60a]/5 flex items-center justify-center">
              <span className="text-5xl opacity-40">🍽️</span>
            </div>
          )}

          {/* Promo badge */}
          {hasPromo && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
              <IconTag />
              <span className="text-xs font-bold text-red-600">
                {t('plats.promoLabel', { value: plat.promotion!.reductionValue })}
              </span>
            </div>
          )}

          {/* Chef status badge */}
          <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${plat.isChefOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
            {plat.isChefOpen ? t('plats.chefOpen') : t('plats.chefClosed')}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Name */}
          <h3 className="font-bold text-[0.95rem] leading-snug mb-1.5 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {plat.name}
          </h3>

          {/* Chef */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <IconChefHat />
            <span className="text-xs text-green-700 font-medium truncate">
              {plat.chef.firstName} {plat.chef.lastName}
            </span>
          </div>

          {/* Meta: rating, cook time, distance */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <IconStar />
              <span className="font-medium text-gray-700">{plat.averageRating > 0 ? plat.averageRating.toFixed(1) : '—'}</span>
            </div>
            <div className="flex items-center gap-1">
              <IconClock />
              <span>{plat.estimatedCookTime} {t('plats.cookTime')}</span>
            </div>
            {plat.distanceKm !== null && (
              <div className="flex items-center gap-1">
                <IconMapPin />
                <span>{plat.distanceKm.toFixed(1)} {t('plats.distance')}</span>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price + Add button */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {hasPromo ? (
                <>
                  <span className="text-base font-bold text-red-600">
                    {discountedPrice!.toFixed(2)} €
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {plat.price.toFixed(2)} €
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-900">
                  {plat.price.toFixed(2)} €
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/plats/${plat.id}`);
              }}
              className="w-9 h-9 rounded-full bg-[#ffd60a] hover:bg-[#ffcc00] flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
              title={t('plats.addToCart')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER: Empty state ────────────────────────────────────────────────────
  const renderEmptyState = () => {
    const hasFilters = searchQuery || selectedCategory || maxCookTime || minRating;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <span className="text-5xl">🍽️</span>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {t('plats.noPlatsTitle')}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {hasFilters ? t('plats.noPlatsWithFilters') : t('plats.noPlatsDescription')}
        </p>
        {hasFilters && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setMaxCookTime(null);
              setMinRating(null);
              setCurrentPage(1);
            }}
            className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
          >
            {t('plats.filterReset')}
          </button>
        )}
      </div>
    );
  };

  // ─── RENDER: Pagination ─────────────────────────────────────────────────────
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage: cp, totalPages, totalItems } = pagination;
    const from = (cp - 1) * pageSize + 1;
    const to = Math.min(cp * pageSize, totalItems);

    // Generate page numbers to show
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cp > 3) pages.push('ellipsis');
      for (let i = Math.max(2, cp - 1); i <= Math.min(totalPages - 1, cp + 1); i++) pages.push(i);
      if (cp < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {t('plats.paginationShowing', { from, to, total: totalItems })}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(cp - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <IconChevronLeft />
            <span className="hidden sm:inline">{t('plats.paginationPrevious')}</span>
          </button>

          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === cp ? 'bg-[#ffd60a] font-bold shadow-sm' : 'hover:bg-gray-100'}`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(cp + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">{t('plats.paginationNext')}</span>
            <IconChevronRight />
          </button>
        </div>
      </div>
    );
  };

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {renderLocationModal()}

      {/* Location loading overlay */}
      {locationStatus === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-[#ffd60a] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">{t('plats.locationLoading')}</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-16">
        {/* HERO SECTION */}
        <section className="bg-[#ffd60a] rounded-[32px] p-8 sm:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>{t('plats.heroBadge')}</span>
            </div>
            <h1 className="text-2xl sm:text-[2.3rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('plats.heroTitle')}
            </h1>
            <p className="text-sm sm:text-base mb-4 max-w-[32rem] leading-relaxed">
              {t('plats.heroDescription')}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('plats.heroTag1')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('plats.heroTag2')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('plats.heroTag3')}</div>
            </div>
          </div>
        </section>

        {/* If location denied or idle, show empty/denied state */}
        {(locationStatus === 'denied' || locationStatus === 'idle') && renderLocationDenied()}

        {/* If location granted, show content */}
        {locationStatus === 'granted' && (
          <>
            {/* Search & Filters bar */}
            <div ref={resultsRef} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconSearch />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={t('plats.searchPlaceholder')}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafaf7] text-sm focus:outline-none focus:border-[#ffd60a] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <IconX />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value as SortOption); setCurrentPage(1); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-[#fafaf7] text-sm focus:outline-none focus:border-[#ffd60a] min-w-[160px]"
                >
                  <option value="newest">{t('plats.sortNewest')}</option>
                  <option value="price_asc">{t('plats.sortPriceLowHigh')}</option>
                  <option value="price_desc">{t('plats.sortPriceHighLow')}</option>
                  <option value="rating">{t('plats.sortRating')}</option>
                  <option value="cookTime">{t('plats.sortCookTime')}</option>
                </select>

                {/* Filter toggle button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-[#ffd60a] border-[#ffd60a]' : 'border-gray-200 hover:border-[#ffd60a] bg-[#fafaf7]'}`}
                >
                  <IconFilter />
                  {t('plats.filterTitle')}
                  {(maxCookTime || minRating) && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {(maxCookTime ? 1 : 0) + (minRating ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      {t('plats.filterMaxCookTime')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={300}
                      value={maxCookTime || ''}
                      onChange={(e) => setMaxCookTime(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="60"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-[#fafaf7] text-sm focus:outline-none focus:border-[#ffd60a]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      {t('plats.filterMinRating')}
                    </label>
                    <select
                      value={minRating || ''}
                      onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-[#fafaf7] text-sm focus:outline-none focus:border-[#ffd60a]"
                    >
                      <option value="">—</option>
                      <option value="3">3+ ⭐</option>
                      <option value="3.5">3.5+ ⭐</option>
                      <option value="4">4+ ⭐</option>
                      <option value="4.5">4.5+ ⭐</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCurrentPage(1); setShowFilters(false); }}
                      className="px-5 py-2 rounded-xl bg-[#ffd60a] hover:bg-[#ffcc00] text-sm font-semibold transition-colors"
                    >
                      {t('plats.filterApply')}
                    </button>
                    <button
                      onClick={() => {
                        setMaxCookTime(null);
                        setMinRating(null);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t('plats.filterReset')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category chips */}
            {categories.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${!selectedCategory ? 'bg-[#ffd60a] shadow-sm font-semibold' : 'bg-white border border-gray-200 hover:border-[#ffd60a]'}`}
                >
                  {t('plats.allCategories')}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setCurrentPage(1); }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${selectedCategory === cat ? 'bg-[#ffd60a] shadow-sm font-semibold' : 'bg-white border border-gray-200 hover:border-[#ffd60a]'}`}
                  >
                    {getCategoryEmoji(cat)} {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Results count */}
            {pagination && !isLoading && (
              <p className="text-sm text-gray-500 mb-4">
                {t(pagination.totalItems === 1 ? 'plats.resultsCount' : 'plats.resultsCount_plural', {
                  count: pagination.totalItems,
                })}
              </p>
            )}

            {/* Content */}
            {isLoading ? (
              renderLoadingSkeleton()
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">😕</span>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchPlats(currentPage)}
                  className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
                >
                  {t('plats.retry')}
                </button>
              </div>
            ) : plats.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {plats.map(renderPlatCard)}
                </div>
                {renderPagination()}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PlatsPage;
