import { useState, useEffect, useMemo } from 'react';
import ingredientService from '@/services/ingredientService';
import type { Ingredient } from '@/services/ingredientService';

interface IngredientSelectionModalProps {
  visible: boolean;
  platId: string;
  platName: string;
  platPrice: number;
  onClose: () => void;
  onConfirm: (selectedIngredientIds: string[], quantity: number) => void;
}

const IngredientSelectionModal = ({
  visible,
  platId,
  platName,
  platPrice,
  onClose,
  onConfirm,
}: IngredientSelectionModalProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && platId) {
      fetchIngredients();
    }
  }, [visible, platId]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientService.getIngredientsByPlatId(platId);
      setIngredients(data || []);

      // Auto-select free ingredients
      if (data && data.length > 0) {
        const freeIds = data.filter((ing) => ing.isFree).map((ing) => ing.id);
        setSelectedIngredientIds(freeIds);
      } else {
        setSelectedIngredientIds([]);
      }
    } catch {
      setIngredients([]);
      setSelectedIngredientIds([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const totalPrice = useMemo(() => {
    const ingredientsPrice = ingredients
      .filter((ing) => selectedIngredientIds.includes(ing.id) && !ing.isFree)
      .reduce((sum, ing) => sum + ing.price, 0);
    return (platPrice + ingredientsPrice) * quantity;
  }, [platPrice, ingredients, selectedIngredientIds, quantity]);

  const handleConfirm = () => {
    onConfirm(selectedIngredientIds, quantity);
    handleClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setSelectedIngredientIds([]);
    setIngredients([]);
    onClose();
  };

  const freeIngredients = ingredients.filter((ing) => ing.isFree);
  const paidIngredients = ingredients.filter((ing) => !ing.isFree);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {platName}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-3 border-[#ffdd00] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500">Chargement des ingr&eacute;dients...</p>
          </div>
        ) : (
          <>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {ingredients.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Aucun ingr&eacute;dient disponible pour ce plat</p>
                </div>
              ) : (
                <>
                  {/* Free ingredients */}
                  {freeIngredients.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                        Ingr&eacute;dients inclus (Gratuits)
                      </h3>
                      <div className="space-y-1">
                        {freeIngredients.map((ingredient) => (
                          <button
                            key={ingredient.id}
                            onClick={() => toggleIngredient(ingredient.id)}
                            className="flex items-center w-full px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 transition-colors ${
                                selectedIngredientIds.includes(ingredient.id)
                                  ? 'bg-[#ffdd00] border-[#ffdd00]'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {selectedIngredientIds.includes(ingredient.id) && (
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="flex-1 text-left text-sm text-gray-800">{ingredient.name}</span>
                            <span className="text-sm font-medium text-green-600">Gratuit</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paid ingredients */}
                  {paidIngredients.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                        Ingr&eacute;dients suppl&eacute;mentaires (Payants)
                      </h3>
                      <div className="space-y-1">
                        {paidIngredients.map((ingredient) => (
                          <button
                            key={ingredient.id}
                            onClick={() => toggleIngredient(ingredient.id)}
                            className="flex items-center w-full px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 transition-colors ${
                                selectedIngredientIds.includes(ingredient.id)
                                  ? 'bg-[#ffdd00] border-[#ffdd00]'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {selectedIngredientIds.includes(ingredient.id) && (
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="flex-1 text-left text-sm text-gray-800">{ingredient.name}</span>
                            <span className="text-sm font-semibold text-gray-900">+{ingredient.price.toFixed(2)} &euro;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer — Quantity + Total + Confirm */}
            <div className="border-t border-gray-100 px-6 py-4 space-y-4">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Quantit&eacute;</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{totalPrice.toFixed(2)} &euro;</span>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-bold rounded-xl transition-colors text-sm"
              >
                Ajouter au panier
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IngredientSelectionModal;
