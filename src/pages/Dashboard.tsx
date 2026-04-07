import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/useAuth';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Plus, Trash2, Edit, ShoppingBag, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'products'), where('sellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm(t('common.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success(t('common.deleteSuccess'));
      } catch (error: any) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  if (profile?.role !== 'seller') {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('common.accessDenied')}</h1>
        <p className="text-muted-foreground mb-8">{t('common.sellerOnly')}</p>
        <Button onClick={() => navigate('/')}>{t('common.goHome')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{t('common.dashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboard.manage')}</p>
        </div>
        <Button render={<Link to="/add-product" />} nativeButton={false} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> {t('common.addProduct')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalProducts')}</CardTitle>
            <Package className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalSales')}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 {t('common.usd')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-3xl shadow-xl overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">{t('dashboard.product')}</th>
                <th className="px-6 py-4 font-semibold text-sm">{t('common.category')}</th>
                <th className="px-6 py-4 font-semibold text-sm">{t('common.price')}</th>
                <th className="px-6 py-4 font-semibold text-sm text-right rtl:text-left">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-4 bg-muted rounded w-full" /></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <span className="font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">{product.price} {t('common.usd')}</td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <div className="flex justify-end gap-2 rtl:justify-start">
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    {t('dashboard.noProductsDesc')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
