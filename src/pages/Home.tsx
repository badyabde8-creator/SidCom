import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck, Star, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-8"
          >
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              {t('home.newSeason')}
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter text-balance">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed font-medium">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/40 group" onClick={() => navigate('/products')}>
                {t('home.explore')} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                {t('home.learnMore')}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t('home.stats.products')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">12k+</div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t('home.stats.sellers')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t('home.stats.users')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 lg:px-8 -mt-12 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, title: "Secure Payments", desc: "100% protected transactions" },
            { icon: Zap, title: "Fast Delivery", desc: "Global shipping in 3-5 days" },
            { icon: Star, title: "Premium Quality", desc: "Handpicked verified items" },
            { icon: Globe, title: "World Wide", desc: "Connecting buyers globally" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border p-6 rounded-3xl shadow-xl flex items-center gap-4 group hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{t('home.featuredProducts')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.handpicked')}</p>
          </div>
          <Button variant="ghost" className="font-bold text-primary hover:bg-primary/5 rounded-full px-6" onClick={() => navigate('/products')}>
            {t('home.viewAll')} <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted/30 rounded-[3rem] border-2 border-dashed">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <p className="text-xl font-medium text-muted-foreground">{t('common.noProducts')}</p>
          </div>
        )}
      </section>

      {/* Categories Bento Grid */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-8 relative rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 flex flex-col justify-end">
              <Badge className="w-fit mb-4 bg-white/20 backdrop-blur-md text-white border-none px-4 py-1">{t('home.electronics')}</Badge>
              <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">{t('home.electronics')}</h3>
              <p className="text-white/70 max-w-md text-lg leading-relaxed">{t('home.electronicsDesc')}</p>
            </div>
          </motion.div>
          
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-8 flex flex-col justify-end">
                <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-md text-white border-none">{t('home.fashion')}</Badge>
                <h3 className="text-3xl font-black text-white tracking-tighter">{t('home.fashion')}</h3>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer bg-primary p-10 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-white leading-[0.9] tracking-tighter">{t('home.joinSellerTitle')}</h3>
              </div>
              <Button variant="secondary" className="w-full rounded-full font-bold h-14 text-lg shadow-xl" onClick={() => navigate('/register')}>{t('home.getStarted')}</Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
