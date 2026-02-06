import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Link } from 'react-router-dom';

const ChefDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue Chef {user?.firstName} ! 👨‍🍳
          </h1>
          <p className="mt-2 text-gray-600">Gérez vos plats, commandes et statistiques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/chef/dishes"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mes Plats</h3>
                <p className="mt-1 text-sm text-gray-500">Gérer le menu</p>
              </div>
              <div className="text-3xl">🍽️</div>
            </div>
          </Link>

          <Link
            to="/chef/orders"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mes Commandes</h3>
                <p className="mt-1 text-sm text-gray-500">En attente de traitement</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </Link>

          <Link
            to="/chef/profile"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mon Profil</h3>
                <p className="mt-1 text-sm text-gray-500">Informations chef</p>
              </div>
              <div className="text-3xl">👤</div>
            </div>
          </Link>

          <Link
            to="/chef/statistics"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
                <p className="mt-1 text-sm text-gray-500">Performance</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </Link>

          <Link
            to="/chef/promotions"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Promotions</h3>
                <p className="mt-1 text-sm text-gray-500">Offres spéciales</p>
              </div>
              <div className="text-3xl">🎉</div>
            </div>
          </Link>

          <Link
            to="/chef/reviews"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Avis Clients</h3>
                <p className="mt-1 text-sm text-gray-500">Voir les commentaires</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
