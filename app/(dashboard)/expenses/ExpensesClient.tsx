// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, CreditCard, Search, Loader2, ArrowLeft, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCFA, formatRelative } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import toast from "react-hot-toast";

const DEFAULT_CATEGORIES = [
  { name: "Transport", emoji: "ðŸš—" },
  { name: "Achat marchandises", emoji: "ðŸ“¦" },
  { name: "Loyer", emoji: "ðŸ " },
  { name: "Communication", emoji: "ðŸ“±" },
  { name: "Salaire", emoji: "ðŸ‘¤" },
  { name: "Nourriture", emoji: "ðŸ”" },
  { name: "Ã‰lectricitÃ©", emoji: "ðŸ’¡" },
  { name: "Internet", emoji: "ðŸŒ" },
  { name: "Autre", emoji: "ðŸ“‹" },
];

interface Expense {
  id: string;
  amount: number;
  category_name?: string;
  description?: string;
  payment_method: string;
  spent_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface ExpensesClientProps {
  expenses: Expense[];
  categories: Category[];
  userId: string;
}

export default function ExpensesClient({ expenses, categories, userId }: ExpensesClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    category_name: "",
    amount: "",
    description: "",
    payment_method: "cash",
    spent_at: new Date().toISOString().slice(0, 16),
  });

  const totalToday = expenses
    .filter((e) => e.spent_at.startsWith(new Date().toISOString().split("T")[0]))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalMonth = expenses
    .filter((e) => {
      const d = new Date(e.spent_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const filtered = expenses.filter((e) =>
    !search ||
    e.category_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_name || !form.amount) {
      toast.error("Veuillez remplir la catÃ©gorie et le montant.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("expenses").insert({
        user_id: userId,
        category_name: form.category_name,
        amount: parseFloat(form.amount),
        description: form.description || undefined,
        payment_method: form.payment_method,
        spent_at: new Date(form.spent_at).toISOString(),
      });
      if (error) throw error;

      toast.success("DÃ©pense enregistrÃ©e âœ“");
      setShowForm(false);
      setForm({ category_name: "", amount: "", description: "", payment_method: "cash", spent_at: new Date().toISOString().slice(0, 16) });
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DÃ©penses</h1>
          <p className="text-gray-500 text-sm">{expenses.length} dÃ©pense{expenses.length > 1 ? "s" : ""} enregistrÃ©e{expenses.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nouvelle dÃ©pense
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs font-medium text-red-600">Aujourd'hui</p>
          <p className="text-xl font-bold text-red-700 mt-1">{formatCFA(totalToday)}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-xs font-medium text-orange-600">Ce mois</p>
          <p className="text-xl font-bold text-orange-700 mt-1">{formatCFA(totalMonth)}</p>
        </div>
      </div>

      {/* Formulaire rapide */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouvelle dÃ©pense</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* CatÃ©gorie rapide */}
              <div>
                <label className="input-label">CatÃ©gorie</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {DEFAULT_CATEGORIES.slice(0, 6).map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setForm({ ...form, category_name: cat.name })}
                      className={cn(
                        "py-2 px-2 rounded-xl text-xs font-medium border-2 transition-colors text-center",
                        form.category_name === cat.name
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
                <select
                  className="select"
                  value={form.category_name}
                  onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                  required
                >
                  <option value="">Choisir une catÃ©gorie...</option>
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Montant */}
              <div>
                <label className="input-label">Montant (FCFA)</label>
                <input
                  type="number"
                  className="input text-2xl font-bold"
                  placeholder="0"
                  min={0}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="input-label">Description (facultatif)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ex: Transport marchÃ© Dantokpa"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Mode paiement + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label text-xs">Mode</label>
                  <select className="select" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                    <option value="cash">ðŸ’µ EspÃ¨ces</option>
                    <option value="mobile_money">ðŸ“± Mobile Money</option>
                    <option value="other">ðŸ”„ Autre</option>
                  </select>
                </div>
                <div>
                  <label className="input-label text-xs">Date</label>
                  <input type="date" className="input" value={form.spent_at.slice(0, 10)} onChange={(e) => setForm({ ...form, spent_at: e.target.value })} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><CreditCard className="w-5 h-5" /> Enregistrer</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          className="input pl-9 bg-white"
          placeholder="Rechercher une dÃ©pense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">ðŸ’¸</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune dÃ©pense</h3>
          <p className="text-gray-500 text-sm mb-6">Enregistrez vos premiÃ¨res dÃ©penses pour suivre vos coÃ»ts.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />Enregistrer une dÃ©pense
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((expense) => (
            <div key={expense.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">
                      {DEFAULT_CATEGORIES.find((c) => c.name === expense.category_name)?.emoji || "ðŸ’¸"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{expense.category_name}</p>
                    {expense.description && (
                      <p className="text-xs text-gray-500 truncate">{expense.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(expense.spent_at)}</p>
                  </div>
                </div>
                <span className="text-base font-bold text-red-600 flex-shrink-0">-{formatCFA(expense.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

