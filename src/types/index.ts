export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'seller' | 'admin';
  phoneNumber?: string;
  address?: string;
  bio?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}
