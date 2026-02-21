import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/store/api';

interface Candidature {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  description: string;
  country: string;
  resumeUrl: string;
  isViewed: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminCandidatureDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchCandidature();
    }
  }, [id]);
  
  const fetchCandidature = async () => {
    try {
      const response = await api.get(`/candidatures/${id}`);
      setCandidature(response.data.data);
    } catch (error: any) {
      console.error('Error fetching candidature:', error);
      alert(error.response?.data?.message || 'Erreur lors du chargement');
      navigate('/admin/candidatures');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd60a]"></div>
      </div>
    );
  }
  
  if (!candidature) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Candidature non trouvée</p>
          <button
            onClick={() => navigate('/admin/candidatures')}
            className="mt-4 px-4 py-2 bg-[#ffd60a] text-black rounded-lg hover:bg-[#ffcc00]"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/candidatures')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Retour à la liste
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {candidature.firstName} {candidature.lastName}
              </h1>
              <p className="text-gray-600 mt-1">Candidature Chef</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
              candidature.isViewed 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {candidature.isViewed ? 'Vue' : 'Nouvelle'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                <p className="text-gray-900 font-semibold">{candidature.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                <p className="text-gray-900 font-semibold">{candidature.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <a href={`mailto:${candidature.email}`} className="text-[#ffd60a] hover:underline">
                  {candidature.email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                <a href={`tel:${candidature.phone}`} className="text-[#ffd60a] hover:underline">
                  {candidature.phone}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date de naissance</label>
                <p className="text-gray-900">
                  {formatDate(candidature.dateOfBirth)} ({calculateAge(candidature.dateOfBirth)} ans)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pays</label>
                <p className="text-gray-900">{candidature.country}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Présentation</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {candidature.description}
            </p>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">CV</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📄</div>
                <div>
                  <p className="font-semibold text-gray-900">CV.pdf</p>
                  <p className="text-sm text-gray-500">Document PDF</p>
                </div>
              </div>
              <a
                href={candidature.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#ffd60a] text-black font-semibold rounded-lg hover:bg-[#ffcc00] transition-colors"
              >
                Télécharger
              </a>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Détails de soumission</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date de candidature</label>
                <p className="text-gray-900">{formatDate(candidature.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Dernière mise à jour</label>
                <p className="text-gray-900">{formatDate(candidature.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${candidature.email}?subject=Votre candidature sur Dineo`}
                className="px-6 py-3 bg-[#ffd60a] text-black font-semibold rounded-lg hover:bg-[#ffcc00] transition-colors"
              >
                📧 Envoyer un email
              </a>
              <a
                href={`tel:${candidature.phone}`}
                className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                📞 Appeler
              </a>
              <a
                href={candidature.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                📄 Voir le CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCandidatureDetailPage;
