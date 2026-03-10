import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import orderService from '@/services/orderService';
import { OrderStatus } from '@/services/orderService';
import type { Order } from '@/services/orderService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

type OrderTab = 'enCours' | 'livree' | 'annulee';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const CustomerOrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTab>('enCours');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; orderId: string | null }>({ open: false, orderId: null });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [platDetails, setPlatDetails] = useState<Record<string, { name: string; imageUrl: string | null }>>({});
  const platCacheRef = useRef<Record<string, { name: string; imageUrl: string | null }>>({});

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': t('customerOrders.statusPending'),
      'CONFIRMED': t('customerOrders.statusConfirmed'),
      'PREPARING': t('customerOrders.statusInPreparation'),
      'READY': t('customerOrders.statusReady'),
      'COMPLETED': t('customerOrders.statusDelivered'),
      'CANCELLED': t('customerOrders.statusCancelled'),
    };
    return labels[status] || status;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders();
      setOrders(data);
      // Fetch plat details for images
      const uniquePlatIds = [...new Set(data.map(o => o.platId).filter(Boolean))];
      const toFetch = uniquePlatIds.filter(id => !platCacheRef.current[id]);
      await Promise.all(toFetch.map(async (platId) => {
        try {
          const res = await axios.get(`${API_BASE_URL}/public/plats/${platId}`);
          if (res.data?.data) {
            platCacheRef.current[platId] = {
              name: res.data.data.name,
              imageUrl: res.data.data.imageUrl || null,
            };
          }
        } catch { /* skip */ }
      }));
      setPlatDetails({ ...platCacheRef.current });
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleCancelClick = (orderId: string) => {
    setConfirmModal({ open: true, orderId });
  };

  const handleCancelConfirm = async () => {
    const orderId = confirmModal.orderId;
    if (!orderId) return;
    setConfirmModal({ open: false, orderId: null });
    try {
      setCancellingId(orderId);
      await orderService.cancelOrder(orderId);
      await fetchOrders();
      showToast(t('customerOrders.cancelSuccess'), 'success');
    } catch {
      showToast(t('customerOrders.cancelError'), 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const filterOrders = useCallback((tab: OrderTab): Order[] => {
    switch (tab) {
      case 'enCours':
        return orders.filter(o =>
          ([OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY] as string[]).includes(o.status)
        );
      case 'livree':
        return orders.filter(o => o.status === OrderStatus.COMPLETED);
      case 'annulee':
        return orders.filter(o => o.status === OrderStatus.CANCELLED);
      default:
        return orders;
    }
  }, [orders]);

  const filteredOrders = filterOrders(activeTab);

  const tabs: { id: OrderTab; label: string; color: string }[] = [
    { id: 'enCours', label: t('customerOrders.tabActive'), color: '#ffdd00' },
    { id: 'livree', label: t('customerOrders.tabCompleted'), color: '#22C55E' },
    { id: 'annulee', label: t('customerOrders.tabCancelled'), color: '#EF4444' },
  ];

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {t('customerOrders.title')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-black shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
            style={activeTab === tab.id ? { backgroundColor: tab.color } : undefined}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">
              ({filterOrders(tab.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 font-medium">{t('customerOrders.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {platDetails[order.platId]?.imageUrl ? (
                    <img src={platDetails[order.platId].imageUrl!} alt={platDetails[order.platId]?.name || order.platName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl opacity-30">&#127869;</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{platDetails[order.platId]?.name || order.platName}</h3>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createdAt)} &agrave; {formatTime(order.createdAt)}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">Qt&eacute;: {order.quantity}</span>
                    <span className="text-sm font-bold text-gray-900">{order.totalPrice?.toFixed(2)} &euro;</span>
                  </div>

                  {order.description && (
                    <div className="mt-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-700">
                        <span className="font-semibold">{t('customerOrders.instructions')} : </span>{order.description}
                      </p>
                    </div>
                  )}

                  {/* Cancel button for pending/confirmed orders */}
                  {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && (
                    <button
                      onClick={() => handleCancelClick(order.id)}
                      disabled={cancellingId === order.id}
                      className="mt-3 px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === order.id ? t('customerOrders.cancelling') : t('customerOrders.cancelOrder')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal({ open: false, orderId: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{t('customerOrders.cancelOrderTitle')}</h3>
            <p className="text-sm text-gray-500 text-center mb-6">{t('customerOrders.cancelConfirm')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, orderId: null })}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                {t('customerOrders.cancelNo')}
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                {t('customerOrders.cancelYes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {toast.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;
