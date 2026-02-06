import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateChefPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    categories: [] as string[],
  });

  const [categoryInput, setCategoryInput] = useState('');

  const availableCategories = [
    'Cuisine française',
    'Cuisine italienne',
    'Cuisine japonaise',
    'Cuisine chinoise',
    'Cuisine marocaine',
    'Cuisine tunisienne',
    'Pâtisserie',
    'Cuisine végétarienne',
    'Cuisine végane',
    'Fast Food',
    'Street Food',
    'Cuisine gastronomique',
    'Cuisine traditionnelle',
    'Cuisine fusion',
    'Barbecue',
    'Fruits de mer',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const addCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.phone.startsWith('+')) {
      setError('Le numéro de téléphone doit commencer par + (ex: +33612345678)');
      return;
    }

    if (formData.categories.length === 0) {
      setError('Veuillez sélectionner au moins une catégorie');
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        setError('Non authentifié. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

      const response = await fetch(`${API_BASE_URL}/admin/chefs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✅ Chef créé avec succès! Un SMS de bienvenue a été envoyé.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          description: '',
          categories: [],
        });
        // Redirect after 2 seconds
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      } else {
        setError(data.message || 'Erreur lors de la création du chef');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Error creating chef:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold" 
                style={{ fontFamily: 'Limelight, serif' }}
              >
                Miamlo Admin
              </h1>
              <p className="text-sm text-gray-400 mt-1">Créer un nouveau chef</p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Retour
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Créer un Compte Chef 👨‍🍳</h2>
            <p className="text-gray-600 mt-2">
              Le chef recevra un SMS de bienvenue et pourra se connecter avec son numéro de téléphone.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 flex items-center gap-2">
                <span className="text-xl">✅</span>
                {success}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 flex items-center gap-2">
                <span className="text-xl">❌</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>👤</span>
                Informations Personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📞</span>
                Coordonnées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33612345678"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Format international requis (ex: +33, +216)</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📍</span>
                Adresse
              </h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordonnées GPS <span className="text-gray-500">(optionnel)</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="36.86798171618947, 10.170494516278797"
              />
              <p className="text-xs text-gray-500 mt-1">Format: latitude, longitude</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span>
                Description
              </h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Présentation du chef <span className="text-gray-500">(optionnel)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Chef expérimenté spécialisé dans la cuisine française traditionnelle avec plus de 10 ans d'expérience..."
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏷️</span>
                Catégories <span className="text-red-500">*</span>
              </h3>
              
              {/* Selected Categories */}
              {formData.categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {formData.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Category Selection */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner une catégorie
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Choisir une catégorie --</option>
                    {availableCategories
                      .filter(cat => !formData.categories.includes(cat))
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => addCategory(categoryInput)}
                  disabled={!categoryInput}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  + Ajouter la catégorie
                </button>
              </div>

              {formData.categories.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Veuillez sélectionner au moins une catégorie de cuisine
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Créer le Chef
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            Important
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
            <li>Le chef recevra un SMS en français sur son téléphone</li>
            <li>Il pourra se connecter à l'application mobile avec son numéro</li>
            <li>Aucun mot de passe n'est requis (connexion par code OTP)</li>
            <li>Assurez-vous que le numéro de téléphone est correct</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CreateChefPage;
