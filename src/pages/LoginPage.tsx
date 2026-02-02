import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import kebabImage from '@/assets/images/arabic-kebab-sandwich-top-view.jpg';

const LoginPage = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');

  const countries = [
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+44', flag: '🇬🇧', name: 'UK' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with:', selectedCountry, phoneNumber);
    // Static - no API call
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 
              className="text-5xl font-bold text-black mb-4" 
              style={{ fontFamily: 'Limelight, serif' }}
            >
              {t('navbar.brand')}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t('login.title')}
            </h2>
            <p className="text-gray-600">
              {t('login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Phone Number Input with Country Selector */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.phoneLabel')}
              </label>
              <div className="flex gap-2">
                {/* Country Selector */}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-32 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent bg-white text-base"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('login.phonePlaceholder')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-base"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#ffdd00] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#ffd700] transition-colors duration-200 text-lg border-0 outline-none focus:outline-none focus:ring-0 active:outline-none"
              style={{ border: 'none', outline: 'none' }}
            >
              {t('login.loginButton')}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                {t('login.noAccount')}{' '}
                <a href="/register" className="text-[#ffdd00] hover:underline font-medium">
                  {t('login.registerLink')}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Half - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={kebabImage}
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
    </div>
  );
};

export default LoginPage;
