"use client";

import { 
  MapPin, Phone, Clock, 
  Briefcase, Share2, CheckCircle2, TrendingUp, Heart
} from "lucide-react";
import toast from "react-hot-toast";

export default function PublicProfileClient({ business }: { business: any }) {

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${business.name} | FADIMA`,
          text: `Découvrez ${business.name} sur FADIMA !`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier !");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar FADIMA */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">FADIMA</span>
          </div>
          <button 
            onClick={handleShare}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Cover image (simulée avec un dégradé) */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-primary-600 to-primary-900 w-full relative">
            {/* Décoration */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          
          <div className="px-6 md:px-10 pb-8 relative">
            {/* Avatar - déborde sur le cover */}
            <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4 relative z-10">
              <div className="p-1.5 bg-white rounded-3xl">
                {business.logo_url ? (
                  <img 
                    src={business.logo_url} 
                    alt={business.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                    {getInitials(business.name)}
                  </div>
                )}
              </div>
              
              {business.phone && (
                <a 
                  href={`https://wa.me/${business.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mb-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Contacter</span>
                </a>
              )}
            </div>

            {/* Infos principales */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                {business.name}
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </h1>
              
              <div className="flex flex-wrap gap-3 mt-3">
                {business.activity && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    <Briefcase className="w-4 h-4" />
                    {business.activity}
                  </span>
                )}
                {business.city && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {business.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu détaillé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Colonne Principale : Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">À propos</h2>
              {business.description ? (
                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">
                  {business.description}
                </div>
              ) : (
                <p className="text-gray-400 italic">Aucune description fournie par ce professionnel.</p>
              )}
            </div>
          </div>

          {/* Colonne Secondaire : Horaires & Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informations pratiques</h2>
              
              <div className="space-y-4">
                {business.opening_hours && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Horaires</p>
                      <p className="text-sm text-gray-600">{business.opening_hours}</p>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Téléphone / WhatsApp</p>
                      <p className="text-sm text-gray-600">{business.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Promo FADIMA */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-6 border border-primary-100 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-primary-900 mb-1">Gérez aussi votre activité</h3>
              <p className="text-sm text-primary-700 mb-4">FADIMA vous aide à suivre vos ventes, vos dettes et vos stocks facilement.</p>
              <a href="/" className="block w-full py-2 bg-primary-600 text-white font-medium text-sm rounded-xl hover:bg-primary-700 transition-colors">
                Créer mon compte gratuit
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
