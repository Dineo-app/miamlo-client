import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/types';
import profileService from '@/services/profileService';
import { storeUserData } from '@/services/passwordlessAuthService';
import { RESTORE_AUTH } from '@/store/types/actionTypes';

const CustomerSettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'Le pr\u00e9nom est requis';
    if (!lastName.trim()) errs.lastName = 'Le nom est requis';
    if (!email.trim()) errs.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email invalide';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await profileService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        address: address.trim() || undefined,
      });

      // Update local storage and Redux
      const updatedUser = {
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        address: address.trim(),
      };
      storeUserData(updatedUser);
      dispatch({ type: RESTORE_AUTH, payload: { user: updatedUser, isAuthenticated: true } });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise \u00e0 jour du profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Param&egrave;tres du compte
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
        {/* Success */}
        {success && (
          <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            Profil mis &agrave; jour avec succ&egrave;s !
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* First name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pr&eacute;nom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none transition-colors`}
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>

        {/* Last name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none transition-colors`}
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none transition-colors`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">T&eacute;l&eacute;phone</label>
          <input
            type="text"
            value={user?.phone || ''}
            readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Le num&eacute;ro de t&eacute;l&eacute;phone ne peut pas &ecirc;tre modifi&eacute;</p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Votre adresse de livraison"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#ffdd00] focus:ring-1 focus:ring-[#ffdd00] outline-none transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-[#ffdd00] hover:bg-[#ffd000] text-black font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
};

export default CustomerSettingsPage;
