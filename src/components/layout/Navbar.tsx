import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { logout } from '@/store/actions/authActions';
import cartService from '@/services/cartService';
import favoritesService from '@/services/favoritesService';
import logo from '@/assets/images/logo-removebg.png';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';

  // Fetch cart and favorites counts for CUSTOMER
  useEffect(() => {
    if (!isCustomer) return;
    const fetchCounts = async () => {
      try {
        const [count, plats, chefs] = await Promise.all([
          cartService.getCartCount(),
          favoritesService.getFavoritePlats(),
          favoritesService.getFavoriteChefs(),
        ]);
        setCartCount(count);
        setFavoritesCount(plats.length + chefs.length);
      } catch {
        // silently ignore
      }
    };
    fetchCounts();

    // Refresh cart count when items are added from other pages
    const onCartUpdated = () => {
      cartService.getCartCount().then(setCartCount).catch(() => {});
    };
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => window.removeEventListener('cartUpdated', onCartUpdated);
  }, [isCustomer]);
  
  const navigation = [
    { name: t('navbar.ourDishes'), href: '/plats' },
    { name: t('navbar.ourChefs'), href: '/chefs' },
    { name: t('navbar.promotions'), href: '/promotions' },
    { name: t('navbar.becomeChef'), href: '/become-chef' },
    { name: t('navbar.contact'), href: '/contact' },
    { name: t('navbar.about'), href: '/about' },
  ];

  // Get role-based routes
  const getRoleRoutes = () => {
    if (!user?.role) return { profile: '/customer/profile', dashboard: '/customer/dashboard' };
    
    switch (user.role) {
      case 'ADMIN':
        return { profile: '/admin/profile', dashboard: '/admin/dashboard' };
      case 'PROVIDER':
        return { profile: '/chef/profile', dashboard: '/chef/dashboard' };
      case 'CUSTOMER':
      default:
        return { profile: '/customer/profile', dashboard: '/customer/dashboard' };
    }
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  const routes = getRoleRoutes();

  return (
    <header className="w-full sticky top-0 z-40" style={{ background: 'rgba(255, 214, 10, 0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
      <nav aria-label="Global" className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img alt="Miamlo Logo" src={logo} className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-bold tracking-widest" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.14em' }}>
              {t('navbar.brand')}
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-gray-700 bg-transparent hover:bg-transparent focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Center: Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative text-[0.95rem] font-medium text-black hover:text-black group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </Link>
          ))}
        </div>

        {/* Right: Language switcher and Auth buttons */}
        <div className="hidden lg:flex lg:gap-2 lg:items-center">
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-1 px-3 py-2 text-lg hover:opacity-80 transition-opacity border-none outline-none" style={{ backgroundColor: 'transparent', border: 'none' }}>
              <span>{i18n.language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </MenuButton>
            <MenuItems 
              className="absolute right-0 mt-2 w-32 origin-top-right rounded-lg focus:outline-none z-50"
              style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => i18n.changeLanguage('fr')}
                    className={`group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900 first:rounded-t-lg`}
                    style={{ backgroundColor: active ? '#f3f4f6' : 'white', border: 'none' }}
                  >
                    <span className="text-lg">🇫🇷</span> Français
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900 last:rounded-b-lg`}
                    style={{ backgroundColor: active ? '#f3f4f6' : 'white', border: 'none' }}
                  >
                    <span className="text-lg">🇬🇧</span> English
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* Customer: favorites + cart icons */}
          {isCustomer && (
            <>
              <button
                onClick={() => navigate('/customer/favorites')}
                className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
                title={t('navbar.myFavorites')}
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/customer/cart')}
                className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
                title={t('navbar.myCart')}
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => navigate('/plats')}
            className="px-5 py-2.5 text-[0.9rem] font-semibold rounded-full border border-black/20 bg-white/85 hover:bg-white transition-all"
          >
            {t('navbar.downloadApp')}
          </button>

          {isAuthenticated && user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 px-5 py-2.5 text-[0.9rem] font-semibold rounded-full bg-black text-white hover:shadow-2xl transition-all"
                style={{ boxShadow: '0 18px 40px rgba(0, 0, 0, 0.18)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 22px 40px rgba(0, 0, 0, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.18)';
                }}
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>{user.firstName}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </MenuButton>
              <MenuItems 
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg focus:outline-none z-50"
                style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              >
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate(routes.profile)}
                      className={`group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900 first:rounded-t-lg`}
                      style={{ backgroundColor: active ? '#f3f4f6' : 'white', border: 'none' }}
                    >
                      👤 {t('navbar.myProfile')}
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => navigate(routes.dashboard)}
                      className={`group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900`}
                      style={{ backgroundColor: active ? '#f3f4f6' : 'white', border: 'none' }}
                    >
                      📊 {t('navbar.dashboard')}
                    </button>
                  )}
                </MenuItem>
                <div className="h-px bg-gray-200 my-1"></div>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`group flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 last:rounded-b-lg`}
                      style={{ backgroundColor: active ? '#fee2e2' : 'white', border: 'none' }}
                    >
                      🚪 {t('navbar.logout')}
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-[0.9rem] font-semibold rounded-full bg-black text-white hover:shadow-2xl transition-all"
              style={{ boxShadow: '0 18px 40px rgba(0, 0, 0, 0.18)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 22px 40px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.18)';
              }}
            >
              {t('navbar.loginRegister')}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img alt="Miamlo Logo" src={logo} className="h-10 w-auto" />
              <span className="text-xl font-bold text-black" style={{ fontFamily: 'Limelight, serif' }}>
                {t('navbar.brand')}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700 bg-transparent hover:bg-transparent focus:outline-none"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-2">
                <Menu as="div" className="relative w-full">
                  <MenuButton className="flex items-center justify-between w-full px-3 py-2 text-base font-semibold text-gray-900 rounded-lg bg-gray-50">
                    <span>{i18n.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span>
                    <ChevronDownIcon className="h-5 w-5" />
                  </MenuButton>
                  <MenuItems 
                    className="absolute left-0 right-0 mt-2 origin-top rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => i18n.changeLanguage('fr')}
                          className={`${active ? 'bg-gray-50' : ''} group flex w-full items-center gap-2 px-4 py-2 text-sm`}
                        >
                          <span className="text-lg">🇫🇷</span> Français
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => i18n.changeLanguage('en')}
                          className={`${active ? 'bg-gray-50' : ''} group flex w-full items-center gap-2 px-4 py-2 text-sm`}
                        >
                          <span className="text-lg">🇬🇧</span> English
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <button
                  onClick={() => { navigate('/plats'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg border border-black/20 bg-white hover:bg-gray-50"
                >
                  {t('navbar.downloadApp')}
                </button>
                {isAuthenticated && user ? (
                  <>
                    {user.role === 'CUSTOMER' && (
                      <>
                        <button
                          onClick={() => { navigate('/customer/favorites'); setMobileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-between"
                        >
                          <span>❤️ {t('navbar.myFavorites')}</span>
                          {favoritesCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
                              {favoritesCount}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => { navigate('/customer/cart'); setMobileMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-between"
                        >
                          <span>🛒 {t('navbar.myCart')}</span>
                          {cartCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
                              {cartCount}
                            </span>
                          )}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => { navigate(routes.profile); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      👤 {t('navbar.myProfile')}
                    </button>
                    <button
                      onClick={() => { navigate(routes.dashboard); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      📊 {t('navbar.dashboard')}
                    </button>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-base font-semibold rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      🚪 {t('navbar.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-base font-semibold bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    {t('navbar.loginRegister')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
