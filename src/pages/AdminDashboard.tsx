import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/actions/authActions';
import type { RootState } from '@/store/types';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    (dispatch as any)(logout());
    navigate('/login');
  };

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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gérer les Utilisateurs</h3>
            <p className="text-gray-600 text-sm">Voir et gérer tous les utilisateurs</p>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Gérer les Plats</h3>
            <p className="text-gray-600 text-sm">Modérer et gérer tous les plats</p>
          </button>

          <button className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Voir les Rapports</h3>
            <p className="text-gray-600 text-sm">Accéder aux statistiques détaillées</p>
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
