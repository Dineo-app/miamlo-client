import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const ChefProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Profil Chef</h1>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-sm font-medium text-gray-500">Nom complet</h2>
              <p className="mt-1 text-lg text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-sm font-medium text-gray-500">Email</h2>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>
            
            <div className="border-b pb-4">
              <h2 className="text-sm font-medium text-gray-500">Téléphone</h2>
              <p className="mt-1 text-lg text-gray-900">{user?.phone}</p>
            </div>
            
            {user?.address && (
              <div className="border-b pb-4">
                <h2 className="text-sm font-medium text-gray-500">Adresse</h2>
                <p className="mt-1 text-lg text-gray-900">{user.address}</p>
              </div>
            )}
            
            <div className="border-b pb-4">
              <h2 className="text-sm font-medium text-gray-500">Rôle</h2>
              <p className="mt-1 text-lg text-gray-900">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Chef Partenaire
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Modifier mon profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefProfilePage;
