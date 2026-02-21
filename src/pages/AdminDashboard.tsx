import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/actions/authActions';
import { fetchAdminStats } from '@/store/actions/adminActions';
import type { RootState } from '@/store';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    // Fetch admin stats on component mount
    (dispatch as any)(fetchAdminStats());
  }, [dispatch]);

  const handleLogout = () => {
    (dispatch as any)(logout());
    navigate('/login');
  };

  // Skeleton loader component
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 
              className="text-3xl font-bold" 
              style={{ fontFamily: 'Limelight, serif' }}
            >
              Miamlo Admin
            </h1>
            <p className="text-sm text-gray-400 mt-1">Panneau d'administration</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Bienvenue, Admin {user?.firstName}! 🔐
          </h2>
          <p className="text-gray-600">
            Gérez votre plateforme depuis ce tableau de bord.
          </p>
        </div>

        {/* Admin Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Administrateur</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Nom complet:</span>
              <span className="text-gray-800 font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Email:</span>
              <span className="text-gray-800 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Téléphone:</span>
              <span className="text-gray-800 font-medium">{user?.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Rôle:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : error ? (
            <div className="col-span-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Erreur de chargement des statistiques</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={() => (dispatch as any)(fetchAdminStats())}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chefs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.totalChefs || 0}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">👨‍🍳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Plats</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.totalDishes || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <span className="text-2xl">🍽️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Commandes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats?.totalOrders || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats?.todayOrders || 0} aujourd'hui
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => navigate('/admin/create-chef')}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-sm p-6 text-left hover:shadow-lg hover:scale-105 transition-all"
          >
            <div className="text-4xl mb-3">👨‍🍳</div>
            <h3 className="text-lg font-semibold mb-2">Créer un Chef</h3>
            <p className="text-green-50 text-sm">Ajouter un nouveau chef à la plateforme</p>
          </button>

          <button 
            onClick={() => navigate('/admin/chefs')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gérer les Chefs</h3>
            <p className="text-gray-600 text-sm">Voir et gérer tous les chefs</p>
          </button>

          <button 
            onClick={() => navigate('/admin/candidatures')}
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-lg shadow-sm p-6 text-left hover:shadow-lg hover:scale-105 transition-all relative"
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold mb-2">Candidatures</h3>
            <p className="text-yellow-900 text-sm">Voir les candidatures des chefs</p>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gérer les Plats</h3>
            <p className="text-gray-600 text-sm">Modérer et gérer tous les plats</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité Récente</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Aucune activité récente</p>
            <p className="text-sm mt-2">Les activités système apparaîtront ici</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
