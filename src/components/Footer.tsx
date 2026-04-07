import { useTranslation } from 'react-i18next';
import { ShoppingBag, Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/5 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-white leading-none">SidCom</span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 leading-none mt-1">{t('footer.tagline')}</span>
              </div>
            </Link>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              {t('footer.about')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">{t('footer.shop')}</h4>
            <ul className="space-y-4 text-base">
              <li><Link to="/products" className="hover:text-white transition-colors">{t('common.allProducts')}</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-white transition-colors">{t('footer.electronics')}</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-white transition-colors">{t('footer.fashion')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">{t('footer.support')}</h4>
            <ul className="space-y-4 text-base">
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('common.contact')}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">{t('footer.returns')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">{t('footer.newsletterTitle')}</h4>
            <p className="text-sm">{t('footer.newsletterDesc')}</p>
            <div className="flex gap-2">
              <input type="email" placeholder={t('footer.emailPlaceholder')} className="bg-white/5 border border-white/10 rounded-full px-6 py-3 flex-grow text-sm focus:outline-none focus:border-primary transition-colors" />
              <Button className="rounded-full px-6 font-bold">{t('footer.join')}</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <p className="font-medium">© {currentYear} {t('footer.brandName')}. {t('footer.allRightsReserved')}</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-white transition-colors font-medium">{t('footer.privacy')}</Link>
            <Link to="#" className="hover:text-white transition-colors font-medium">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
