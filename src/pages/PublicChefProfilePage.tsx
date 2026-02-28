import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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

interface ChefReview {
  reviewId: string;
  chefId: string;
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
const PublicChefProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { chefId } = useParams<{ chefId: string }>();

  const [chef, setChef] = useState<PublicChefResponse | null>(null);
  const [plats, setPlats] = useState<PublicPlatResponse[]>([]);
  const [reviews, setReviews] = useState<ChefReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plats' | 'reviews'>('plats');

  // SEO
  useEffect(() => {
    if (chef) {
      document.title = `${chef.firstName} ${chef.lastName} — Miamlo`;
    }
  }, [chef]);

  // Fetch all data
  useEffect(() => {
    if (!chefId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [chefRes, platsRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/chefs/${chefId}`),
          axios.get(`${API_BASE_URL}/public/chefs/${chefId}/plats`),
          axios.get(`${API_BASE_URL}/chefs/${chefId}/reviews`),
        ]);

        if (chefRes.data?.success) {
          setChef(chefRes.data.data);
        } else {
          setError(t('chefProfile.errorNotFound'));
          return;
        }

        if (platsRes.data?.success) {
          setPlats(platsRes.data.data || []);
        }

        if (reviewsRes.data?.success) {
          setReviews(reviewsRes.data.data || []);
        }
      } catch {
        setError(t('chefProfile.errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chefId, t]);

  // Helpers
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long', year: 'numeric',
      });
    } catch { return ''; }
  };

  const formatReviewDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return ''; }
  };

  const getDiscountedPrice = (plat: PublicPlatResponse) => {
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

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-56 bg-gray-200 rounded-[32px]" />
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-7 bg-gray-200 rounded-full w-24" />
                <div className="h-7 bg-gray-200 rounded-full w-20" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error || !chef) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="text-center px-4">
          <span className="text-6xl mb-6 block">😕</span>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {error || t('chefProfile.errorNotFound')}
          </h2>
          <p className="text-gray-500 mb-6">{t('chefProfile.errorDescription')}</p>
          <button
            onClick={() => navigate('/chefs')}
            className="px-6 py-2.5 bg-[#ffd60a] hover:bg-[#ffcc00] rounded-full font-semibold text-sm transition-all"
          >
            {t('chefProfile.backToChefs')}
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 pb-16">

        {/* ── Hero: single cover image with overlaid info ──────────────────── */}
        <div className="relative rounded-[32px] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.12)] mb-8">
          <div className="h-64 sm:h-80">
            {chef.chefCoverImg ? (
              <img
                src={chef.chefCoverImg}
                alt={`${chef.firstName} ${chef.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#ffd60a] via-amber-400 to-orange-300" />
            )}
          </div>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('chefProfile.back')}
          </button>

          {/* Chef info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {chef.firstName} {chef.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-sm font-semibold text-white">
                  {chef.averageRating > 0 ? chef.averageRating.toFixed(1) : '—'}
                </span>
                <span className="text-xs text-white/80">
                  ({chef.totalReviews} {t('chefProfile.reviews')})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{t('chefProfile.memberSince', { date: formatDate(chef.createdAt) })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info card ─────────────────────────────────────────────────────── */}
        {(chef.description || (chef.categories && chef.categories.length > 0) || (chef.chefCertifications && chef.chefCertifications.length > 0)) && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6">
            {chef.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{chef.description}</p>
            )}
            {chef.categories && chef.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {chef.categories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffd60a]/10 text-xs font-medium text-gray-700">
                    {getCategoryEmoji(cat)} {cat}
                  </span>
                ))}
              </div>
            )}
            {chef.chefCertifications && chef.chefCertifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chef.chefCertifications.map((cert, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-50 text-xs font-medium text-green-700 border border-green-100">
                    ✅ {cert}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <p className="text-2xl font-bold text-[#e6a700]">{plats.length}</p>
            <p className="text-xs text-gray-500 mt-1">{t('chefProfile.statsPlats')}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <p className="text-2xl font-bold text-[#e6a700]">
              {chef.averageRating > 0 ? chef.averageRating.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{t('chefProfile.statsRating')}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <p className="text-2xl font-bold text-[#e6a700]">{chef.totalReviews}</p>
            <p className="text-xs text-gray-500 mt-1">{t('chefProfile.statsReviews')}</p>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-[0_4px_16px_rgba(0,0,0,0.06)] mb-6">
          <button
            onClick={() => setActiveTab('plats')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'plats'
                ? 'bg-[#ffd60a] text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('chefProfile.tabPlats')} ({plats.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#ffd60a] text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('chefProfile.tabReviews')} ({reviews.length})
          </button>
        </div>

        {/* ── Plats tab ───────────────────────────────────────────────────── */}
        {activeTab === 'plats' && (
          <>
            {plats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">🍽️</span>
                <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('chefProfile.noPlatsTitle')}
                </h3>
                <p className="text-gray-400 text-sm">{t('chefProfile.noPlatsDescription')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {plats.map(plat => {
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                            <span className="text-5xl opacity-30">🍽️</span>
                          </div>
                        )}

                        {hasPromo && (
                          <div className="absolute top-3 left-3 bg-red-500 rounded-full px-2.5 py-1 shadow-md">
                            <span className="text-xs font-bold text-white">-{plat.promotion!.reductionValue}%</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-[0.95rem] text-gray-900 leading-snug mb-2 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {plat.name}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="font-medium text-gray-600">{plat.averageRating > 0 ? plat.averageRating.toFixed(1) : '—'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{plat.estimatedCookTime} min</span>
                          </div>
                          {plat.distanceKm !== null && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{plat.distanceKm.toFixed(1)} km</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-baseline gap-1.5">
                            {hasPromo ? (
                              <>
                                <span className="text-base font-bold text-red-600">{discountedPrice!.toFixed(2)} €</span>
                                <span className="text-xs text-gray-300 line-through">{plat.price.toFixed(2)} €</span>
                              </>
                            ) : (
                              <span className="text-base font-bold text-gray-900">{plat.price.toFixed(2)} €</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/plats/${plat.id}`); }}
                            className="w-9 h-9 rounded-full bg-[#ffd60a] hover:bg-[#ffcc00] flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105"
                            title={t('chefProfile.viewPlat')}
                          >
                            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Reviews tab ─────────────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <>
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">💬</span>
                <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('chefProfile.noReviewsTitle')}
                </h3>
                <p className="text-gray-400 text-sm">{t('chefProfile.noReviewsDescription')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div
                    key={review.reviewId}
                    className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd60a]/30 to-amber-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-amber-700">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
                          <p className="text-[11px] text-gray-400">{formatReviewDate(review.createdAt)}</p>
                        </div>
                      </div>
                      {renderStars(review.rate)}
                    </div>
                    {review.reviewText && (
                      <p className="text-sm text-gray-600 leading-relaxed">{review.reviewText}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicChefProfilePage;
