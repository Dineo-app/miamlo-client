import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo-removebg.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: t('navbar.ourDishes'), href: '/plats' },
    { name: t('navbar.ourChefs'), href: '/chefs' },
    { name: t('navbar.promotions'), href: '/promotions' },
    { name: t('navbar.becomeChef'), href: '/become-chef' },
    { name: t('navbar.contact'), href: '/contact' },
    { name: t('navbar.about'), href: '/about' },
  ];

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
          <button
            onClick={() => navigate('/plats')}
            className="px-5 py-2.5 text-[0.9rem] font-semibold rounded-full border border-black/20 bg-white/85 hover:bg-white transition-all"
          >
            Télécharger l'application
          </button>

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
            Connexion / S'inscrire
          </button>
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
                  Télécharger l'application
                </button>
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-base font-semibold bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Connexion / S'inscrire
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
