import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/actions/authActions';
import type { RootState } from '@/store/types';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    (dispatch as any)(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 
            className="text-3xl font-bold text-black" 
            style={{ fontFamily: 'Limelight, serif' }}
          >
            Miamlo
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#ffdd00] text-black font-medium rounded-lg hover:bg-[#ffd700] transition-colors"
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
            Bienvenue, {user?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            Explorez nos plats délicieux et passez vos commandes facilement.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mes Informations</h3>
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/plats')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Parcourir les Plats</h3>
            <p className="text-gray-600 text-sm">Découvrez notre sélection de plats délicieux</p>
          </button>

          <button
            onClick={() => navigate('/chefs')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">👨‍🍳</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nos Chefs</h3>
            <p className="text-gray-600 text-sm">Découvrez les chefs talentueux près de chez vous</p>
          </button>

          <button
            onClick={() => navigate('/promotions')}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Promotions</h3>
            <p className="text-gray-600 text-sm">Ne manquez pas nos offres spéciales</p>
          </button>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité Récente</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Aucune activité récente</p>
            <p className="text-sm mt-2">Commencez à explorer nos plats!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
