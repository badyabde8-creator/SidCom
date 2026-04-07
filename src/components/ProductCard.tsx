import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'motion/react';

import { User } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-card group">
        <CardHeader className="p-0">
          <div className="aspect-[4/5] relative overflow-hidden bg-muted">
            <img
              src={product.image || `https://picsum.photos/seed/${product.id}/600/800`}
              alt={product.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Badge className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 backdrop-blur-md text-primary border-none font-bold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </Badge>
            
            <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
              <Button onClick={() => navigate(`/products/${product.id}`)} className="w-full rounded-full font-bold shadow-xl">
                {t('common.viewDetails')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-primary/60">
              <User className="w-3 h-3" />
              <span>{product.sellerName}</span>
            </div>
            <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-muted">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">{t('common.price')}</span>
              <span className="text-2xl font-black text-primary tracking-tighter">
                {product.price} <span className="text-xs font-bold text-muted-foreground">{t('common.usd')}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
