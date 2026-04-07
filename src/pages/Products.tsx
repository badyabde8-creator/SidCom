import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setFilteredProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    const cat = searchParams.get('category');
    if (search !== null) setSearchTerm(search);
    if (cat !== null) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    setFilteredProducts(result);
  }, [searchTerm, category, products]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="space-y-4">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 px-4 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
            {t('products.browse')}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-balance leading-[0.85]">{t('common.products')}</h1>
          <p className="text-muted-foreground text-xl max-w-xl">{t('products.browseDesc') || "Discover premium items from our global community of verified sellers."}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors rtl:left-auto rtl:right-4" />
            <Input
              placeholder={t('common.search')}
              className="h-14 pl-12 pr-6 rounded-2xl border-muted bg-muted/30 focus:bg-background focus:ring-primary/20 transition-all rtl:pl-6 rtl:pr-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-14 w-full sm:w-56 rounded-2xl border-muted bg-muted/30 focus:bg-background transition-all text-lg font-medium">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-primary" />
                <SelectValue placeholder={t('common.category')} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl p-2">
              {categories.map((cat: any) => (
                <SelectItem key={cat} value={cat} className="rounded-xl h-10">
                  {cat === 'all' ? t('common.all') : (cat as string).charAt(0).toUpperCase() + (cat as string).slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-[500px] rounded-[2.5rem] bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Search className="w-10 h-10" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">{t('common.noProducts')}</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setCategory('all'); }} className="rounded-full px-8 h-12 font-bold">{t('common.clearFilters')}</Button>
        </div>
      )}
    </div>
  );
}
