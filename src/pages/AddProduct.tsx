import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/useAuth';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { ArrowLeft, Upload } from 'lucide-react';

export default function AddProduct() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: user.uid,
        sellerName: profile?.displayName || user.email,
        sellerEmail: user.email,
        createdAt: new Date().toISOString(),
      });
      toast.success(t('common.addSuccess'));
      navigate('/dashboard');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" /> {t('common.back')}
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('common.addProduct')}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('common.title')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder={t('common.placeholderTitle')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('common.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('products.tellBuyers')}
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">{t('common.price')} ({t('common.usd')})</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder={t('common.placeholderPrice')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('common.category')}</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder={t('common.placeholderCategory')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">{t('common.image')}</Label>
                <div className="flex gap-4">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder={t('common.placeholderImage')}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {formData.image && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-muted">
                    <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? t('common.loading') : t('common.save')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
