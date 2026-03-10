import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cartService from '@/services/cartService';
import type { CartItem } from '@/services/cartService';

interface Props {
  onCountChange?: (count: number) => void;
}

const CustomerCartPage = ({ onCountChange }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const items = await cartService.getCartItems();
      setCartItems(items);
      onCountChange?.(items.length);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = useCallback(async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    const oldItems = [...cartItems];

    // Optimistic update
    setCartItems(prev =>
      prev.map(ci => ci.id === item.id ? { ...ci, quantity: newQuantity, totalPrice: (ci.totalPrice / ci.quantity) * newQuantity } : ci)
    );

    try {
      setUpdatingId(item.id);
      await cartService.updateQuantity(item.id, newQuantity);
    } catch {
      setCartItems(oldItems);
      alert(t('customerCart.updateError'));
    } finally {
      setUpdatingId(null);
    }
  }, [cartItems]);

  const handleRemove = useCallback(async (itemId: string) => {
    const oldItems = [...cartItems];

    // Optimistic removal
    const updated = cartItems.filter(ci => ci.id !== itemId);
    setCartItems(updated);
    onCountChange?.(updated.length);

    try {
      await cartService.removeFromCart(itemId);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      setCartItems(oldItems);
      onCountChange?.(oldItems.length);
      alert(t('customerCart.removeError'));
    }
  }, [cartItems, onCountChange]);

  const handleClearCart = async () => {
    if (!confirm(t('customerCart.confirmClear'))) return;
    try {
      await cartService.clearCart();
      setCartItems([]);
      onCountChange?.(0);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      alert(t('customerCart.clearError'));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal; // No delivery fee for now

  const handleProceed = () => {
    // Store cart items in sessionStorage for the order-description page
    sessionStorage.setItem('pendingCartItems', JSON.stringify(cartItems));
    navigate('/customer/order-description');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {t('customerCart.title')}
        </h1>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 font-medium transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('customerCart.clear')}
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="text-gray-500 font-medium mb-2">{t('customerCart.empty')}</p>
          <p className="text-sm text-gray-400 mb-6">{t('customerCart.emptySubtitle')}</p>
          <button
            onClick={() => navigate('/plats')}
            className="px-6 py-2.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors"
          >
            {t('customerCart.browsePlats')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer" onClick={() => navigate(`/plats/${item.platId}`)}>
                    {item.platImageUrl ? (
                      <img src={item.platImageUrl} alt={item.platName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl opacity-30">&#127869;</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{item.platName}</h3>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-0.5">{item.platPrice.toFixed(2)} € {t('customerCart.perUnit')}</p>

                    {/* Promotion badge */}
                    {item.promotion?.isActive && item.promotion.reductionValue > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                        -{item.promotion.reductionValue}%
                      </span>
                    )}

                    {/* Selected ingredients */}
                    {item.selectedIngredients && item.selectedIngredients.filter(ing => ing.ingredientName).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.selectedIngredients.filter(ing => ing.ingredientName).map((ing, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-medium rounded-full border border-amber-100">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            {ing.ingredientName}
                            {ing.ingredientPrice > 0 && <span className="text-amber-500">+{ing.ingredientPrice.toFixed(2)}€</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quantity controls + Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingId === item.id}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-base font-bold text-gray-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          disabled={updatingId === item.id}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      <span className="text-base font-bold text-gray-900">{item.totalPrice.toFixed(2)} &euro;</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-[80px]">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('customerCart.summary')}</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('customerCart.subtotal', { count: cartItems.length })}</span>
                  <span className="font-medium text-gray-900">{subtotal.toFixed(2)} &euro;</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">{t('customerCart.total')}</span>
                  <span className="text-xl font-bold text-gray-900">{total.toFixed(2)} &euro;</span>
                </div>
              </div>
              <button
                onClick={handleProceed}
                className="w-full py-3.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-bold rounded-xl transition-colors"
              >
                {t('customerCart.order')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCartPage;
