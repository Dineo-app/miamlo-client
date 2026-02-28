import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

// ─── Types ──────────────────────────────────────────────────────────────────────
interface PublicChefResponse {
  id: string;
  firstName: string;
  lastName: string;
  chefCoverImg: string | null;
  description: string | null;
  address: string | null;
  categories: string[];
  chefCertifications: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  distanceKm: number | null;
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
  items: PublicChefResponse[];
  pagination: PaginationInfo;
}

// ─── Category emoji map ─────────────────────────────────────────────────────────
const CATEGORY_EMOJIS: Record<string, string> = {
  'Entrée': '🥗', 'Plat principal': '🍽️', 'Dessert': '🍰', 'Petit déjeuner': '🥐',
  'Brunch': '🥞', 'Apéro': '🍷', 'Tunisien': '🇹🇳', 'Italien': '🇮🇹',
  'Français': '🇫🇷', 'Mexicain': '🇲🇽', 'Japonais': '🇯🇵', 'Chinois': '🇨🇳',
  'Indien': '🇮🇳', 'Américain': '🇺🇸', 'Libanais': '🇱🇧', 'Marocain': '🇲🇦',
  'Turc': '🇹🇷', 'Grec': '🇬🇷', 'Espagnol': '🇪🇸', 'Thaïlandais': '🇹🇭',
  'Vietnamien': '🇻🇳', 'Coréen': '🇰🇷', 'Algérien': '🇩🇿', 'Pizza': '🍕',
  'Pâtes': '🍝', 'Burger': '🍔', 'Sushi': '🍣', 'Tacos': '🌮',
  'Végétarien': '🥬', 'Vegan': '🌱', 'Couscous': '🍚', 'Tajine': '🥘',
  'Kebab': '🥙', 'Curry': '🍛', 'Ramen': '🍜',
};
const getCategoryEmoji = (cat: string) => CATEGORY_EMOJIS[cat] || '🍴';

