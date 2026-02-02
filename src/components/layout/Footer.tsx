import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo-removebg.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-black/10 py-7 px-6 bg-[#fffdf5] text-sm">
      <div className="mx-auto max-w-7xl flex flex-wrap gap-5 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo MIAMLO" className="w-full h-full object-contain" />
          </div>
          <span className="text-base font-bold tracking-widest" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.14em' }}>
            {t('navbar.brand')}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 opacity-80">
          <span>© {new Date().getFullYear()} {t('navbar.brand')}</span>
          <span>·</span>
          <Link to="/privacy" className="hover:opacity-100">{t('footer.privacy')}</Link>
          <span>·</span>
          <Link to="/terms" className="hover:opacity-100">{t('footer.terms')}</Link>
          <span>·</span>
          <Link to="/#top" className="hover:opacity-100">Retour en haut</Link>
          <span>·</span>
          <a href="mailto:contact@miamlo.com" className="hover:opacity-100">contact@miamlo.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
