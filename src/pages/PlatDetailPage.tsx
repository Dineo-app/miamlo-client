import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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

interface PlatReview {
  reviewId: string;
  platId: string;
  userId: string;
  userName: string;
  reviewText: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Category emoji map ─────────────────────────────────────────────────────────
const CATEGORY_EMOJIS: Record<string, string> = {
  'Entrée': '🥗', 'Plat principal': '🍽️', 'Dessert': '🍰', 'Petit déjeuner': '🥐',
  'Brunch': '🥞', 'Apéro': '🍷', 'Tunisien': '🇹🇳', 'Italien': '🇮🇹',
  'Français': '🇫🇷', 'Cuisine française': '🇫🇷', 'Mexicain': '🇲🇽', 'Japonais': '🇯🇵',
  'Chinois': '🇨🇳', 'Indien': '🇮🇳', 'Américain': '🇺🇸', 'Libanais': '🇱🇧',
  'Marocain': '🇲🇦', 'Turc': '🇹🇷', 'Grec': '🇬🇷', 'Espagnol': '🇪🇸',
  'Thaïlandais': '🇹🇭', 'Vietnamien': '🇻🇳', 'Coréen': '🇰🇷', 'Algérien': '🇩🇿',
  'Pizza': '🍕', 'Pâtes': '🍝', 'Pâtisserie': '🧁', 'Burger': '🍔',
  'Sushi': '🍣', 'Tacos': '🌮', 'Végétarien': '🥬', 'Vegan': '🌱',
  'Couscous': '🍚', 'Tajine': '🥘', 'Kebab': '🥙', 'Curry': '🍛',
  'Ramen': '🍜', 'Cuisine gastronomique': '⭐',
};
const getCategoryEmoji = (cat: string) => CATEGORY_EMOJIS[cat] || '🍴';

// ─── Component ──────────────────────────────────────────────────────────────────
const PlatDetailPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { platId } = useParams<{ platId: string }>();

  const [plat, setPlat] = useState<PublicPlatResponse | null>(null);
  const [reviews, setReviews] = useState<PlatReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO
  useEffect(() => {
    if (plat) {
      document.title = `${plat.name} — Miamlo`;
    }
  }, [plat]);

