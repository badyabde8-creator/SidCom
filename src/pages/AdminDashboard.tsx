import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from 'sonner';
import { Users, Package, ShoppingBag, Trash2, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Product, Message } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { cn } from '../lib/utils';
import { buttonVariants } from '../components/ui/button';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProducts();
      unsubscribeMessages();
    };
  }, [profile]);

  const handleDeleteProduct = async (id: string) => {
    if (confirm(t('common.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success(t('common.deleteSuccess'));
      } catch (error: any) {
        handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm(t('common.deleteConfirm'))) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        toast.success(t('common.deleteSuccess'));
      } catch (error: any) {
        handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(t('common.profileUpdated'));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  if (profile?.role !== 'admin') {
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
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" /> {t('common.adminDashboard')}
          </h1>
          <p className="text-muted-foreground">{t('dashboard.manage')}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" /> {t('common.back')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('common.allUsers')}</CardTitle>
            <Users className="h-4 w-4 opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('common.allProducts')}</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('common.stats')}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.00 {t('common.usd')}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-12">
        {/* Messages Table */}
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> {t('common.messages')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.fullName')}</th>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.subject')}</th>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.message')}</th>
                    <th className="px-6 py-4 font-semibold text-sm text-right rtl:text-left">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {messages.length > 0 ? messages.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-xs text-muted-foreground">{m.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{m.subject}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{m.message}</td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteMessage(m.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        {t('common.noMessages')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Users Table */}
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> {t('common.users')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.fullName')}</th>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.role')}</th>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.email')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{u.displayName || '---'}</td>
                      <td className="px-6 py-4">
                        <Select 
                          value={u.role} 
                          onValueChange={(val) => handleRoleChange(u.uid, val)}
                          disabled={u.uid === profile?.uid}
                        >
                          <SelectTrigger className="h-8 w-28 text-[10px] font-bold uppercase tracking-wider">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buyer">{t('common.buyer')}</SelectItem>
                            <SelectItem value="seller">{t('common.seller')}</SelectItem>
                            <SelectItem value="admin">{t('common.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" /> {t('common.allProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">{t('dashboard.product')}</th>
                    <th className="px-6 py-4 font-semibold text-sm">{t('common.price')}</th>
                    <th className="px-6 py-4 font-semibold text-sm text-right rtl:text-left">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                          <span className="font-medium line-clamp-1">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{p.price} {t('common.usd')}</td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <div className="flex justify-end gap-2 rtl:justify-start">
                          <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Link to={`/products/${p.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
}
