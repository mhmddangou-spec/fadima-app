// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Search, Phone, X, Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCFA, formatDateShort } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import toast from "react-hot-toast";

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  total_purchases: number;
  total_debt: number;
  last_transaction_at?: string;
  created_at: string;
}

interface CustomersClientProps {
  customers: Customer[];
  userId: string;
}

export default function CustomersClient({ customers, userId }: CustomersClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "" });

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Le nom est obligatoire."); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("customers").insert({
        user_id: userId,
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        city: form.city || undefined,
      });
      toast.success("Client ajoutÃ© âœ“");
      setShowForm(false);
      setForm({ name: "", phone: "", email: "", city: "" });
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm">{customers.length} client{customers.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />Nouveau client
        </button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" className="input pl-9 bg-white" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">ðŸ‘¥</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun client</h3>
          <p className="text-gray-500 text-sm mb-6">Ajoutez vos clients pour suivre leurs achats et leurs dettes.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />Ajouter un client
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold text-sm">
                      {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{customer.name}</p>
                    <div className="flex items-center gap-3 flex-wrap mt-0.5">
                      {customer.phone && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />{customer.phone}
                        </span>
                      )}
                      {customer.city && <span className="text-xs text-gray-400">ðŸ“ {customer.city}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {customer.total_debt > 0 && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-semibold mb-1">
                      <AlertCircle className="w-4 h-4" />
                      {formatCFA(customer.total_debt)}
                    </div>
                  )}
                  {customer.total_purchases > 0 && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <ShoppingBag className="w-3 h-3" />
                      {formatCFA(customer.total_purchases)}
                    </div>
                  )}
                </div>
              </div>

              {customer.last_transaction_at && (
                <p className="text-xs text-gray-400 mt-2 pl-14">
                  DerniÃ¨re transaction: {formatDateShort(customer.last_transaction_at)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal â€” Nouveau client */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouveau client</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="input-label">Nom *</label>
                <input type="text" className="input" placeholder="Ex: Amina Diallo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">TÃ©lÃ©phone</label>
                <input type="tel" className="input" placeholder="+229 97 00 00 00" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" className="input" placeholder="email@..." value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Ville</label>
                  <input type="text" className="input" placeholder="Cotonou" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><Users className="w-5 h-5" />Ajouter le client</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

