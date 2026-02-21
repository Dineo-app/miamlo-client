import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

const AdminCandidaturesPage = () => {
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
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
    country: '',
  });
  
  // Fetch candidatures
  const fetchCandidatures = async (page: number = 0) => {
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
      if (filters.country) params.country = filters.country;
      
      const response = await api.get('/candidatures', { params });
      
      const data = response.data.data;
      setCandidatures(data.candidatures);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setUnviewedCount(data.unviewedCount);
    } catch (error: any) {
      console.error('Error fetching candidatures:', error);
      alert(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCandidatures(0);
  }, [filters]);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };
  
  const handlePageChange = (newPage: number) => {
    fetchCandidatures(newPage);
  };
  
  const viewCandidature = (id: string) => {
    navigate(`/admin/candidatures/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Extract unique countries for filter
  const uniqueCountries = Array.from(new Set(candidatures.map(c => c.country).filter(Boolean)));
  
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidatures Chef</h1>
              <p className="text-gray-600 mt-1">Gérez les candidatures des chefs</p>
            </div>
            <div className="flex items-center gap-4">
              {unviewedCount > 0 && (
                <div className="bg-[#ffd60a] text-black px-4 py-2 rounded-full text-sm font-semibold">
                  {unviewedCount} nouvelle{unviewedCount > 1 ? 's' : ''}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={filters.isViewed}
                onChange={(e) => handleFilterChange('isViewed', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#ffd60a]"
              >
                <option value="">Tous</option>
                <option value="false">Non vus</option>
                <option value="true">Vus</option>
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
            
            <div>
              <label className="block text-sm font-medium mb-2">Pays</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-[#ffd60a]"
              >
                <option value="">Tous les pays</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(filters.isViewed || filters.startDate || filters.endDate || filters.country) && (
            <button
              onClick={() => setFilters({ isViewed: '', startDate: '', endDate: '', country: '' })}
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
        ) : candidatures.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 text-lg">Aucune candidature trouvée</p>
          </div>
        ) : (
          <>
            {/* Candidatures List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidatures.map((candidature) => (
                    <tr 
                      key={candidature.id} 
                      className={`hover:bg-gray-50 transition-colors ${!candidature.isViewed ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!candidature.isViewed && (
                            <div className="w-2 h-2 bg-[#ffd60a] rounded-full"></div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">
                              {candidature.firstName} {candidature.lastName}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {candidature.description.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{candidature.email}</div>
                        <div className="text-sm text-gray-500">{candidature.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{candidature.country}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(candidature.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          candidature.isViewed 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {candidature.isViewed ? 'Vu' : 'Nouveau'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewCandidature(candidature.id)}
                          className="px-4 py-2 bg-[#ffd60a] text-black text-sm font-semibold rounded-lg hover:bg-[#ffcc00] transition-colors"
                        >
                          Voir détails
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
                  {candidatures.length} sur {totalItems} candidatures
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

export default AdminCandidaturesPage;
