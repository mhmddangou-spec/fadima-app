// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, AlertTriangle, Search, X, Loader2, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCFA } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description?: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  unit: string;
  is_active: boolean;
  margin?: number;
  category?: { name: string; color: string };
}

interface Category {
  id: string;
  name: string;
}

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  userId: string;
}

export default function ProductsClient({ products, categories, userId }: ProductsClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    purchase_price: "",
    selling_price: "",
    stock_quantity: "",
    min_stock_alert: "5",
    unit: "piÃ¨ce",
    description: "",
  });

  const margin = form.purchase_price && form.selling_price
    ? parseFloat(form.selling_price) - parseFloat(form.purchase_price)
    : null;

  const lowStockCount = products.filter((p) => p.stock_quantity <= p.min_stock_alert).length;

  const filtered = products
    .filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchLowStock = !filterLowStock || p.stock_quantity <= p.min_stock_alert;
      return matchSearch && matchLowStock;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.selling_price) {
      toast.error("Nom et prix de vente sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("products").insert({
        user_id: userId,
        name: form.name,
        category_id: form.category_id || undefined,
        purchase_price: parseFloat(form.purchase_price) || 0,
        selling_price: parseFloat(form.selling_price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        min_stock_alert: parseInt(form.min_stock_alert) || 5,
        unit: form.unit,
        description: form.description || undefined,
        is_active: true,
      });
      toast.success("Produit ajoutÃ© âœ“");
      setShowForm(false);
      setForm({ name: "", category_id: "", purchase_price: "", selling_price: "", stock_quantity: "", min_stock_alert: "5", unit: "piÃ¨ce", description: "" });
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits & Stock</h1>
          <p className="text-gray-500 text-sm">{products.length} produit{products.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nouveau produit
        </button>
      </div>

      {/* Alerte stock */}
      {lowStockCount > 0 && (
        <div
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 cursor-pointer"
          onClick={() => setFilterLowStock(!filterLowStock)}
        >
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">
              âš ï¸ {lowStockCount} produit{lowStockCount > 1 ? "s" : ""} presque Ã©puisÃ©{lowStockCount > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-amber-600">Cliquez pour filtrer</p>
          </div>
        </div>
      )}

      {/* Filtres + Recherche */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" className="input pl-9 bg-white" placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={cn("btn-outline px-4", filterLowStock && "bg-amber-50 border-amber-400 text-amber-700")}
        >
          <AlertTriangle className="w-4 h-4" />
          Stock bas
        </button>
      </div>

      {/* Grille produits */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">ðŸ“¦</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun produit</h3>
          <p className="text-gray-500 text-sm mb-6">Ajoutez vos produits pour gÃ©rer votre stock.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />Ajouter un produit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => {
            const isLowStock = product.stock_quantity <= product.min_stock_alert;
            const margin = product.selling_price - product.purchase_price;
            const marginPct = product.purchase_price > 0
              ? Math.round((margin / product.purchase_price) * 100)
              : null;

            return (
              <div
                key={product.id}
                className={cn(
                  "bg-white rounded-xl border p-4 hover:shadow-card-hover transition-all",
                  isLowStock ? "border-amber-200 bg-amber-50/30" : "border-gray-100"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 truncate">{product.name}</p>
                      {isLowStock && (
                        <span className="badge badge-warning text-xs">
                          âš ï¸ Stock bas
                        </span>
                      )}
                    </div>
                    {product.category && (
                      <span className="text-xs text-gray-500">{product.category.name}</span>
                    )}
                  </div>
                </div>

                {/* Prix */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prix vente</span>
                    <span className="font-bold text-primary-700">{formatCFA(product.selling_price)}</span>
                  </div>
                  {product.purchase_price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Prix achat</span>
                      <span className="text-gray-700">{formatCFA(product.purchase_price)}</span>
                    </div>
                  )}
                  {margin > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Marge</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {formatCFA(margin)} {marginPct !== null && `(${marginPct}%)`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl",
                  isLowStock ? "bg-amber-100" : "bg-gray-50"
                )}>
                  <div className="flex items-center gap-1.5">
                    <Package className={cn("w-4 h-4", isLowStock ? "text-amber-600" : "text-gray-400")} />
                    <span className={cn("text-sm font-medium", isLowStock ? "text-amber-700" : "text-gray-600")}>
                      Stock
                    </span>
                  </div>
                  <span className={cn("text-sm font-bold", isLowStock ? "text-amber-700" : "text-gray-900")}>
                    {product.stock_quantity} {product.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal â€” Nouveau produit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Nouveau produit</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="input-label">Nom du produit *</label>
                <input type="text" className="input" placeholder="Ex: Chaussures mocassins" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="input-label">CatÃ©gorie</label>
                  <select className="select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">Sans catÃ©gorie</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Prix achat (FCFA)</label>
                  <input type="number" className="input" placeholder="0" min={0} value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Prix vente (FCFA) *</label>
                  <input type="number" className="input" placeholder="0" min={0} value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} required />
                </div>
              </div>

              {margin !== null && margin > 0 && (
                <div className="bg-green-50 rounded-xl p-3 text-sm text-green-700">
                  <span className="font-semibold">Marge estimÃ©e: {formatCFA(margin)}</span>
                  {form.purchase_price && <span className="text-green-600 ml-2">({Math.round((margin / parseFloat(form.purchase_price)) * 100)}%)</span>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Stock actuel</label>
                  <input type="number" className="input" placeholder="0" min={0} value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Alerte stock min</label>
                  <input type="number" className="input" placeholder="5" min={0} value={form.min_stock_alert} onChange={(e) => setForm({ ...form, min_stock_alert: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="input-label">UnitÃ©</label>
                <select className="select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  {["piÃ¨ce", "kg", "litre", "mÃ¨tre", "paquet", "boÃ®te", "sac", "carton"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Description (facultatif)</label>
                <input type="text" className="input" placeholder="Ex: Disponible en rouge et noir" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><Package className="w-5 h-5" />Ajouter le produit</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

