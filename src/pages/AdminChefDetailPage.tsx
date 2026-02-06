import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { fetchChefDetail } from '@/store/actions/adminActions';
import { DISH_CATEGORIES, getCategoryEmoji } from '@/constants/categories';
import { api } from '@/store/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ClockIcon,
  CurrencyEuroIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Ingredient {
  name: string;
  price: number;
  isFree: boolean;
}

const AdminChefDetailPage: React.FC = () => {
  const { chefId } = useParams<{ chefId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedChef, loading, error } = useSelector((state: RootState) => state.admin);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Form state
  const [plateName, setPlateName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Ingredient state
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientPrice, setNewIngredientPrice] = useState('');
  const [isIngredientFree, setIsIngredientFree] = useState(true);
  
  // Category search
  const [categorySearch, setCategorySearch] = useState('');
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (chefId) {
      dispatch(fetchChefDetail(chefId) as any);
    }
  }, [chefId, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const addIngredient = () => {
    if (!newIngredientName.trim()) {
      alert('Veuillez entrer un nom d\'ingrédient');
      return;
    }

    const price = isIngredientFree ? 0 : parseFloat(newIngredientPrice);
    
    if (!isIngredientFree && (isNaN(price) || price < 0)) {
      alert('Veuillez entrer un prix valide pour l\'ingrédient payant');
      return;
    }

    setIngredients([
      ...ingredients,
      {
        name: newIngredientName.trim(),
        price: price,
        isFree: isIngredientFree,
      },
    ]);

    // Reset form
    setNewIngredientName('');
    setNewIngredientPrice('');
    setIsIngredientFree(true);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const filteredCategories = categorySearch
    ? DISH_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : DISH_CATEGORIES;

  const courseCategories = filteredCategories.filter(cat => cat.type === 'course');
  const cuisineCategories = filteredCategories.filter(cat => cat.type === 'cuisine');
  const dishTypeCategories = filteredCategories.filter(cat => cat.type === 'dish-type');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!plateName.trim()) {
      alert('Veuillez entrer un nom de plat');
      return;
    }
    if (!description.trim()) {
      alert('Veuillez entrer une description');
      return;
    }
    if (!cookTime || parseInt(cookTime) <= 0) {
      alert('Veuillez entrer un temps de cuisson valide');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }
    if (selectedCategories.length === 0) {
      alert('Veuillez sélectionner au moins une catégorie');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();
      
      const plateData = {
        name: plateName.trim(),
        description: description.trim(),
        estimatedCookTime: parseInt(cookTime),
        price: parseFloat(price),
        categories: selectedCategories,
        available: true,
      };
      
      formData.append('plateData', JSON.stringify(plateData));
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Create plate (api instance automatically adds Authorization header)
      // Delete default Content-Type to let browser set multipart/form-data automatically
      const response = await api.post(`/admin/chefs/${chefId}/plates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const createdPlateId = response.data.data.id;

      // Create ingredients (api instance automatically adds Authorization header)
      if (ingredients.length > 0) {
        await Promise.all(
          ingredients.map(ingredient =>
            api.post(`/plats/${createdPlateId}/ingredients`, ingredient)
          )
        );
      }

      alert('Plat créé avec succès!');
      
      // Reset form
      setPlateName('');
      setDescription('');
      setCookTime('');
      setPrice('');
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedCategories([]);
      setIngredients([]);
      setShowCreateModal(false);

      // Refresh chef data
      dispatch(fetchChefDetail(chefId!) as any);

    } catch (error: any) {
      console.error('Error creating plate:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Sent data:', {
        plateData: {
          name: plateName.trim(),
          description: description.trim(),
          estimatedCookTime: parseInt(cookTime),
          price: parseFloat(price),
          categories: selectedCategories,
          available: true,
        },
        hasImage: !!selectedImage
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Erreur lors de la création du plat';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/admin/chefs')}
          className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (!selectedChef) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chef non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate('/admin/chefs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 bg-transparent"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </button>
      </div>

      {/* Chef Info Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-12 h-12 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedChef.firstName} {selectedChef.lastName}
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{selectedChef.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{selectedChef.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {selectedChef.isActive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Actif
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <XCircleIcon className="w-4 h-4 mr-1" />
                Inactif
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {selectedChef.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{selectedChef.description}</p>
          </div>
        )}

        {/* Address */}
        {selectedChef.address && (
          <div className="mt-4 flex items-start text-gray-600">
            <MapPinIcon className="w-5 h-5 mr-2 mt-0.5" />
            <span>{selectedChef.address}</span>
          </div>
        )}
      </div>

      {/* Plates Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Plats du chef ({selectedChef.plates?.length || 0})
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Créer un plat
          </button>
        </div>

        {/* Plates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedChef.plates && selectedChef.plates.length > 0 ? (
            selectedChef.plates.map((plate) => (
              <div key={plate.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {plate.imageUrl && (
                  <img
                    src={plate.imageUrl}
                    alt={plate.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plate.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plate.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {plate.estimatedCookTime} min
                    </div>
                    <div className="flex items-center text-yellow-600 font-semibold">
                      <CurrencyEuroIcon className="w-5 h-5 mr-1" />
                      {plate.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {plate.categories?.slice(0, 3).map((category, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {getCategoryEmoji(category)} {category}
                      </span>
                    ))}
                    {plate.categories && plate.categories.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{plate.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Aucun plat créé pour ce chef</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Plate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Créer un nouveau plat</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du plat
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour télécharger une image
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG jusqu'à 10MB
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Plate Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du plat *
                </label>
                <input
                  type="text"
                  value={plateName}
                  onChange={(e) => setPlateName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                  placeholder="Ex: Pizza Margherita"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{plateName.length}/200</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                  placeholder="Décrivez votre plat..."
                  rows={4}
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/2000</p>
              </div>

              {/* Cook Time and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temps de cuisson (minutes) *
                  </label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                    placeholder="12.50"
                    min="0.01"
                    required
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégories * ({selectedCategories.length} sélectionnée{selectedCategories.length > 1 ? 's' : ''})
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-yellow-400 transition-colors text-left bg-white"
                >
                  {selectedCategories.length === 0 ? (
                    <span className="text-gray-500">Sélectionnez des catégories...</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                        >
                          {getCategoryEmoji(cat)} {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </div>

              {/* Ingredients Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrédients ({ingredients.length})
                </label>
                
                {/* Add Ingredient Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      value={newIngredientName}
                      onChange={(e) => setNewIngredientName(e.target.value)}
                      placeholder="Nom de l'ingrédient"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                    />
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        value={newIngredientPrice}
                        onChange={(e) => setNewIngredientPrice(e.target.value)}
                        placeholder="Prix (€)"
                        disabled={isIngredientFree}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-200 text-gray-900"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isIngredientFree}
                          onChange={(e) => setIsIngredientFree(e.target.checked)}
                          className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <span className="ml-2 text-sm text-gray-700">Gratuit</span>
                      </label>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Ajouter l'ingrédient
                  </button>
                </div>

                {/* Ingredients List */}
                {ingredients.length > 0 && (
                  <div className="space-y-2">
                    {ingredients.map((ing, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{ing.name}</span>
                          {ing.isFree ? (
                            <span className="ml-2 text-sm text-green-600">(Gratuit)</span>
                          ) : (
                            <span className="ml-2 text-sm text-yellow-600">
                              (+{ing.price.toFixed(2)}€)
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Création...' : 'Créer le plat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Sélectionner des catégories</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Rechercher une catégorie..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Course Categories */}
              {courseCategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">TYPE DE PLAT</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {courseCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          selectedCategories.includes(category.name)
                            ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                            : 'border-gray-200 hover:border-yellow-300 text-gray-700 bg-white'
                        }`}
                      >
                        <span className="text-2xl mr-2">{category.emoji}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cuisine Categories */}
              {cuisineCategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">CUISINE DU MONDE</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cuisineCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          selectedCategories.includes(category.name)
                            ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                            : 'border-gray-200 hover:border-yellow-300 text-gray-700 bg-white'
                        }`}
                      >
                        <span className="text-2xl mr-2">{category.emoji}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dish Type Categories */}
              {dishTypeCategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">TYPE DE CUISINE</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {dishTypeCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.name)}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          selectedCategories.includes(category.name)
                            ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                            : 'border-gray-200 hover:border-yellow-300 text-gray-700 bg-white'
                        }`}
                      >
                        <span className="text-2xl mr-2">{category.emoji}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune catégorie trouvée
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-full px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
              >
                Confirmer ({selectedCategories.length} sélectionnée{selectedCategories.length > 1 ? 's' : ''})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChefDetailPage;
