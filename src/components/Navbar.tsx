import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/useAuth';
import { auth } from '../lib/firebase';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';
import { Globe, LogOut, Menu, ShoppingBag, User as UserIcon, Shield, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Input } from './ui/input';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success(t('common.logoutSuccess'));
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-background p-1.5 rounded-lg border shadow-sm">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tighter text-primary leading-none">SidCom</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground leading-none mt-1">{t('footer.tagline')}</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex relative group w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors rtl:left-auto rtl:right-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="h-10 pl-10 pr-4 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rtl:pl-4 rtl:pr-10"
            />
          </form>
        </div>

        <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          <Link to="/products" className="text-sm font-semibold hover:text-primary transition-colors relative group">
            {t('common.products')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          {profile?.role === 'seller' && (
            <Link to="/dashboard" className="text-sm font-semibold hover:text-primary transition-colors relative group">
              {t('common.dashboard')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:bg-muted")}>
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="flex justify-between">{t('common.languages.en')} <span className="text-[10px] opacity-50">EN</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')} className="flex justify-between">{t('common.languages.fr')} <span className="text-[10px] opacity-50">FR</span></DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')} className="flex justify-between">{t('common.languages.ar')} <span className="text-[10px] opacity-50">AR</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="flex items-center gap-2 lg:gap-4">
              {profile?.role === 'admin' && (
                <Badge variant="secondary" className="hidden xl:flex gap-1 py-1 h-7 text-[10px] uppercase font-black tracking-widest bg-primary/5 text-primary border-primary/10">
                  <Shield className="w-3.5 h-3.5" /> {t('common.admin')}
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2 p-1 lg:pr-3 rounded-full hover:bg-muted transition-all")}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-semibold text-sm">{user.displayName || user.email?.split('@')[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md">
                      {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold truncate text-base">{user.displayName || t('common.placeholderName')}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  {t('common.profile')}
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    {t('common.adminDashboard')}
                  </DropdownMenuItem>
                )}
                {profile?.role === 'seller' && (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    {t('common.dashboard')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                  <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-3 rtl:space-x-reverse">
              <Button variant="ghost" className="font-semibold rounded-full px-6" onClick={() => navigate('/login')}>
                {t('common.login')}
              </Button>
              <Button className="font-bold rounded-full px-8 shadow-lg shadow-primary/20" onClick={() => navigate('/register')}>
                {t('common.register')}
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t p-6 space-y-6 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors rtl:left-auto rtl:right-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="h-12 pl-10 pr-4 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rtl:pl-4 rtl:pr-10"
            />
          </form>
          <Link to="/products" className="block text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
            {t('common.products')}
          </Link>
          {profile?.role === 'seller' && (
            <Link to="/dashboard" className="block text-lg font-bold hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              {t('common.dashboard')}
            </Link>
          )}
          {!user && (
            <div className="pt-6 space-y-3">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                {t('common.login')}
              </Button>
              <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => { navigate('/register'); setIsMenuOpen(false); }}>
                {t('common.register')}
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
