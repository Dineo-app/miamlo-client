import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendRegisterOtp, verifyRegistrationOtp, resendOtp } from '@/store/actions/authActions';
import kebabImage from '@/assets/images/arabic-kebab-sandwich-top-view.jpg';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: any) => state.auth);
  
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [selectedCountry, setSelectedCountry] = useState('+33');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullPhone = selectedCountry + formData.phoneNumber;
    
    try {
      await dispatch(sendRegisterOtp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone,
      }) as any);
      setStep('otp');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullPhone = selectedCountry + formData.phoneNumber;
    
    try {
      const result = await dispatch(verifyRegistrationOtp({
        phone: fullPhone,
        code: otp,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }) as any);
      
      // Redirect based on role - user is at result.data.user
      if (result && result.success && result.data && result.data.user) {
        if (result.data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      } else {
        setErrorMessage('Registration successful but unexpected response format');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid OTP code');
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage('');
    const fullPhone = selectedCountry + formData.phoneNumber;
    try {
      await dispatch(resendOtp({ phone: fullPhone, type: 'REGISTRATION' }) as any);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend OTP');
    }
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
              {step === 'form' ? t('register.subtitle') : 'Entrez le code reçu par SMS'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleRegister} className="space-y-6">
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
              disabled={loading}
              className="w-full bg-[#ffdd00] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#ffd700] transition-colors duration-200 text-lg border-0 outline-none focus:outline-none focus:ring-0 active:outline-none disabled:opacity-50"
              style={{ border: 'none', outline: 'none' }}
            >
              {loading ? 'Envoi en cours...' : t('register.registerButton')}
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
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdd00] focus:border-transparent text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffdd00] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#ffd700] transition-colors duration-200 text-lg border-0 outline-none focus:outline-none disabled:opacity-50"
                style={{ border: 'none', outline: 'none' }}
              >
                {loading ? 'Vérification...' : "S'inscrire"}
              </button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full py-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Renvoyer le code
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('form'); setOtp(''); }}
                  className="w-full py-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  ← Modifier les informations
                </button>
              </div>
            </form>
          )}
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
