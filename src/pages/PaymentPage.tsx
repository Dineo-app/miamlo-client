import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '@/services/paymentService';
import orderService from '@/services/orderService';
import cartService from '@/services/cartService';
import type { CartItem } from '@/services/cartService';

// ——— Inner form component used inside <Elements> ———
const CheckoutForm = ({
  clientSecret,
  paymentIntentId,
  totalAmount,
  cartItems,
}: {
  clientSecret: string;
  paymentIntentId: string;
  totalAmount: number;
  cartItems: CartItem[];
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (stripeError) {
        setError(stripeError.message || t('payment.paymentError'));
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm on backend
        try {
          await paymentService.confirmPayment(paymentIntentId);
        } catch {
          // non-critical — backend may confirm via webhook
        }

        // Load per-item descriptions and address
        const descriptionsRaw = sessionStorage.getItem('pendingOrderDescriptions');
        const address = sessionStorage.getItem('pendingDeliveryAddress') || '';
        const descriptions: Record<string, string> = descriptionsRaw ? JSON.parse(descriptionsRaw) : {};

        // Create one order per cart item
        for (const item of cartItems) {
          try {
            await orderService.createOrder({
              platId: item.platId,
              chefId: item.chefId || '',
              quantity: item.quantity,
              description: descriptions[item.id] || '',
              deliveryAddress: address,
              paymentIntentId,
              selectedIngredientIds: item.selectedIngredients?.map((i) => i.ingredientId) || [],
            });
          } catch (e) {
            console.error('Failed to create order for item', item.platId, e);
          }
        }

        // Clear cart & session data
        try {
          await cartService.clearCart();
        } catch { /* ignore */ }
        sessionStorage.removeItem('pendingCartItems');
        sessionStorage.removeItem('pendingOrderDescriptions');
        sessionStorage.removeItem('pendingDeliveryAddress');

        navigate('/customer/orders', { replace: true });
      }
    } catch {
      setError(t('payment.unexpectedError'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Card input */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t('payment.bankCard')}</h2>
        <div className="border border-gray-200 rounded-xl p-4 focus-within:border-[#ffdd00] focus-within:ring-1 focus-within:ring-[#ffdd00] transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#1f2937',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#ef4444' },
              },
              hidePostalCode: true,
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{t('payment.items', { count: cartItems.length })}</span>
          <span className="text-sm text-gray-500">{totalAmount.toFixed(2)} &euro;</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">{t('payment.total')}</span>
          <span className="text-xl font-bold text-gray-900">{totalAmount.toFixed(2)} &euro;</span>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={processing || !cardComplete || !stripe}
        className="w-full py-4 bg-[#ffdd00] hover:bg-[#ffd000] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            {t('payment.processing')}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('payment.pay')} {totalAmount.toFixed(2)} €
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        {t('payment.securePayment')}
      </p>
    </div>
  );
};

// ——— Main PaymentPage ———
const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalAmount = parseFloat(searchParams.get('totalAmount') || '0');

  useEffect(() => {
    initPayment();
  }, []);

  const initPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Load Stripe publishable key
      const config = await paymentService.getConfig();
      setStripePromise(loadStripe(config.publishableKey));

      // 2. Load cart items
      const stored = sessionStorage.getItem('pendingCartItems');
      const items: CartItem[] = stored ? JSON.parse(stored) : await cartService.getCartItems();
      setCartItems(items);

      if (items.length === 0) {
        setError(t('payment.cartEmpty'));
        setLoading(false);
        return;
      }

      // 3. Create payment intent
      const amount = totalAmount > 0 ? totalAmount : items.reduce((s, i) => s + i.totalPrice, 0);
      const response = await paymentService.createPaymentIntent({
        amount: Math.round(amount * 100), // cents
        currency: 'eur',
        description: t('payment.orderDescription', { count: items.length }),
        items: items.map((i) => ({
          platId: i.platId,
          platName: i.platName,
          quantity: i.quantity,
          price: i.totalPrice,
          chefId: i.chefId || '',
        })),
      });

      setClientSecret(response.clientSecret);
      setPaymentIntentId(response.paymentIntentId);
    } catch (e: unknown) {
      console.error('Payment init error', e);
      setError(t('payment.initError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#ffdd00] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">{t('payment.preparingPayment')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f9f6ef' }}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full text-sm transition-colors"
            >
              {t('payment.back')}
            </button>
            <button
              onClick={initPayment}
              className="px-5 py-2 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-semibold rounded-full text-sm transition-colors"
            >
              {t('payment.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('payment.title')}
          </h1>
          <div className="ml-auto">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-6">
        {stripePromise && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              paymentIntentId={paymentIntentId}
              totalAmount={totalAmount > 0 ? totalAmount : cartItems.reduce((s, i) => s + i.totalPrice, 0)}
              cartItems={cartItems}
            />
          </Elements>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;
