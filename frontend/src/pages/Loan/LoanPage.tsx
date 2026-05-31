import { useState } from "react";
import { createLoan } from "../../services/api";
import styles from "./LoanPage.module.scss";

interface LoanOffer {
  id: number;
  amount: number;
  months: number;
  interestRate: number;
  label: string;
}

const OFFERS: LoanOffer[] = [
  { id: 1, amount: 1000, months: 6, interestRate: 4.5, label: "Na małe wydatki" },
  { id: 2, amount: 3000, months: 12, interestRate: 5.5, label: "Na drobne remonty" },
  { id: 3, amount: 5000, months: 12, interestRate: 6.5, label: "Na większy zakup" },
  { id: 4, amount: 5000, months: 6, interestRate: 8.0, label: "Szybka gotówka" },
  { id: 5, amount: 10000, months: 24, interestRate: 7.5, label: "Na większe inwestycje" },
  { id: 6, amount: 10000, months: 12, interestRate: 9.5, label: "Ekspresowa gotówka" },
  { id: 7, amount: 25000, months: 24, interestRate: 10.0, label: "Na wymarzony projekt" },
  { id: 8, amount: 25000, months: 12, interestRate: 12.5, label: "Premium na cel" },
];

function pmt(principal: number, rate: number, months: number): number {
  const r = rate / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

function calcDueDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

export default function LoanPage() {
  const [selected, setSelected] = useState<LoanOffer | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleApply() {
    if (!selected) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await createLoan(
        selected.amount,
        selected.interestRate,
        calcDueDate(selected.months)
      );
      setSuccess(
        `Pożyczka ${data.loan.amount} PLN została przyznana! Spłata do ${new Date(data.loan.due_date).toLocaleDateString("pl-PL")}.`
      );
      setSelected(null);
      setConfirmed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się utworzyć pożyczki.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loanPage}>
      <div className={styles.loanCard}>
        <h1>Weź pożyczkę</h1>
        <p className={styles.subtitle}>
          Wybierz jedną z gotowych ofert i otrzymaj pieniądze od ręki
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.offers}>
          {OFFERS.map((offer) => {
            const monthly = pmt(offer.amount, offer.interestRate, offer.months);
            const total = monthly * offer.months;
            const isActive = selected?.id === offer.id;

            return (
              <button
                key={offer.id}
                className={`${styles.offer} ${isActive ? styles.offerActive : ""}`}
                onClick={() => { setSelected(offer); setConfirmed(false); }}
              >
                <div className={styles.offerHeader}>
                  <span className={styles.offerAmount}>{offer.amount.toLocaleString("pl-PL")} PLN</span>
                  <span className={styles.offerTag}>{offer.label}</span>
                </div>
                <div className={styles.offerDetails}>
                  <span>Okres: <strong>{offer.months} mies.</strong></span>
                  <span>Oprocentowanie: <strong>{offer.interestRate}%</strong></span>
                  <span>Miesięczna rata: <strong>{monthly.toFixed(2)} PLN</strong></span>
                  <span>Całkowita spłata: <strong className={styles.totalCost}>{total.toFixed(2)} PLN</strong></span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && !confirmed && (
          <div className={styles.confirmBox}>
            <p>
              Wybrałeś ofertę: <strong>{selected.amount.toLocaleString("pl-PL")} PLN</strong> na{" "}
              <strong>{selected.months} mies.</strong> z oprocentowaniem{" "}
              <strong>{selected.interestRate}%</strong>.
            </p>
            <p className={styles.confirmHint}>
              Miesięczna rata: <strong>{pmt(selected.amount, selected.interestRate, selected.months).toFixed(2)} PLN</strong> |
              Łącznie: <strong>{(pmt(selected.amount, selected.interestRate, selected.months) * selected.months).toFixed(2)} PLN</strong>
            </p>
            <button className={styles.confirmBtn} onClick={() => setConfirmed(true)}>
              Potwierdź wybór
            </button>
          </div>
        )}

        {confirmed && (
          <button
            className={styles.btn}
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? "Przetwarzanie..." : "Weź pożyczkę"}
          </button>
        )}
      </div>
    </div>
  );
}
