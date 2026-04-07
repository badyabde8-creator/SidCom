import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import './i18n';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}
