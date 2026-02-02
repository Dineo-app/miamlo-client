import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="mx-auto w-[85%] max-w-4xl">
        <h1 className="text-4xl font-bold text-black mb-8" style={{ fontFamily: 'Limelight, serif' }}>
          {t('privacy.title')}
        </h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section1.title')}</h2>
            <p className="mb-4">{t('privacy.section1.intro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.section1.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section2.title')}</h2>
            <p className="mb-4">{t('privacy.section2.intro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.section2.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section3.title')}</h2>
            <p>{t('privacy.section3.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section4.title')}</h2>
            <p className="mb-4">{t('privacy.section4.intro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.section4.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section5.title')}</h2>
            <p className="mb-4">{t('privacy.section5.intro')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {(t('privacy.section5.items', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section6.title')}</h2>
            <p>{t('privacy.section6.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">{t('privacy.section7.title')}</h2>
            <p>{t('privacy.section7.content')}</p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('privacy.lastUpdated')} {new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
