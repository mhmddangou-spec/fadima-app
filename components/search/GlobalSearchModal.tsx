"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2, ShoppingBag, Users, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { formatCFA } from "@/lib/utils/format";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function GlobalSearchModal({ isOpen, onClose, userId }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ type: string; data: any[] }>({ type: "", data: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults({ type: "", data: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ type: "", data: [] });
      return;
    }

    const search = async () => {
      setLoading(true);
      const supabase = createClient();
      
      // Recherche clients
      const { data: clients } = await supabase
        .from("customers")
        .select("id, name, phone")
        .eq("user_id", userId)
        .ilike("name", `%${query}%`)
        .limit(3);

      // Recherche produits
      const { data: products } = await supabase
        .from("products")
        .select("id, name, selling_price")
        .eq("user_id", userId)
        .ilike("name", `%${query}%`)
        .limit(3);

      // Recherche ventes
      const { data: sales } = await supabase
        .from("sales")
        .select("id, total_amount, sold_at")
        .eq("user_id", userId)
        .ilike("id", `%${query}%`)
        .limit(3);

      const allResults = [];
      if (clients && clients.length > 0) allResults.push({ type: "clients", data: clients });
      if (products && products.length > 0) allResults.push({ type: "produits", data: products });
      if (sales && sales.length > 0) allResults.push({ type: "ventes", data: sales });

      setResults({ type: "mixed", data: allResults });
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-elevated overflow-hidden mt-10 sm:mt-20 flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        {/* Input area */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <Search className="w-6 h-6 text-primary-600 mr-3" />
          <input
            type="text"
            className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400 bg-transparent"
            placeholder="Rechercher clients, produits, ventes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
          ) : results.data.length > 0 ? (
            <div className="space-y-4 p-2">
              {results.data.map((group: any) => (
                <div key={group.type}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    {group.type === "clients" && <Users className="w-3 h-3" />}
                    {group.type === "produits" && <Package className="w-3 h-3" />}
                    {group.type === "ventes" && <ShoppingBag className="w-3 h-3" />}
                    {group.type}
                  </h3>
                  <div className="space-y-1">
                    {group.data.map((item: any) => (
                      <Link
                        key={item.id}
                        href={
                          group.type === "clients" ? `/customers?search=${item.name}` :
                          group.type === "produits" ? `/products` :
                          `/sales`
                        }
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {group.type === "ventes" ? `Vente #${item.id.slice(0, 8)}` : item.name}
                          </p>
                          {(item.phone || group.type === "ventes") && (
                            <p className="text-sm text-gray-500">
                              {item.phone || new Date(item.sold_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {(item.selling_price || item.total_amount) && (
                          <span className="font-bold text-primary-600">
                            {formatCFA(item.selling_price || item.total_amount)}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center text-gray-500">
              Aucun résultat pour "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Commencez à taper pour chercher...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
