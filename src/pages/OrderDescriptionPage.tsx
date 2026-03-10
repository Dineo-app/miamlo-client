import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/types';
import cartService from '@/services/cartService';
import type { CartItem } from '@/services/cartService';

const OrderDescriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

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

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('La g\u00e9olocalisation n\'est pas support\u00e9e par votre navigateur.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use Nominatim for reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          if (data.display_name) {
            setDeliveryAddress(data.display_name);
          }
        } catch {
          alert('Impossible de d\u00e9tecter votre adresse.');
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        alert('Impossible d\'obtenir votre position.');
        setDetectingLocation(false);
      }
    );
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
          <p className="text-gray-500 mb-4">Votre panier est vide</p>
          <button
            onClick={() => navigate('/customer/cart')}
            className="px-6 py-2.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors"
          >
            Retour au panier
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
            D&eacute;tails de la commande
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Delivery address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Adresse de livraison</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Votre adresse de livraison"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none transition-colors text-sm"
            />
            <button
              onClick={handleDetectLocation}
              disabled={detectingLocation}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {detectingLocation ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span className="hidden sm:inline">D&eacute;tecter</span>
            </button>
          </div>
        </div>

        {/* Per-item instructions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">Instructions sp&eacute;ciales</h2>
          <p className="text-xs text-gray-400 mb-4">Ajoutez des instructions pour chaque plat (allergies, pr&eacute;f&eacute;rences, etc.)</p>

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
                  <textarea
                    value={descriptions[item.id] || ''}
                    onChange={(e) => setDescriptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Ex: Sans oignons, bien cuit..."
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
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} &euro;</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="w-full py-3.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Proc&eacute;der au paiement
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderDescriptionPage;
