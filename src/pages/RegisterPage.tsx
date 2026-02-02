import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import kebabImage from '@/assets/images/arabic-kebab-sandwich-top-view.jpg';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [selectedCountry, setSelectedCountry] = useState('+33');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register with:', { ...formData, country: selectedCountry });
    // Static - no API call
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Registration Form */}
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
              {t('register.title')}
            </h2>
            <p className="text-gray-600">
              {t('register.subtitle')}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.firstNameLabel')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('register.firstNamePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-base"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.lastNameLabel')}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('register.lastNamePlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-base"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.emailLabel')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('register.emailPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-base"
                required
              />
            </div>

            {/* Phone Number with Country Selector */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.phoneLabel')}
              </label>
              <div className="flex gap-2">
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

                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('register.phonePlaceholder')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-base"
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-[#ffdd00] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#ffd700] transition-colors duration-200 text-lg border-0 outline-none focus:outline-none focus:ring-0 active:outline-none"
              style={{ border: 'none', outline: 'none' }}
            >
              {t('register.registerButton')}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                {t('register.haveAccount')}{' '}
                <a href="/login" className="text-[#ffdd00] hover:underline font-medium">
                  {t('register.loginLink')}
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

export default RegisterPage;