  // Fetch plat + reviews
  useEffect(() => {
    if (!platId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [platRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/plats/${platId}`),
          axios.get(`${API_BASE_URL}/plats/${platId}/reviews`),
        ]);

        if (platRes.data?.success) {
          setPlat(platRes.data.data);
        } else {
          setError(t('platDetail.errorNotFound'));
          return;
        }

        if (reviewsRes.data?.success) {
          setReviews(reviewsRes.data.data || []);
        }
      } catch {
        setError(t('platDetail.errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [platId, t]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return ''; }
  };

  const getDiscountedPrice = () => {
    if (!plat) return null;
    if (plat.promotion?.isActive && plat.promotion.reductionValue > 0) {
      return plat.price * (1 - plat.promotion.reductionValue / 100);
    }
    return null;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ) : (
          <svg key={i} className="w-4 h-4 text-gray-200 fill-gray-200" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 sm:h-80 bg-gray-200 rounded-[32px]" />
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="h-7 bg-gray-200 rounded w-2/3" />
              <div className="flex gap-3">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-40" />
                  <div className="h-4 bg-gray-200 rounded w-28" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error || !plat) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="text-center px-4">
          <span className="text-6xl mb-6 block">😕</span>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {error || t('platDetail.errorNotFound')}
          </h2>
          <p className="text-gray-500 mb-6">{t('platDetail.errorDescription')}</p>
          <button
            onClick={() => navigate('/plats')}
            className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
          >
            {t('platDetail.backToPlats')}
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice();
  const hasPromo = discountedPrice !== null;

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 pb-16">

        {/* ── Hero image ──────────────────────────────────────────────────── */}
        <div className="relative rounded-[32px] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.12)] mb-8">
          <div className="h-64 sm:h-80 md:h-96">
            {plat.imageUrl ? (
              <img
                src={plat.imageUrl}
                alt={plat.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <span className="text-7xl opacity-30">🍽️</span>
              </div>
            )}
          </div>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('platDetail.back')}
          </button>

          {/* Promo badge */}
          {hasPromo && (
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-red-500 rounded-full px-3.5 py-1.5 shadow-lg">
              <span className="text-sm font-bold text-white">-{plat.promotion!.reductionValue}%</span>
            </div>
          )}

          {/* Price badge at bottom-right */}
          <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
            {hasPromo ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg">
                <span className="text-lg font-bold text-red-600">{discountedPrice!.toFixed(2)} €</span>
                <span className="text-xs text-gray-400 line-through ml-2">{plat.price.toFixed(2)} €</span>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg">
                <span className="text-lg font-bold text-gray-900">{plat.price.toFixed(2)} €</span>
              </div>
            )}
          </div>

          {/* Dish name overlaid */}
          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 max-w-[60%]">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {plat.name}
            </h1>
          </div>
        </div>

        {/* ── Info section ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6">
          {/* Rating + Cook time + Distance row */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {renderStars(plat.averageRating)}
              <span className="text-sm font-semibold text-gray-700">
                {plat.averageRating > 0 ? plat.averageRating.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-gray-400">
                ({reviews.length} {t('platDetail.reviews')})
              </span>
            </div>

            <div className="w-px h-4 bg-gray-200" />

            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{plat.estimatedCookTime} {t('platDetail.cookTime')}</span>
            </div>

            {plat.distanceKm !== null && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{plat.distanceKm.toFixed(1)} {t('platDetail.distance')}</span>
                </div>
              </>
            )}
          </div>

          {/* Categories */}
          {plat.categories && plat.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {plat.categories.map(cat => (
                <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffd60a]/10 text-xs font-medium text-gray-700">
                  {getCategoryEmoji(cat)} {cat}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {plat.description && (
            <div className="border-t border-gray-50 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('platDetail.description')}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{plat.description}</p>
            </div>
          )}

          {/* Promo expiry info */}
          {hasPromo && plat.promotion && (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-xs font-medium text-red-700">
                {t('platDetail.promoEnds', { date: formatDate(plat.promotion.reductionEnds) })}
              </span>
            </div>
          )}
        </div>

        {/* ── Chef card ──────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] transition-all group"
          onClick={() => navigate(`/chefs/${plat.chef.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Chef avatar */}
              {plat.chef.chefCoverImg ? (
                <img
                  src={plat.chef.chefCoverImg}
                  alt={`${plat.chef.firstName} ${plat.chef.lastName}`}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#ffd60a]/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffd60a]/30 to-amber-100 flex items-center justify-center ring-2 ring-[#ffd60a]/30">
                  <span className="text-lg font-bold text-amber-700">
                    {plat.chef.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-[#e6a700] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {plat.chef.firstName} {plat.chef.lastName}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-600">
                    {plat.chef.averageRating > 0 ? plat.chef.averageRating.toFixed(1) : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-[#e6a700] group-hover:translate-x-1 transition-transform">
              <span className="hidden sm:inline">{t('platDetail.viewChef')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Reviews section ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('platDetail.customerReviews')}
            </h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              {reviews.length} {t('platDetail.reviews')}
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-5xl mb-4">💬</span>
              <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {t('platDetail.noReviewsTitle')}
              </h3>
              <p className="text-gray-400 text-sm">{t('platDetail.noReviewsDescription')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div
                  key={review.reviewId}
                  className="border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd60a]/30 to-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-amber-700">
                          {review.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
                        <p className="text-[11px] text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    {renderStars(review.rate)}
                  </div>
                  {review.reviewText && (
                    <p className="text-sm text-gray-600 leading-relaxed ml-[52px]">{review.reviewText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlatDetailPage;
