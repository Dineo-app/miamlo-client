import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      <main className="mx-auto max-w-7xl px-6 py-7 pb-16">
        {/* HERO SECTION */}
        <section className="mt-6 bg-[#ffd60a] rounded-[32px] p-11 grid lg:grid-cols-[1.2fr_1fr] gap-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>{t('home.heroBadge')}</span>
            </div>
            <h1 className="text-[2.5rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('home.heroMainTitle')}
            </h1>
            <p className="text-base mb-6 max-w-[30rem]">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => navigate('/plats')}
                className="px-5 py-2.5 text-sm font-semibold rounded-full bg-black text-white hover:shadow-2xl transition-all"
                style={{ boxShadow: '0 18px 40px rgba(0, 0, 0, 0.18)' }}
              >
                {t('home.heroButtonGourmand')}
              </button>
              <button
                onClick={() => navigate('/become-chef')}
                className="px-5 py-2.5 text-sm font-semibold rounded-full border border-black/20 bg-white/85 hover:bg-white transition-all"
              >
                {t('home.heroButtonChef')}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 items-center text-xs mb-2">
              <div className="rounded-full px-3.5 py-2 border border-black/20 bg-black text-white flex flex-col justify-center min-w-[130px]">
                <span className="text-[0.7rem] opacity-80">{t('home.heroAppStore')}</span>
                <span className="text-[0.95rem] font-semibold">{t('home.heroAppStoreApp')}</span>
              </div>
              <div className="rounded-full px-3.5 py-2 border border-black/20 bg-black text-white flex flex-col justify-center min-w-[130px]">
                <span className="text-[0.7rem] opacity-80">{t('home.heroAppStore')}</span>
                <span className="text-[0.95rem] font-semibold">{t('home.heroGooglePlay')}</span>
              </div>
            </div>
            <p className="text-xs opacity-80 mt-2">
              {t('home.heroNotification')}
            </p>
          </div>

          <div className="relative">
            <div className="bg-[#fffaf0] rounded-3xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[0.95rem] font-semibold">{t('home.heroCardTitle')}</p>
                  <p className="text-xs opacity-80">{t('home.heroCardSubtitle')}</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-lg bg-[#ffd60a] border-2 border-white">🥘</div>
                  <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-lg bg-[#ffd60a] border-2 border-white">🍣</div>
                  <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-lg bg-[#ffd60a] border-2 border-white">🍰</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-2xl p-3 flex gap-2 items-center">
                  <div className="text-2xl">🍝</div>
                  <div>
                    <p className="font-semibold">Lasagnes du mercredi</p>
                    <p className="text-[0.7rem] opacity-80">Par Claire · 6,50 € · 450 m</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3 flex gap-2 items-center">
                  <div className="text-2xl">🍛</div>
                  <div>
                    <p className="font-semibold">Couscous maison</p>
                    <p className="text-[0.7rem] opacity-80">Par Samir · 7,90 € · 650 m</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3 flex gap-2 items-center">
                  <div className="text-2xl">🍣</div>
                  <div>
                    <p className="font-semibold">Sushi du soir</p>
                    <p className="text-[0.7rem] opacity-80">Par Aiko · 9,90 € · 1,1 km</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3 flex gap-2 items-center">
                  <div className="text-2xl">🧁</div>
                  <div>
                    <p className="font-semibold">Tiramisu pistache</p>
                    <p className="text-[0.7rem] opacity-80">Par Léa · 4,50 € · 300 m</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-2 -top-3 bg-white rounded-full px-3 py-1.5 text-xs shadow-[0_10px_25px_rgba(0,0,0,0.16)] flex items-center gap-1.5">
              <span>{t('home.heroCardVerified')}</span>
            </div>
          </div>
        </section>

        {/* CONCEPT SECTION */}
        <section className="mt-14">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.conceptTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.conceptSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🏡</div>
              <h3 className="font-semibold text-base mb-1">{t('home.conceptLocalTitle')}</h3>
              <p>{t('home.conceptLocalDesc')}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">😋</div>
              <h3 className="font-semibold text-base mb-1">{t('home.conceptHomemadeTitle')}</h3>
              <p>{t('home.conceptHomemadeDesc')}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🤝</div>
              <h3 className="font-semibold text-base mb-1">{t('home.conceptSocialTitle')}</h3>
              <p>{t('home.conceptSocialDesc')}</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="mt-14">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.howTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.howSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <p className="font-bold text-xs uppercase tracking-wider text-black/60 mb-1.5">Étape 1</p>
              <h3 className="font-semibold text-base mb-1">{t('home.howStep1Title')}</h3>
              <p>{t('home.howStep1Desc')}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep1Tag1')}</span>
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep1Tag2')}</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <p className="font-bold text-xs uppercase tracking-wider text-black/60 mb-1.5">Étape 2</p>
              <h3 className="font-semibold text-base mb-1">{t('home.howStep2Title')}</h3>
              <p>{t('home.howStep2Desc')}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep2Tag1')}</span>
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep2Tag2')}</span>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <p className="font-bold text-xs uppercase tracking-wider text-black/60 mb-1.5">Étape 3</p>
              <h3 className="font-semibold text-base mb-1">{t('home.howStep3Title')}</h3>
              <p>{t('home.howStep3Desc')}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep3Tag1')}</span>
                <span className="rounded-full border border-black/10 px-2.5 py-1 bg-[#fffdf5]">{t('home.howStep3Tag2')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* GOURMANDS SECTION */}
        <section className="mt-8 bg-white rounded-3xl p-9 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.gourmandTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.gourmandSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">🍽️</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.gourmandCard1Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.gourmandCard1Desc')}</p>
            </div>
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">💸</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.gourmandCard2Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.gourmandCard2Desc')}</p>
            </div>
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">📍</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.gourmandCard3Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.gourmandCard3Desc')}</p>
            </div>
          </div>
        </section>

        {/* CUISINIERS SECTION */}
        <section className="mt-8 bg-white rounded-3xl p-9 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.chefTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.chefSubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">📸</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.chefCard1Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.chefCard1Desc')}</p>
            </div>
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">⏱️</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.chefCard2Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.chefCard2Desc')}</p>
            </div>
            <div className="bg-[#fffdf5] rounded-2xl p-6 text-center shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <span className="text-[2.4rem] block mb-3">💳</span>
              <p className="font-bold text-[1.05rem] mb-1">{t('home.chefCard3Title')}</p>
              <p className="text-[0.92rem] opacity-85 leading-snug">{t('home.chefCard3Desc')}</p>
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section className="mt-14">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.securityTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.securitySubtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">✅</div>
              <h3 className="font-semibold text-base mb-1">{t('home.securityCard1Title')}</h3>
              <p>{t('home.securityCard1Desc')}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🧼</div>
              <h3 className="font-semibold text-base mb-1">{t('home.securityCard2Title')}</h3>
              <p>{t('home.securityCard2Desc')}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] text-sm">
              <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">⭐</div>
              <h3 className="font-semibold text-base mb-1">{t('home.securityCard3Title')}</h3>
              <p>{t('home.securityCard3Desc')}</p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-14">
          <h2 className="text-[1.6rem] font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('home.faqTitle')}
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-7">
            {t('home.faqSubtitle')}
          </p>
          <div className="space-y-2.5">
            <div className="rounded-2xl border border-black/10 p-4 bg-white text-sm">
              <div className="font-semibold mb-1">{t('home.faq1Question')}</div>
              <div>{t('home.faq1Answer')}</div>
            </div>
            <div className="rounded-2xl border border-black/10 p-4 bg-white text-sm">
              <div className="font-semibold mb-1">{t('home.faq2Question')}</div>
              <div>{t('home.faq2Answer')}</div>
            </div>
            <div className="rounded-2xl border border-black/10 p-4 bg-white text-sm">
              <div className="font-semibold mb-1">{t('home.faq3Question')}</div>
              <div>{t('home.faq3Answer')}</div>
            </div>
            <div className="rounded-2xl border border-black/10 p-4 bg-white text-sm">
              <div className="font-semibold mb-1">{t('home.faq4Question')}</div>
              <div>{t('home.faq4Answer')}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
