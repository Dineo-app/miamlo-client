import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '@/store/actions/authActions';
import type { RootState } from '@/store/types';
import cartService from '@/services/cartService';
import favoritesService from '@/services/favoritesService';
import logo from '@/assets/images/logo-removebg.png';

// Sub-pages
import CustomerOrdersPage from './CustomerOrdersPage';
import CustomerFavoritesPage from './CustomerFavoritesPage';
import CustomerSettingsPage from './CustomerSettingsPage';
import CustomerCartPage from './CustomerCartPage';

type DashboardTab = 'dashboard' | 'orders' | 'favorites' | 'cart' | 'settings';

const tabFromPath = (pathname: string): DashboardTab => {
  if (pathname.includes('/orders')) return 'orders';
  if (pathname.includes('/favorites')) return 'favorites';
  if (pathname.includes('/cart')) return 'cart';
  if (pathname.includes('/settings')) return 'settings';
  return 'dashboard';
};

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<DashboardTab>(tabFromPath(location.pathname));
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const [count, favPlats, favChefs] = await Promise.all([
        cartService.getCartCount(),
        favoritesService.getFavoritePlats(),
        favoritesService.getFavoriteChefs(),
      ]);
      setCartCount(count);
      setFavoritesCount(favPlats.length + favChefs.length);
    } catch {
      // silently fail
    }
  };

  const handleLogout = () => {
    (dispatch as any)(logout());
    navigate('/login');
  };

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    switch (tab) {
      case 'dashboard': navigate('/customer/dashboard'); break;
      case 'orders': navigate('/customer/orders'); break;
      case 'favorites': navigate('/customer/favorites'); break;
      case 'cart': navigate('/customer/cart'); break;
      case 'settings': navigate('/customer/settings'); break;
    }
  };

  const sidebarItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Mes Commandes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'favorites',
      label: 'Mes Favoris',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'cart',
      label: 'Mon Panier',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'settings',
      label: 'Param\u00e8tres',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const renderDashboardHome = () => (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Bienvenue, {user?.firstName} !
        </h2>
        <p className="text-gray-500">Explorez nos plats d&eacute;licieux et passez vos commandes facilement.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => handleTabChange('orders')} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Mes Commandes</h3>
          </div>
          <p className="text-sm text-gray-500">Suivez vos commandes en cours</p>
        </button>

        <button onClick={() => handleTabChange('favorites')} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-red-500 transition-colors">Mes Favoris</h3>
            {favoritesCount > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{favoritesCount}</span>}
          </div>
          <p className="text-sm text-gray-500">Retrouvez vos plats et chefs pr&eacute;f&eacute;r&eacute;s</p>
        </button>

        <button onClick={() => handleTabChange('cart')} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">Mon Panier</h3>
            {cartCount > 0 && <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
          </div>
          <p className="text-sm text-gray-500">G&eacute;rez vos articles en attente</p>
        </button>
      </div>

      {/* Explore links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/plats')} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left border-2 border-transparent hover:border-[#ffdd00]">
          <span className="text-3xl block mb-3">&#127869;</span>
          <h3 className="font-semibold text-gray-800 mb-1">Parcourir les Plats</h3>
          <p className="text-sm text-gray-500">D&eacute;couvrez notre s&eacute;lection de plats d&eacute;licieux</p>
        </button>
        <button onClick={() => navigate('/chefs')} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left border-2 border-transparent hover:border-[#ffdd00]">
          <span className="text-3xl block mb-3">&#128104;&#8205;&#127859;</span>
          <h3 className="font-semibold text-gray-800 mb-1">Nos Chefs</h3>
          <p className="text-sm text-gray-500">D&eacute;couvrez les chefs talentueux pr&egrave;s de chez vous</p>
        </button>
        <button onClick={() => navigate('/promotions')} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left border-2 border-transparent hover:border-[#ffdd00]">
          <span className="text-3xl block mb-3">&#127881;</span>
          <h3 className="font-semibold text-gray-800 mb-1">Promotions</h3>
          <p className="text-sm text-gray-500">Ne manquez pas nos offres sp&eacute;ciales</p>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return <CustomerOrdersPage />;
      case 'favorites': return <CustomerFavoritesPage onCountChange={(c) => setFavoritesCount(c)} />;
      case 'cart': return <CustomerCartPage onCountChange={(c) => setCartCount(c)} />;
      case 'settings': return <CustomerSettingsPage />;
      default: return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {/* Top bar — yellow like the shared Navbar */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(255, 214, 10, 0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition-colors">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <img alt="Miamlo Logo" src={logo} className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold tracking-widest text-black" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.14em' }}>MIAMLO</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleTabChange('favorites')} className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
              <svg className="w-5 h-5 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {favoritesCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{favoritesCount}</span>}
            </button>
            <button onClick={() => handleTabChange('cart')} className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
              <svg className="w-5 h-5 text-black/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-1 border-l border-black/10">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.firstName?.charAt(0)?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold text-black">{user?.firstName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-[57px] left-0 z-20 h-[calc(100vh-57px)] w-64 bg-white shadow-lg lg:shadow-sm border-r border-gray-100 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="flex flex-col h-full py-4">
            <div className="flex-1 space-y-1 px-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-[#ffdd00]/20 text-gray-900' : 'text-gray-500 hover:bg-[#f9f6ef] hover:text-gray-800'}`}
                >
                  <span className={activeTab === item.id ? 'text-[#d4a300]' : 'text-gray-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge != null && <span className="ml-auto bg-[#ffdd00] text-black text-xs font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                </button>
              ))}
            </div>
            <div className="px-3 pt-4 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>D&eacute;connexion</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
