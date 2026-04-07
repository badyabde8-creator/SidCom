import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      toast.success(t('common.messageSent'));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">{t('common.contact')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.heroDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('contact.emailUs')}</h3>
                  <p className="text-muted-foreground">support@sidcom.global</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('contact.callUs')}</h3>
                  <p className="text-muted-foreground">+1 (555) 000-0000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('contact.visitUs')}</h3>
                  <p className="text-muted-foreground">123 Global Trade Center, New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white space-y-6">
              <h3 className="text-2xl font-bold tracking-tight">{t('contact.globalSupport')}</h3>
              <p className="text-slate-400">
                {t('contact.globalSupportDesc')}
              </p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {['EN', 'AR', 'FR', 'ES'][i-1]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-muted/30 p-10">
                <CardTitle className="text-3xl font-bold tracking-tight">{t('common.sendMessage')}</CardTitle>
                <CardDescription>{t('contact.formDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('common.fullName')}</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('common.placeholderName')}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('common.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('common.placeholderEmail')}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('common.subject')}</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t('contact.subjectPlaceholder')}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('common.message')}</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t('contact.messagePlaceholder')}
                      className="min-h-[150px] rounded-xl"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-full text-lg font-bold shadow-xl">
                    {loading ? t('common.loading') : (
                      <>
                        <Send className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                        {t('common.sendMessage')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
