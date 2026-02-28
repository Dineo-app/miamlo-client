import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

const AdminContactMessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unviewedCount, setUnviewedCount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    isViewed: '' as '' | 'true' | 'false',
    startDate: '',
    endDate: '',
  });

  // Fetch messages
  const fetchMessages = async (page: number = 0) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (filters.isViewed !== '') params.isViewed = filters.isViewed === 'true';
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await api.get('/contact', { params });

      const data = response.data.data;
      setMessages(data.messages);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setUnviewedCount(data.unviewedCount);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      alert(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(0);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    fetchMessages(newPage);
  };

  const viewMessage = (id: string) => {
    navigate(`/admin/messages/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages de contact</h1>
              <p className="text-gray-600 mt-1">Gérez les messages reçus via le formulaire de contact</p>
            </div>
            <div className="flex items-center gap-4">
              {unviewedCount > 0 && (
                <div className="bg-[#ffd60a] text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {unviewedCount} non lu{unviewedCount > 1 ? 's' : ''}
                </div>
              )}
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Retour au dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={filters.isViewed}
                onChange={(e) => handleFilterChange('isViewed', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#ffd60a]"
              >
                <option value="">Tous</option>
                <option value="false">Non lus</option>
                <option value="true">Lus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#ffd60a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#ffd60a]"
              />
            </div>
          </div>

          {(filters.isViewed || filters.startDate || filters.endDate) && (
            <button
              onClick={() => setFilters({ isViewed: '', startDate: '', endDate: '' })}
              className="mt-4 text-sm text-[#ffd60a] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd60a]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📬</div>
            <p className="text-gray-600 text-lg">Aucun message trouvé</p>
          </div>
        ) : (
          <>
            {/* Messages List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expéditeur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sujet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aperçu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${!msg.isViewed ? 'bg-yellow-50' : ''}`}
                      onClick={() => viewMessage(msg.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!msg.isViewed && (
                            <div className="w-2 h-2 bg-[#ffd60a] rounded-full flex-shrink-0"></div>
                          )}
                          <div>
                            <div className={`text-gray-900 ${!msg.isViewed ? 'font-bold' : 'font-semibold'}`}>
                              {msg.fullName}
                            </div>
                            <div className="text-sm text-gray-500">{msg.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {msg.subject || <span className="text-gray-400 italic">Sans sujet</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {msg.message.substring(0, 80)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          msg.isViewed
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {msg.isViewed ? 'Lu' : 'Non lu'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); viewMessage(msg.id); }}
                          className="px-4 py-2 bg-[#ffd60a] text-black text-sm font-semibold rounded-lg hover:bg-[#ffcc00] transition-colors"
                        >
                          Lire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {messages.length} sur {totalItems} messages
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Précédent
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 3) {
                        pageNum = i;
                      } else if (currentPage > totalPages - 3) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#ffd60a] text-black font-semibold'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessagesPage;
