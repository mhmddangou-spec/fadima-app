// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Users, AlertCircle, CheckCircle, Clock,
  X, Loader2, Search, Banknote,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCFA, formatDateShort, formatPaymentStatus, getStatusColor } from "@/lib/utils/format";
import { cn } from "@/lib/utils/format";
import toast from "react-hot-toast";

interface Debt {
  id: string;
  customer_name: string;
  initial_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  customers?: { id: string; name: string; phone?: string } | null;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

interface DebtsClientProps {
  debts: Debt[];
  customers: Customer[];
  userId: string;
}

export default function DebtsClient({ debts, customers, userId }: DebtsClientProps) {
  const router = useRouter();
  const [showNewDebt, setShowNewDebt] = useState(false);
  const [showPayment, setShowPayment] = useState<string | null>(null); // debt id
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unpaid" | "partial" | "paid">("all");

  const [newDebtForm, setNewDebtForm] = useState({
    customer_name: "",
    customer_id: "",
    initial_amount: "",
    due_date: "",
    notes: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_method: "cash",
  });

  const totalUnpaid = debts
    .filter((d) => d.status !== "paid")
    .reduce((sum, d) => sum + d.remaining_amount, 0);

  const filtered = debts.filter((d) => {
    const matchSearch = !search || d.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const handleNewDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtForm.customer_name || !newDebtForm.initial_amount) {
      toast.error("Nom du client et montant sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const amount = parseFloat(newDebtForm.initial_amount);
      await supabase.from("debts").insert({
        user_id: userId,
        customer_id: newDebtForm.customer_id || undefined,
        customer_name: newDebtForm.customer_name,
        initial_amount: amount,
        paid_amount: 0,
        remaining_amount: amount,
        due_date: newDebtForm.due_date || undefined,
        notes: newDebtForm.notes || undefined,
        status: "unpaid",
      });
      toast.success("Dette enregistrée ✓");
      setShowNewDebt(false);
      setNewDebtForm({ customer_name: "", customer_id: "", initial_amount: "", due_date: "", notes: "" });
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayment || !paymentForm.amount) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const amount = parseFloat(paymentForm.amount);
      const debt = debts.find((d) => d.id === showPayment);
      if (!debt) return;

      await supabase.from("debt_payments").insert({
        debt_id: showPayment,
        user_id: userId,
        amount,
        payment_method: paymentForm.payment_method,
        paid_at: new Date().toISOString(),
      });

      // Mise à jour manuelle (en cas oÃ¹ le trigger ne s'exécute pas côté client)
      const newRemaining = Math.max(0, debt.remaining_amount - amount);
      const newPaid = debt.paid_amount + amount;
      const newStatus = newRemaining <= 0 ? "paid" : newPaid > 0 ? "partial" : "unpaid";

      await supabase.from("debts").update({
        paid_amount: newPaid,
        remaining_amount: newRemaining,
        status: newStatus,
      }).eq("id", showPayment);

      toast.success("Remboursement enregistré ✓");
      setShowPayment(null);
      setPaymentForm({ amount: "", payment_method: "cash" });
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
          <h1 className="text-2xl font-bold text-gray-900">Dettes clients</h1>
          <p className="text-gray-500 text-sm">
            {debts.filter((d) => d.status !== "paid").length} dette(s) active(s)
          </p>
        </div>
        <button onClick={() => setShowNewDebt(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Nouvelle dette
        </button>
      </div>

      {/* Total dû */}
      {totalUnpaid > 0 && (
        <div className="bg-red-600 rounded-2xl p-5 text-white">
          <p className="text-red-100 text-sm font-medium">Total dû par les clients</p>
          <p className="text-3xl font-bold mt-1">{formatCFA(totalUnpaid)}</p>
          <p className="text-red-200 text-xs mt-1">
            {debts.filter((d) => d.status !== "paid").length} client(s) avec des dettes actives
          </p>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "unpaid", "partial", "paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                filterStatus === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f === "all" ? "Toutes" : f === "unpaid" ? "À payer" : f === "partial" ? "Partielles" : "Payées"}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des dettes */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune dette</h3>
          <p className="text-gray-500 text-sm mb-6">Aucune dette à afficher pour le moment.</p>
          <button onClick={() => setShowNewDebt(true)} className="btn-primary inline-flex">
            <Plus className="w-5 h-5" />Nouvelle dette
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((debt) => (
            <div key={debt.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    debt.status === "paid" ? "bg-green-50" : debt.status === "partial" ? "bg-amber-50" : "bg-red-50"
                  )}>
                    {debt.status === "paid" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : debt.status === "partial" ? (
                      <Clock className="w-5 h-5 text-amber-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{debt.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateShort(debt.created_at)}
                      {debt.due_date && ` Â· Échéance: ${formatDateShort(debt.due_date)}`}
                    </p>
                  </div>
                </div>
                <span className={cn("badge", getStatusColor(debt.status))}>
                  {formatPaymentStatus(debt.status)}
                </span>
              </div>

              {/* Montants */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Initial</p>
                  <p className="text-sm font-bold text-gray-900">{formatCFA(debt.initial_amount)}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">Payé</p>
                  <p className="text-sm font-bold text-green-700">{formatCFA(debt.paid_amount)}</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600">Reste</p>
                  <p className="text-sm font-bold text-red-700">{formatCFA(debt.remaining_amount)}</p>
                </div>
              </div>

              {/* Barre de progression */}
              {debt.initial_amount > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (debt.paid_amount / debt.initial_amount) * 100)}%` }}
                  />
                </div>
              )}

              {/* Action */}
              {debt.status !== "paid" && (
                <button
                  onClick={() => setShowPayment(debt.id)}
                  className="btn-outline w-full justify-center text-sm py-2"
                >
                  <Banknote className="w-4 h-4" />
                  Enregistrer un remboursement
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal — Nouvelle dette */}
      {showNewDebt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowNewDebt(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Nouvelle dette</h2>
              <button onClick={() => setShowNewDebt(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleNewDebt} className="p-5 space-y-4">
              <div>
                <label className="input-label">Client</label>
                {customers.length > 0 ? (
                  <select className="select" value={newDebtForm.customer_id} onChange={(e) => {
                    const c = customers.find((c) => c.id === e.target.value);
                    setNewDebtForm({ ...newDebtForm, customer_id: e.target.value, customer_name: c?.name || "" });
                  }}>
                    <option value="">Choisir un client...</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : null}
                <input type="text" className="input mt-2" placeholder="Nom du client" value={newDebtForm.customer_name}
                  onChange={(e) => setNewDebtForm({ ...newDebtForm, customer_name: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Montant dû (FCFA)</label>
                <input type="number" className="input text-xl font-bold" placeholder="0" min={0} value={newDebtForm.initial_amount}
                  onChange={(e) => setNewDebtForm({ ...newDebtForm, initial_amount: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Date d'échéance (facultatif)</label>
                <input type="date" className="input" value={newDebtForm.due_date} onChange={(e) => setNewDebtForm({ ...newDebtForm, due_date: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Notes (facultatif)</label>
                <input type="text" className="input" placeholder="Ex: Pour achat robe wax..." value={newDebtForm.notes}
                  onChange={(e) => setNewDebtForm({ ...newDebtForm, notes: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><Users className="w-5 h-5" />Enregistrer la dette</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal — Remboursement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowPayment(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Remboursement</h2>
              <button onClick={() => setShowPayment(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handlePayment} className="p-5 space-y-4">
              {(() => {
                const debt = debts.find((d) => d.id === showPayment);
                return debt ? (
                  <div className="bg-red-50 rounded-xl p-3 text-sm">
                    <p className="text-red-800 font-medium">{debt.customer_name}</p>
                    <p className="text-red-600">Reste à payer: {formatCFA(debt.remaining_amount)}</p>
                  </div>
                ) : null;
              })()}
              <div>
                <label className="input-label">Montant reçu (FCFA)</label>
                <input type="number" className="input text-xl font-bold" placeholder="0" min={0}
                  value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Mode de paiement</label>
                <select className="select" value={paymentForm.payment_method} onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}>
                  <option value="cash">💵 Espèces</option>
                  <option value="mobile_money">📱 Mobile Money</option>
                  <option value="other">🔄 Autre</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Enregistrement...</> : <><CheckCircle className="w-5 h-5" />Confirmer le remboursement</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

