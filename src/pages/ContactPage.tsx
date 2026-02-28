import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

// Phone country codes (matching login & become-chef pages)
const PHONE_CODES = [
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
];

const ContactPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('+33');

  // SEO
  useEffect(() => {
    document.title = t('contact.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('contact.seoDescription'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('contact.seoDescription');
      document.head.appendChild(meta);
    }
  }, [t]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = t('contact.errorFullName');
    if (!formData.email.trim()) {
      newErrors.email = t('contact.errorEmail');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('contact.errorEmailInvalid');
    }
    if (!formData.message.trim()) {
      newErrors.message = t('contact.errorMessage');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.errorMessageMin');
    } else if (formData.message.length > 5000) {
      newErrors.message = t('contact.errorMessageMax');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      // Only add optional fields if filled
      if (formData.subject.trim()) {
        payload.subject = formData.subject.trim();
      }
      if (formData.phone.trim()) {
        payload.phone = selectedPhoneCode + formData.phone.trim();
      }

      // Submit to backend (public endpoint, no auth needed — use raw axios)
      await axios.post(`${API_BASE_URL}/contact`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Show green success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/');
      }, 3000);

      // Reset form
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting contact message:', error);
      const errorMessage = error.response?.data?.message || t('contact.errorSubmit');
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-[0_10px_25px_rgba(34,197,94,0.4)] flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">✓</div>
            <div>
              <p className="font-semibold text-sm">{t('contact.successTitle')}</p>
              <p className="text-xs opacity-90">{t('contact.successMessage')}</p>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 py-12 pb-16">
        {/* HERO SECTION */}
        <section className="bg-[#ffd60a] rounded-[32px] p-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>{t('contact.heroBadge')}</span>
            </div>
            <h1 className="text-[2.3rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('contact.heroTitle')}
            </h1>
            <p className="text-base mb-4 max-w-[32rem]">
              {t('contact.heroDescription')}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('contact.heroTag1')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('contact.heroTag2')}</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">{t('contact.heroTag3')}</div>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <h2 className="text-[1.5rem] font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('contact.formTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-6">
            {t('contact.formSubtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {t('contact.fullNameLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder={t('contact.fullNamePlaceholder')}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {t('contact.emailLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder={t('contact.emailPlaceholder')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Phone & Subject */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {t('contact.phoneLabel')}
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedPhoneCode}
                    onChange={(e) => setSelectedPhoneCode(e.target.value)}
                    className="w-32 px-2 py-2.5 rounded-xl border border-black/10 bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a] text-sm"
                  >
                    {PHONE_CODES.map((c) => (
                      <option key={c.name} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-black/10 bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]"
                    placeholder={t('contact.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {t('contact.subjectLabel')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                {t('contact.messageLabel')} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.message ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a] resize-none`}
                placeholder={t('contact.messagePlaceholder')}
              />
              <div className="flex justify-between mt-1">
                {errors.message ? (
                  <p className="text-red-500 text-xs">{errors.message}</p>
                ) : (
                  <p className="text-xs opacity-60">
                    {formData.message.length < 10
                      ? t('contact.messageMin', { count: formData.message.length })
                      : t('contact.messageCount', { count: formData.message.length })}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 text-base font-semibold rounded-full bg-[#ffd60a] hover:bg-[#ffcc00] transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('contact.submitting') : t('contact.submitButton')}
              </button>
            </div>
          </form>
        </section>

        {/* INFO SECTION */}
        <section className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">⚡</div>
            <h3 className="font-semibold text-base mb-1">{t('contact.infoCard1Title')}</h3>
            <p className="opacity-85">{t('contact.infoCard1Desc')}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">📧</div>
            <h3 className="font-semibold text-base mb-1">{t('contact.infoCard2Title')}</h3>
            <p className="opacity-85">{t('contact.infoCard2Desc')}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🤝</div>
            <h3 className="font-semibold text-base mb-1">{t('contact.infoCard3Title')}</h3>
            <p className="opacity-85">{t('contact.infoCard3Desc')}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
