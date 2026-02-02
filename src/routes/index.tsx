import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ContentLoader } from '@/components/AnimatedSplash';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load all pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const PlatsPage = lazy(() => import('@/pages/PlatsPage'));
const ChefsPage = lazy(() => import('@/pages/ChefsPage'));
const PromotionsPage = lazy(() => import('@/pages/PromotionsPage'));
const BecomeChefPage = lazy(() => import('@/pages/BecomeChefPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const CustomerDashboard = lazy(() => import('@/pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

const Layout = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ContentLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/plats',
        element: <PlatsPage />,
      },
      {
        path: '/chefs',
        element: <ChefsPage />,
      },
      {
        path: '/promotions',
        element: <PromotionsPage />,
      },
      {
        path: '/become-chef',
        element: <BecomeChefPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
    ],
  },
  // Dashboard routes (without layout)
  {
    path: '/customer/dashboard',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="CUSTOMER">
          <CustomerDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
]);
