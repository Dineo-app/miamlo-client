import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/store/api';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isViewed: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminContactMessageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMessage();
    }
  }, [id]);

  const fetchMessage = async () => {
    try {
      const response = await api.get(`/contact/${id}`);
      setMessage(response.data.data);
    } catch (error: any) {
      console.error('Error fetching message:', error);
      alert(error.response?.data?.message || 'Erreur lors du chargement');
      navigate('/admin/messages');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd60a]"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Message non trouvé</p>
          <button
            onClick={() => navigate('/admin/messages')}
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
            onClick={() => navigate('/admin/messages')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Retour à la liste
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {message.subject || 'Message de ' + message.fullName}
              </h1>
              <p className="text-gray-600 mt-1">Message de contact</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
              message.isViewed
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {message.isViewed ? 'Lu' : 'Non lu'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Sender Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Informations de l'expéditeur</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
                <p className="text-gray-900 font-semibold">{message.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <a href={`mailto:${message.email}`} className="text-[#ffd60a] hover:underline font-medium">
                  {message.email}
                </a>
              </div>
              {message.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                  <a href={`tel:${message.phone}`} className="text-[#ffd60a] hover:underline">
                    {message.phone}
                  </a>
                </div>
              )}
              {message.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Sujet</label>
                  <p className="text-gray-900">{message.subject}</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Message</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Détails</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date de réception</label>
                <p className="text-gray-900">{formatDate(message.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Dernière mise à jour</label>
                <p className="text-gray-900">{formatDate(message.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${message.email}?subject=Re: ${message.subject || 'Votre message sur Miamlo'}`}
                className="px-6 py-3 bg-[#ffd60a] text-black font-semibold rounded-lg hover:bg-[#ffcc00] transition-colors"
              >
                📧 Répondre par email
              </a>
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📞 Appeler
                </a>
              )}
              <button
                onClick={() => navigate('/admin/messages')}
                className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessageDetailPage;
