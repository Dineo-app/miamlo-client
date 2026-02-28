import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // SEO: dynamic document title + meta tags
  useEffect(() => {
    document.title = t('about.seoTitle');

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', t('about.seoDescription'));
    setMeta('og:title', t('about.seoTitle'), 'property');
    setMeta('og:description', t('about.seoDescription'), 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('twitter:title', t('about.seoTitle'));
    setMeta('twitter:description', t('about.seoDescription'));

    // JSON-LD structured data
    let script = document.getElementById('about-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'about-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Miamlo',
      url: window.location.origin,
      description: t('about.seoDescription'),
      foundingDate: '2025',
      sameAs: [],
    });

    return () => {
      const s = document.getElementById('about-jsonld');
      if (s) s.remove();
    };
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      <main className="mx-auto max-w-5xl px-6 py-12 pb-16">

        {/* HERO SECTION */}
        <section className="bg-[#ffd60a] rounded-[32px] p-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>{t('about.heroBadge')}</span>
            </div>
            <h1 className="text-[2.3rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('about.heroTitle')}
            </h1>
            <p className="text-base max-w-[34rem]">
              {t('about.heroDescription')}
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.08)] mb-8">
          <h2 className="text-[1.5rem] font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.missionTitle')}
          </h2>
          <p className="text-[0.95rem] leading-relaxed opacity-85 mb-5">
            {t('about.missionDescription')}
          </p>
          <blockquote className="border-l-4 border-[#ffd60a] pl-5 py-2 italic text-lg font-medium text-gray-700">
            "{t('about.missionQuote')}"
          </blockquote>
        </section>

        {/* VALUES */}
        <section className="mb-8">
          <h2 className="text-[1.5rem] font-bold mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '✨', key: 'value1' },
              { icon: '📍', key: 'value2' },
              { icon: '🤝', key: 'value3' },
              { icon: '🔍', key: 'value4' },
            ].map((v) => (
              <div key={v.key} className="bg-white rounded-2xl p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                <div className="w-11 h-11 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-3">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-base mb-1.5">{t(`about.${v.key}Title`)}</h3>
                <p className="text-sm opacity-85 leading-relaxed">{t(`about.${v.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.08)] mb-8">
          <h2 className="text-[1.5rem] font-bold mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.howTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', icon: '📸', key: 'howStep1' },
              { num: '2', icon: '🛒', key: 'howStep2' },
              { num: '3', icon: '🏃', key: 'howStep3' },
            ].map((step) => (
              <div key={step.key} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mx-auto mb-3 shadow-[0_8px_20px_rgba(255,214,10,0.35)]">
                  {step.icon}
                </div>
                <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto -mt-5 mb-2 border-2 border-white">
                  {step.num}
                </div>
                <h3 className="font-semibold text-base mb-1">{t(`about.${step.key}Title`)}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{t(`about.${step.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* NUMBERS */}
        <section className="mb-8">
          <h2 className="text-[1.5rem] font-bold mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.numbersTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['number1', 'number2', 'number3', 'number4'].map((key) => (
              <div key={key} className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[2rem] font-bold text-[#ffd60a] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t(`about.${key}Value`)}
                </p>
                <p className="text-sm opacity-75 font-medium">{t(`about.${key}Label`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="bg-[#ffd60a]/10 rounded-3xl p-8 mb-8">
          <h2 className="text-[1.5rem] font-bold mb-3 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.teamTitle')}
          </h2>
          <p className="text-center text-[0.95rem] opacity-80 max-w-2xl mx-auto">
            {t('about.teamDescription')}
          </p>
        </section>

        {/* COMMITMENTS */}
        <section className="mb-10">
          <h2 className="text-[1.5rem] font-bold mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.commitTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {['commit1', 'commit2', 'commit3'].map((key) => (
              <div key={key} className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
                <h3 className="font-semibold text-base mb-2">{t(`about.${key}Title`)}</h3>
                <p className="opacity-85 leading-relaxed">{t(`about.${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-black rounded-[32px] p-10 text-white text-center shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
          <h2 className="text-[1.8rem] font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('about.ctaTitle')}
          </h2>
          <p className="text-base opacity-80 mb-6 max-w-lg mx-auto">
            {t('about.ctaDescription')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/become-chef')}
              className="px-6 py-3 text-sm font-semibold rounded-full bg-[#ffd60a] text-black hover:bg-[#ffcc00] transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)]"
            >
              {t('about.ctaButtonChef')}
            </button>
            <button
              onClick={() => navigate('/plats')}
              className="px-6 py-3 text-sm font-semibold rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-all"
            >
              {t('about.ctaButtonDiscover')}
            </button>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutPage;
