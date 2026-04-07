import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), formData);
      toast.success(t('common.profileUpdated'));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/3"
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-32 bg-primary"></div>
              <CardContent className="relative pt-16 pb-8 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">{profile.displayName || t('common.placeholderName')}</h2>
                <p className="text-muted-foreground text-sm mb-4">{profile.email}</p>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <Shield className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t(`common.${profile.role}`)}
                </div>

                <div className="space-y-4 text-left rtl:text-right">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-2/3"
          >
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>{t('common.editProfile')}</CardTitle>
                <CardDescription>{t('dashboard.manage')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">{t('common.fullName')}</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder={t('common.placeholderName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">{t('common.phoneNumber')}</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('common.address')}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('common.bio')}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t('common.loading') : t('common.updateProfile')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
