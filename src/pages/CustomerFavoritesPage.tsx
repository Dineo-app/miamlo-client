import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import favoritesService from '@/services/favoritesService';
import type { FavoritePlatWithDetails, FavoriteChefWithDetails } from '@/services/favoritesService';

type FavTab = 'plats' | 'chefs';

interface Props {
  onCountChange?: (count: number) => void;
}

const CustomerFavoritesPage = ({ onCountChange }: Props) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FavTab>('plats');
  const [favPlats, setFavPlats] = useState<FavoritePlatWithDetails[]>([]);
  const [favChefs, setFavChefs] = useState<FavoriteChefWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const [plats, chefs] = await Promise.all([
        favoritesService.getFavoritePlats(),
        favoritesService.getFavoriteChefs(),
      ]);
      setFavPlats(plats);
      setFavChefs(chefs);
      onCountChange?.(plats.length + chefs.length);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlat = async (platId: string) => {
    try {
      await favoritesService.removeFavoritePlat(platId);
      setFavPlats(prev => {
        const updated = prev.filter(p => p.platId !== platId);
        onCountChange?.(updated.length + favChefs.length);
        return updated;
      });
    } catch {
      alert('Erreur lors de la suppression du favori.');
    }
  };

  const handleRemoveChef = async (chefId: string) => {
    try {
      await favoritesService.removeFavoriteChef(chefId);
      setFavChefs(prev => {
        const updated = prev.filter(c => c.chefId !== chefId);
        onCountChange?.(favPlats.length + updated.length);
        return updated;
      });
    } catch {
      alert('Erreur lors de la suppression du favori.');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Mes Favoris
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-1">
        {(['plats', 'chefs'] as FavTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'plats' ? `Plats (${favPlats.length})` : `Chefs (${favChefs.length})`}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffdd00] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Plats tab */}
      {activeTab === 'plats' && (
        favPlats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 font-medium mb-4">Aucun plat en favori</p>
            <button onClick={() => navigate('/plats')} className="px-6 py-2.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors">
              D&eacute;couvrir les plats
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favPlats.map(fav => {
              const hasPromo = fav.promotion?.isActive && fav.promotion.reductionValue > 0;
              const discountedPrice = hasPromo ? fav.platPrice * (1 - fav.promotion!.reductionValue / 100) : null;
              return (
                <div key={fav.favoriteId} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  {/* Image */}
                  <div className="relative h-44 cursor-pointer" onClick={() => navigate(`/plats/${fav.platId}`)}>
                    {fav.platImageUrl ? (
                      <img src={fav.platImageUrl} alt={fav.platName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center">
                        <span className="text-5xl opacity-30">&#127869;</span>
                      </div>
                    )}
                    {hasPromo && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{fav.promotion!.reductionValue}%
                      </div>
                    )}
                    {/* Heart (filled) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemovePlat(fav.platId); }}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate cursor-pointer hover:text-[#e6a700] transition-colors" onClick={() => navigate(`/plats/${fav.platId}`)}>
                      {fav.platName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      par {fav.chefFirstName} {fav.chefLastName}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(fav.platAverageRating)}
                      <span className="text-xs text-gray-400">{fav.platAverageRating > 0 ? fav.platAverageRating.toFixed(1) : '\u2014'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {fav.platEstimatedCookTime} min
                      </div>
                      <div>
                        {discountedPrice !== null ? (
                          <>
                            <span className="text-sm font-bold text-red-600">{discountedPrice.toFixed(2)} &euro;</span>
                            <span className="text-xs text-gray-400 line-through ml-1">{fav.platPrice.toFixed(2)} &euro;</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">{fav.platPrice.toFixed(2)} &euro;</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Chefs tab */}
      {activeTab === 'chefs' && (
        favChefs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 font-medium mb-4">Aucun chef en favori</p>
            <button onClick={() => navigate('/chefs')} className="px-6 py-2.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors">
              D&eacute;couvrir les chefs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favChefs.map(fav => (
              <div key={fav.favoriteId} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/chefs/${fav.chefId}`)}>
                  {fav.chefCoverImg ? (
                    <img src={fav.chefCoverImg} alt={`${fav.chefFirstName} ${fav.chefLastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ffdd00]/20 to-amber-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-amber-700">{fav.chefFirstName.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-[#e6a700] transition-colors" onClick={() => navigate(`/chefs/${fav.chefId}`)}>
                      {fav.chefFirstName} {fav.chefLastName}
                    </h3>
                    {fav.chefCategories?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{fav.chefCategories.join(', ')}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(fav.chefAverageRating)}
                      <span className="text-xs text-gray-400">
                        {fav.chefAverageRating > 0 ? fav.chefAverageRating.toFixed(1) : '\u2014'} ({fav.chefReviewCount} avis)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveChef(fav.chefId)}
                    className="self-start mt-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default CustomerFavoritesPage;
