import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Ghost, Home, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative inline-block"
        >
          <Ghost className="w-32 h-32 text-muted mx-auto animate-bounce" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-primary/10 select-none">
            404
          </div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">{t('common.pageNotFound')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('common.pageNotFoundDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button render={<Link to="/" />} nativeButton={false} size="lg" className="gap-2">
            <Home className="w-5 h-5" /> {t('common.goHome')}
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} size="lg" className="gap-2">
            <ArrowLeft className="w-5 h-5" /> {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