// ─── SVG Icons ──────────────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconStar = () => (
  <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IconMapPin = () => (
  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconLocation = () => (
  <svg className="w-16 h-16 text-[#ffd60a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// ─── ChefsPage component ────────────────────────────────────────────────────────
const ChefsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Location state — restore from localStorage
  const [locationStatus, setLocationStatus] = useState<'idle' | 'asking' | 'loading' | 'granted' | 'denied'>(() => {
    const saved = localStorage.getItem('miamlo_user_location');
    if (saved) {
      try {
        const { lat, lng, ts } = JSON.parse(saved);
        if (Date.now() - ts < 24 * 60 * 60 * 1000 && lat && lng) return 'granted';
      } catch { /* ignore */ }
    }
    return 'idle';
  });
  const [latitude, setLatitude] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('miamlo_user_location');
      if (saved) { const { lat, ts } = JSON.parse(saved); if (Date.now() - ts < 24 * 60 * 60 * 1000) return lat; }
    } catch { /* ignore */ }
    return null;
  });
  const [longitude, setLongitude] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('miamlo_user_location');
      if (saved) { const { lng, ts } = JSON.parse(saved); if (Date.now() - ts < 24 * 60 * 60 * 1000) return lng; }
    } catch { /* ignore */ }
    return null;
  });

  // Data state
  const [chefs, setChefs] = useState<PublicChefResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for backend
  const pageSize = 12;

  // Refs
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // SEO
  useEffect(() => {
    document.title = t('chefs.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('chefs.seoDescription'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('chefs.seoDescription');
      document.head.appendChild(meta);
    }
  }, [t]);

  // Ask for location on mount (skip if restored)
  useEffect(() => {
    if (locationStatus === 'granted' && latitude !== null && longitude !== null) return;
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
    setLocationStatus('asking');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch chefs
  const fetchChefs = useCallback(async (page: number = 0) => {
    if (latitude === null || longitude === null) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/public/chefs/nearby`, {
        params: { latitude, longitude, radiusKm: 30, page, pageSize },
      });

      if (res.data?.success) {
        const data: PaginatedResponse = res.data.data;
        let items = data.items;

        // Client-side search filter
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          items = items.filter(c =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
            c.categories?.some(cat => cat.toLowerCase().includes(q)) ||
            c.description?.toLowerCase().includes(q)
          );
        }

        setChefs(items);
        setPagination(data.pagination);
      } else {
        setChefs([]);
        setPagination(null);
      }
    } catch {
      setError(t('chefs.errorFetchChefs'));
      setChefs([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, searchQuery, pageSize, t]);

  // Fetch when location granted or page changes
  useEffect(() => {
    if (locationStatus === 'granted' && latitude !== null && longitude !== null) {
      fetchChefs(currentPage);
    }
  }, [locationStatus, latitude, longitude, currentPage, fetchChefs]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(0);
    }, 400);
  };

  // Request geolocation & persist
  const requestLocation = () => {
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationStatus('granted');
        localStorage.setItem('miamlo_user_location', JSON.stringify({ lat, lng, ts: Date.now() }));
      },
      () => { setLocationStatus('denied'); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Page change (display is 1-based, backend is 0-based)
  const goToPage = (displayPage: number) => {
    setCurrentPage(displayPage - 1);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long', year: 'numeric',
      });
    } catch { return ''; }
  };

  // ─── RENDER: Location modal ─────────────────────────────────────────────────
  const renderLocationModal = () => {
    if (locationStatus !== 'asking') return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_24px_48px_rgba(0,0,0,0.2)] text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#ffd60a]/15 flex items-center justify-center">
            <IconLocation />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('chefs.locationModalTitle')}
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {t('chefs.locationModalDescription')}
          </p>
          <button
            onClick={requestLocation}
            className="w-full px-6 py-3 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-base transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)] mb-3"
          >
            {t('chefs.locationModalButton')}
          </button>
          <button
            onClick={() => setLocationStatus('denied')}
            className="w-full px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            {t('chefs.locationModalDismiss')}
          </button>
        </div>
      </div>
    );
  };

  // ─── RENDER: Location denied ────────────────────────────────────────────────
  const renderLocationDenied = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-28 h-28 rounded-full bg-[#ffd60a]/10 flex items-center justify-center mb-6">
        <svg className="w-14 h-14 text-[#ffd60a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {t('chefs.locationDeniedTitle')}
      </h2>
      <p className="text-gray-600 mb-2 max-w-md leading-relaxed">{t('chefs.locationDeniedDescription')}</p>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">{t('chefs.locationDeniedHint')}</p>
      <button
        onClick={requestLocation}
        className="px-8 py-3 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-base transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)]"
      >
        {t('chefs.locationDeniedButton')}
      </button>
    </div>
  );

  // ─── RENDER: Loading skeleton ───────────────────────────────────────────────
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] animate-pulse">
          <div className="h-40 bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── RENDER: Chef card ──────────────────────────────────────────────────────
  const renderChefCard = (chef: PublicChefResponse) => (
    <div
      key={chef.id}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group cursor-pointer flex flex-col"
      onClick={() => navigate(`/chefs/${chef.id}`)}
    >
      {/* Cover image */}
      <div className="relative h-40 overflow-hidden">
        {chef.chefCoverImg ? (
          <img
            src={chef.chefCoverImg}
            alt={`${chef.firstName} ${chef.lastName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#ffd60a]/20 to-[#ffd60a]/5 flex items-center justify-center">
            <span className="text-5xl opacity-40">👩‍🍳</span>
          </div>
        )}

        {/* Distance badge */}
        {chef.distanceKm !== null && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <IconMapPin />
            <span className="text-xs font-semibold text-gray-700">{chef.distanceKm.toFixed(1)} {t('chefs.distance')}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name + rating row */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-base leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {chef.firstName} {chef.lastName}
            </h3>
            {chef.createdAt && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {t('chefs.memberSince', { date: formatDate(chef.createdAt) })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <IconStar />
            <span className="text-sm font-semibold text-gray-800">
              {chef.averageRating > 0 ? chef.averageRating.toFixed(1) : '—'}
            </span>
            {chef.totalReviews > 0 && (
              <span className="text-xs text-gray-400">({chef.totalReviews})</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {chef.description || t('chefs.noDescription')}
        </p>

        {/* Categories */}
        {chef.categories && chef.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chef.categories.slice(0, 4).map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffd60a]/10 text-[11px] font-medium text-gray-700"
              >
                {getCategoryEmoji(cat)} {cat}
              </span>
            ))}
            {chef.categories.length > 4 && (
              <span className="px-2 py-1 rounded-full bg-gray-100 text-[11px] text-gray-500">
                +{chef.categories.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* View profile button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/chefs/${chef.id}`); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#ffd60a] hover:bg-[#ffcc00] text-sm font-semibold transition-all shadow-sm hover:shadow-md mt-1"
        >
          {t('chefs.viewProfile')}
          <IconArrowRight />
        </button>
      </div>
    </div>
  );

  // ─── RENDER: Empty state ────────────────────────────────────────────────────
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-5">
        <span className="text-5xl">👩‍🍳</span>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {t('chefs.noChefsTitle')}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {searchQuery ? t('chefs.noChefsWithSearch') : t('chefs.noChefsDescription')}
      </p>
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery(''); setCurrentPage(0); }}
          className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
        >
          {t('chefs.retry')}
        </button>
      )}
    </div>
  );

  // ─── RENDER: Pagination ─────────────────────────────────────────────────────
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const displayPage = pagination.currentPage; // already 1-based from backend
    const { totalPages, totalItems } = pagination;
    const from = (displayPage - 1) * pageSize + 1;
    const to = Math.min(displayPage * pageSize, totalItems);

    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (displayPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, displayPage - 1); i <= Math.min(totalPages - 1, displayPage + 1); i++) pages.push(i);
      if (displayPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {t('chefs.paginationShowing', { from, to, total: totalItems })}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goToPage(displayPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <IconChevronLeft />
            <span className="hidden sm:inline">{t('chefs.paginationPrevious')}</span>
          </button>
          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === displayPage ? 'bg-[#ffd60a] font-bold shadow-sm' : 'hover:bg-gray-100'}`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => goToPage(displayPage + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <span className="hidden sm:inline">{t('chefs.paginationNext')}</span>
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

      {locationStatus === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-[#ffd60a] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">{t('chefs.locationLoading')}</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 pb-16">
        {/* HERO */}
        <section className="bg-[#ffd60a] rounded-[32px] p-8 sm:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>{t('chefs.heroBadge')}</span>
            </div>
            <h1 className="text-2xl sm:text-[2.3rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('chefs.heroTitle')}
            </h1>
            <p className="text-sm sm:text-base mb-4 max-w-[32rem] leading-relaxed">
              {t('chefs.heroDescription')}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('chefs.heroTag1')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('chefs.heroTag2')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('chefs.heroTag3')}</div>
            </div>
          </div>
        </section>

        {/* Location denied */}
        {(locationStatus === 'denied' || locationStatus === 'idle') && renderLocationDenied()}

        {/* Content */}
        {locationStatus === 'granted' && (
          <>
            {/* Search bar */}
            <div ref={resultsRef} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconSearch />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('chefs.searchPlaceholder')}
                  className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-gray-200 bg-[#fafaf7] text-sm focus:outline-none focus:border-[#ffd60a] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setCurrentPage(0); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IconX />
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            {pagination && !isLoading && (
              <p className="text-sm text-gray-500 mb-4">
                {t(pagination.totalItems === 1 ? 'chefs.resultsCount' : 'chefs.resultsCount_plural', {
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
                  onClick={() => fetchChefs(currentPage)}
                  className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
                >
                  {t('chefs.retry')}
                </button>
              </div>
            ) : chefs.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {chefs.map(renderChefCard)}
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

export default ChefsPage;
