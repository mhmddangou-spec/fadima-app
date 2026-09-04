import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // utilisation du client admin pour le webhook

// On utilise le service role pour bypasser la RLS car c'est un webhook serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("FedaPay Webhook:", payload);

    // FedaPay envoie des événements comme "transaction.approved", "transaction.canceled", etc.
    const eventName = payload.name;
    const transaction = payload.entity;

    if (!transaction || !transaction.id) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const transactionId = transaction.id.toString();

    // Trouver la vente correspondante
    const { data: sale } = await supabaseAdmin
      .from("sales")
      .select("id, total_amount, payment_status, customer_id, paid_amount")
      .eq("payment_transaction_id", transactionId)
      .single();

    if (!sale) {
      // Peut-être qu'il s'agit d'un paiement de dette ?
      // Implémentation future pour debt_payments
      return NextResponse.json({ message: "Vente non trouvée" });
    }

    if (eventName === "transaction.approved" || transaction.status === "approved") {
      const newPaidAmount = Number(sale.paid_amount || 0) + Number(transaction.amount);
      const newPaymentStatus = newPaidAmount >= Number(sale.total_amount) ? "paid" : "partial";

      // Mettre à jour la vente comme payée
      await supabaseAdmin
        .from("sales")
        .update({
          payment_status: newPaymentStatus,
          paid_amount: newPaidAmount
        })
        .eq("id", sale.id);

      // S'il y avait une dette associée à ce client pour cette vente, il faut aussi la mettre à jour.
      const { data: debt } = await supabaseAdmin
        .from("debts")
        .select("id, paid_amount, remaining_amount")
        .eq("sale_id", sale.id)
        .single();
        
      if (debt) {
        const debtPaid = Number(debt.paid_amount || 0) + Number(transaction.amount);
        const debtRemaining = Number(debt.remaining_amount || 0) - Number(transaction.amount);
        const debtStatus = debtRemaining <= 0 ? "paid" : (debtPaid > 0 ? "partial" : "unpaid");

        await supabaseAdmin
          .from("debts")
          .update({
            status: debtStatus,
            paid_amount: debtPaid,
            remaining_amount: Math.max(0, debtRemaining)
          })
          .eq("id", debt.id);
      }

    } else if (eventName === "transaction.canceled" || transaction.status === "canceled" || transaction.status === "declined") {
      // Le paiement a échoué
      await supabaseAdmin
        .from("sales")
        .update({
          payment_status: "unpaid"
        })
        .eq("id", sale.id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
