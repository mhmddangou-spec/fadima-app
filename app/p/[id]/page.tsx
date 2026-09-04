// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name, description")
    .eq("id", params.id)
    .single();

  if (!business) {
    return { title: "Profil non trouvé | FADIMA" };
  }

  return {
    title: `${business.name} | FADIMA`,
    description: business.description || `Découvrez le profil de ${business.name} sur FADIMA.`,
  };
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Requête publique vers le business
  // On ne charge QUE les infos nécessaires. La sécurité RLS de Supabase empêche l'accès aux ventes/dettes.
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, name, activity, city, phone, description, opening_hours, logo_url, is_public")
    .eq("id", params.id)
    .single();

  if (error || !business) {
    return notFound();
  }

  if (!business.is_public) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profil Privé</h1>
          <p className="text-gray-500">
            Ce professionnel a choisi de garder son profil privé pour le moment.
          </p>
        </div>
      </div>
    );
  }

  return <PublicProfileClient business={business} />;
}
