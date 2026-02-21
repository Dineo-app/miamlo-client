import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dineo-project-dineo-backend.gbrbu6.easypanel.host/api/v1';

// Country list with flags and codes
const COUNTRIES = [
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
].sort((a, b) => a.name.localeCompare(b.name));

const BecomeChefPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    description: '',
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, resume: 'Le CV doit être un fichier PDF' }));
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'Le fichier ne doit pas dépasser 10 MB' }));
        return;
      }
      setResumeFile(file);
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email doit être valide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
    if (!formData.country) newErrors.country = 'Le pays est requis';
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'La description ne peut pas dépasser 2000 caractères';
    }
    if (!resumeFile) newErrors.resume = 'Le CV est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData
      const submitData = new FormData();
      submitData.append('candidatureData', JSON.stringify({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        description: formData.description.trim(),
      }));
      
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }
      
      // Submit to backend (public endpoint, no auth needed - use raw axios)
      await axios.post(`${API_BASE_URL}/candidatures`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Show green success toast
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/');
      }, 3000);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        country: '',
        description: '',
      });
      setResumeFile(null);
      
    } catch (error: any) {
      console.error('Error submitting candidature:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la soumission';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedCountry = COUNTRIES.find(c => c.name === formData.country);
  
  return (
    <div className="min-h-screen" style={{ background: '#f9f6ef' }}>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-[0_10px_25px_rgba(34,197,94,0.4)] flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">✓</div>
            <div>
              <p className="font-semibold text-sm">Candidature envoyée !</p>
              <p className="text-xs opacity-90">Nous vous contacterons sous 48h.</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="mx-auto max-w-5xl px-6 py-12 pb-16">
        {/* HERO SECTION */}
        <section className="bg-[#ffd60a] rounded-[32px] p-10 shadow-[0_18px_40px_rgba(0,0,0,0.18)] mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span>🧑‍🍳 Devenir Chef Partenaire</span>
            </div>
            <h1 className="text-[2.3rem] font-bold leading-tight mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Partagez votre passion culinaire
            </h1>
            <p className="text-base mb-4 max-w-[32rem]">
              Rejoignez notre communauté de chefs passionnés et partagez vos créations avec des gourmets de votre région. 
              Cuisinez à votre rythme, depuis chez vous.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="rounded-full px-3 py-1.5 bg-black/10">✨ Revenus complémentaires</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">📅 Horaires flexibles</div>
              <div className="rounded-full px-3 py-1.5 bg-black/10">🏡 Travaillez de chez vous</div>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <h2 className="text-[1.5rem] font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Formulaire de candidature
          </h2>
          <p className="text-[0.95rem] opacity-85 mb-6">
            Remplissez ce formulaire et nous reviendrons vers vous sous 48h.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder="Votre prénom"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Date of Birth & Country */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.dateOfBirth ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a]`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Pays <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {selectedCountry && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                      {selectedCountry.flag}
                    </div>
                  )}
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full ${selectedCountry ? 'pl-12' : 'pl-4'} pr-4 py-2.5 rounded-xl border ${errors.country ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a] appearance-none`}
                  >
                    <option value="">Sélectionnez votre pays</option>
                    {COUNTRIES.map(country => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Parlez-nous de vous <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={2000}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-500' : 'border-black/10'} bg-[#fffdf5] text-gray-900 focus:outline-none focus:border-[#ffd60a] resize-none`}
                placeholder="Décrivez votre expérience culinaire, vos spécialités, votre motivation... (minimum 50 caractères)"
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                ) : (
                  <p className="text-xs opacity-60">
                    {formData.description.length < 50 
                      ? `Minimum 50 caractères (${formData.description.length}/50)` 
                      : `${formData.description.length}/2000 caractères`}
                  </p>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                CV (PDF) <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 ${errors.resume ? 'border-red-500' : 'border-dashed border-black/20'} rounded-xl p-6 bg-[#fffdf5] text-center`}>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resumeFile ? (
                    <div>
                      <div className="text-4xl mb-2">📄</div>
                      <p className="font-semibold text-sm">{resumeFile.name}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-[#ffd60a] mt-2">Cliquez pour changer</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📎</div>
                      <p className="font-semibold text-sm">Téléchargez votre CV</p>
                      <p className="text-xs opacity-60 mt-1">Format PDF, max 10 MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 text-base font-semibold rounded-full bg-[#ffd60a] hover:bg-[#ffcc00] transition-all shadow-[0_10px_25px_rgba(255,214,10,0.3)] hover:shadow-[0_16px_32px_rgba(255,214,10,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
              </button>
            </div>
          </form>
        </section>

        {/* INFO SECTION */}
        <section className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">💰</div>
            <h3 className="font-semibold text-base mb-1">Revenus attractifs</h3>
            <p className="opacity-85">Fixez vos prix et gagnez jusqu'à 70% du prix de vente</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🎯</div>
            <h3 className="font-semibold text-base mb-1">Liberté totale</h3>
            <p className="opacity-85">Choisissez vos plats, horaires et quantités</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] text-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffd60a] flex items-center justify-center text-2xl mb-2.5">🤝</div>
            <h3 className="font-semibold text-base mb-1">Support dédié</h3>
            <p className="opacity-85">Une équipe à votre écoute pour vous accompagner</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BecomeChefPage;

