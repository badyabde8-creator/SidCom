import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, ArrowLeft, User, Calendar, Tag, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

import { toast } from 'sonner';

export default function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleContactSeller = () => {
    if (product?.sellerEmail) {
      window.location.href = `mailto:${product.sellerEmail}?subject=Inquiry about ${product.title}`;
    } else {
      toast.error("Seller contact information not available.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-muted rounded-3xl" />
          <div className="space-y-6">
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded w-full" />
            <div className="h-12 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('products.notFound')}</h1>
        <Button onClick={() => navigate('/products')}>{t('products.backToProducts')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-12 hover:bg-primary/5 rounded-full px-6">
        <ArrowLeft className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 rtl:rotate-180" /> {t('common.back')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted shadow-2xl relative group"
        >
          <img
            src={product.image || `https://picsum.photos/seed/${product.id}/1200/1500`}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-8">
            <Badge className="bg-white/90 backdrop-blur-md text-primary border-none text-sm px-6 py-2 rounded-full shadow-xl font-bold uppercase tracking-widest">
              {product.category}
            </Badge>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-10"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">{product.sellerName}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-balance">{product.title}</h1>
            
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-primary tracking-tighter">{product.price}</span>
              <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">{t('common.usd')}</span>
            </div>
          </div>

          <div className="h-px bg-muted w-full" />

          <div className="space-y-6">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
              <Tag className="h-4 w-4" /> {t('common.description')}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-xl font-medium">
              {product.description}
            </p>
          </div>

          <div className="pt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1 h-20 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group">
              <ShoppingCart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform rtl:ml-3 rtl:mr-0" /> {t('products.addToCart')}
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-20 rounded-[2rem] text-xl font-black border-muted hover:bg-muted/50 transition-all" onClick={handleContactSeller}>
              {t('products.contactSeller')}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-6 rounded-3xl bg-muted/30 border border-muted/50 space-y-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h4 className="font-bold text-sm">{t('products.securePurchase')}</h4>
              <p className="text-xs text-muted-foreground">{t('products.securePurchaseDesc')}</p>
            </div>
            <div className="p-6 rounded-3xl bg-muted/30 border border-muted/50 space-y-2">
              <Globe className="w-6 h-6 text-primary" />
              <h4 className="font-bold text-sm">{t('products.globalShipping')}</h4>
              <p className="text-xs text-muted-foreground">{t('products.globalShippingDesc')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
