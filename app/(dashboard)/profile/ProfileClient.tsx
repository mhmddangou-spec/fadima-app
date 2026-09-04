// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { 
  Building2, MapPin, Phone, Clock, 
  Briefcase, Check, Loader2, Globe, Lock, ExternalLink
} from "lucide-react";
import Link from "next/link";

const BUSINESS_ACTIVITIES = [
  "Restauration / Alimentation",
  "Coiffure / Beauté",
  "Couture / Mode",
  "Boutique générale",
  "Téléphonie / Informatique",
  "Freelance / Services",
  "Agriculture / Maraîchage",
  "Artisanat",
  "Autre",
];

const CITIES_BENIN = [
  "Cotonou",
  "Porto-Novo",
  "Parakou",
  "Abomey-Calavi",
  "Bohicon",
  "Natitingou",
  "Ouidah",
  "Lokossa",
  "Kandi",
  "Djougou",
  "Autre",
];

export default function ProfileClient({ user, business }: { user: any; business: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
    name: business?.name || "",
    activity: business?.activity || "",
    city: business?.city || "",
    phone: business?.phone || "",
    description: business?.description || "",
    opening_hours: business?.opening_hours || "",
    is_public: business?.is_public || false,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Update User Metadata (Avatar & Name)
      await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
        },
      });

      // Update Business Data
      if (business?.id) {
        await supabase.from("businesses").update({
          name: formData.name,
          activity: formData.activity,
          city: formData.city,
          phone: formData.phone,
          description: formData.description,
          opening_hours: formData.opening_hours,
          is_public: formData.is_public,
        }).eq("id", business.id);
      }

      toast.success("Profil mis à jour avec succès ✓");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil Pro</h1>
          <p className="text-gray-500 text-sm">Gérez les informations de votre entreprise</p>
        </div>
        
        {business?.id && (
          <Link 
            href={`/p/${business.id}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Voir mon profil public
          </Link>
        )}
      </div>

      {/* Profil Public Toggle Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        formData.is_public 
          ? "bg-green-50/50 border-green-200" 
          : "bg-gray-50 border-gray-200"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl flex-shrink-0 ${
            formData.is_public ? "bg-green-100 text-primary-600" : "bg-gray-200 text-gray-500"
          }`}>
            {formData.is_public ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Profil Public {formData.is_public ? "Activé" : "Désactivé"}
              </h3>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.is_public ? 'bg-primary-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={formData.is_public}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.is_public ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.is_public 
                ? "Votre profil est visible par tout le monde. Vos données financières restent strictement privées."
                : "Votre profil est privé. Seul vous pouvez y accéder."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Photo & Identité */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            Identité
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
              {formData.avatar_url ? (
                <img 
                  src={formData.avatar_url} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 gradient-primary rounded-2xl shadow-sm flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {getInitials(formData.full_name || formData.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Prénom & Nom (Gérant)</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Ex: Fadima Sow"
                    value={formData.full_name} 
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="input-label">Nom de l'entreprise</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Ex: FADIMA Shop"
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
              </div>
              
              <div>
                <label className="input-label">URL du logo / photo</label>
                <input 
                  type="url" 
                  className="input" 
                  placeholder="https://..."
                  value={formData.avatar_url} 
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coordonnées & Activité */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Détails de l'activité
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="input-label flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-gray-400" /> Catégorie
              </label>
              <select
                className="input bg-white"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              >
                <option value="" disabled>Choisir une catégorie</option>
                {BUSINESS_ACTIVITIES.map((act) => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="input-label flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> Ville
              </label>
              <select
                className="input bg-white"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="" disabled>Choisir une ville</option>
                {CITIES_BENIN.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-400" /> Téléphone / WhatsApp
              </label>
              <input 
                type="tel" 
                className="input bg-white" 
                placeholder="+229 XX XX XX XX"
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
              />
            </div>

            <div>
              <label className="input-label flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" /> Horaires
              </label>
              <input 
                type="text" 
                className="input bg-white" 
                placeholder="Ex: Lun-Sam 08h-19h"
                value={formData.opening_hours} 
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })} 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="input-label">Description de l'activité</label>
              <textarea 
                className="input bg-white min-h-[100px] resize-y" 
                placeholder="Décrivez ce que fait votre entreprise, vos spécialités, vos produits phares..."
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="p-6 bg-white flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="btn-primary w-full sm:w-auto min-w-[200px] justify-center text-base py-3"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Sauvegarde...</>
            ) : (
              <><Check className="w-5 h-5" /> Enregistrer le profil</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
