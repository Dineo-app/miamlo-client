import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store/types';
import cartService from '@/services/cartService';
import type { CartItem } from '@/services/cartService';

const OrderDescriptionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useSelector((state: RootState) => state.auth); // keep auth guard active
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
    detectLocation();
  }, []);

  // Auto-detect user position on mount (same as mobile app)
  const detectLocation = () => {
    // First check if we have a saved location in localStorage
    const saved = localStorage.getItem('miamlo_user_location');
    if (saved) {
      try {
        const { lat, lng } = JSON.parse(saved);
        if (lat && lng) {
          setDeliveryAddress(`${lat}, ${lng}`);
          return;
        }
      } catch { /* continue to geolocation */ }
    }

    // Otherwise auto-detect via browser geolocation
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryAddress(`${latitude}, ${longitude}`);
        localStorage.setItem('miamlo_user_location', JSON.stringify({ lat: latitude, lng: longitude, ts: Date.now() }));
      },
      () => { /* silently fail */ },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      // Try sessionStorage first, fall back to API
      const stored = sessionStorage.getItem('pendingCartItems');
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        const items = await cartService.getCartItems();
        setCartItems(items);
      }
    } catch {
      console.error('Error loading cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    // Store descriptions and address in sessionStorage
    sessionStorage.setItem('pendingOrderDescriptions', JSON.stringify(descriptions));
    sessionStorage.setItem('pendingDeliveryAddress', deliveryAddress);

    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    navigate(`/customer/payment?totalAmount=${total.toFixed(2)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="w-10 h-10 border-3 border-[#ffdd00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t('orderDescription.emptyCart')}</p>
          <button
            onClick={() => navigate('/customer/cart')}
            className="px-6 py-2.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors"
          >
            {t('orderDescription.backToCart')}
          </button>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('orderDescription.title')}
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Per-item instructions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">{t('orderDescription.instructions')}</h2>
          <p className="text-xs text-gray-400 mb-4">{t('orderDescription.instructionsSubtitle')}</p>

          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.platImageUrl ? (
                    <img src={item.platImageUrl} alt={item.platName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl opacity-30">&#127869;</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">{item.platName} <span className="text-gray-400">x{item.quantity}</span></p>
                  {/* Show selected ingredients */}
                  {item.selectedIngredients && item.selectedIngredients.filter(ing => ing.ingredientName).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.selectedIngredients.filter(ing => ing.ingredientName).map((ing, idx) => (
                        <span key={idx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded-full border border-amber-100">
                          {ing.ingredientName}
                          {ing.ingredientPrice > 0 && <span className="text-amber-500">+{ing.ingredientPrice.toFixed(2)}€</span>}
                        </span>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={descriptions[item.id] || ''}
                    onChange={(e) => setDescriptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder={t('orderDescription.instructionsPlaceholder')}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none text-sm resize-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-900">{t('orderDescription.total')}</span>
            <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} &euro;</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="w-full py-3.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {t('orderDescription.proceedToPayment')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderDescriptionPage;
