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
const CreateChefPage = lazy(() => import('@/pages/CreateChefPage'));
const CustomerProfilePage = lazy(() => import('@/pages/CustomerProfilePage'));
const AdminProfilePage = lazy(() => import('@/pages/AdminProfilePage'));
const ChefProfilePage = lazy(() => import('@/pages/ChefProfilePage'));
const ChefDashboard = lazy(() => import('@/pages/ChefDashboard'));
const AdminChefsPage = lazy(() => import('@/pages/AdminChefsPage'));
const AdminChefDetailPage = lazy(() => import('@/pages/AdminChefDetailPage'));
const AdminCandidaturesPage = lazy(() => import('@/pages/AdminCandidaturesPage'));
const AdminCandidatureDetailPage = lazy(() => import('@/pages/AdminCandidatureDetailPage'));

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
  {
    path: '/admin/create-chef',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <CreateChefPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/customer/profile',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="CUSTOMER">
          <CustomerProfilePage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminProfilePage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/chefs',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminChefsPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/chefs/:chefId',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminChefDetailPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/candidatures',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminCandidaturesPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin/candidatures/:id',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="ADMIN">
          <AdminCandidatureDetailPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/chef/profile',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="PROVIDER">
          <ChefProfilePage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/chef/dashboard',
    element: (
      <Suspense fallback={<ContentLoader />}>
        <ProtectedRoute role="PROVIDER">
          <ChefDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
]);
