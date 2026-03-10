import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import orderService from '@/services/orderService';
import { OrderStatus } from '@/services/orderService';
import type { Order } from '@/services/orderService';

type OrderTab = 'enCours' | 'livree' | 'annulee';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const CustomerOrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTab>('enCours');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': t('customerOrders.statusPending'),
      'CONFIRMED': t('customerOrders.statusConfirmed'),
      'PREPARING': t('customerOrders.statusInPreparation'),
      'READY': t('customerOrders.statusReady'),
      'DELIVERED': t('customerOrders.statusDelivered'),
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
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm(t('customerOrders.cancelConfirm'))) return;
    try {
      setCancellingId(orderId);
      await orderService.cancelOrder(orderId);
      await fetchOrders();
    } catch {
      alert(t('customerOrders.cancelError'));
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
        return orders.filter(o => o.status === OrderStatus.DELIVERED);
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
                  {order.platImageUrl ? (
                    <img src={order.platImageUrl} alt={order.platName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl opacity-30">&#127869;</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{order.platName}</h3>
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

                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      <svg className="w-3 h-3 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {order.deliveryAddress}
                    </p>
                  )}

                  {/* Cancel button for pending/confirmed orders */}
                  {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && (
                    <button
                      onClick={() => handleCancel(order.id)}
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
    </div>
  );
};

export default CustomerOrdersPage;
