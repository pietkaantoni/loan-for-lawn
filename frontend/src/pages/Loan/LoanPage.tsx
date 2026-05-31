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
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
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
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się utworzyć pożyczki.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setShowModal(false);
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
            const isSelected = selected?.id === offer.id;

            return (
              <div
                key={offer.id}
                className={`${styles.offer} ${isSelected ? styles.offerActive : ""}`}
              >
                <div
                  className={styles.offerBody}
                  onClick={() => { setSelected(offer); setError(""); setSuccess(""); }}
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
                </div>
                {isSelected && (
                  <button
                    className={styles.confirmBtn}
                    onClick={() => setShowModal(true)}
                  >
                    Potwierdź
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selected && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Potwierdzenie pożyczki</h2>

            <div className={styles.modalDetails}>
              <div className={styles.modalRow}>
                <span>Kwota pożyczki</span>
                <strong>{selected.amount.toLocaleString("pl-PL")} PLN</strong>
              </div>
              <div className={styles.modalRow}>
                <span>Okres spłaty</span>
                <strong>{selected.months} mies.</strong>
              </div>
              <div className={styles.modalRow}>
                <span>Oprocentowanie</span>
                <strong>{selected.interestRate}%</strong>
              </div>
              <div className={styles.modalRow}>
                <span>Miesięczna rata</span>
                <strong>{pmt(selected.amount, selected.interestRate, selected.months).toFixed(2)} PLN</strong>
              </div>
              <div className={styles.modalRow}>
                <span>Całkowita spłata</span>
                <strong className={styles.totalCost}>{(pmt(selected.amount, selected.interestRate, selected.months) * selected.months).toFixed(2)} PLN</strong>
              </div>
            </div>

            <p className={styles.modalQuestion}>
              Czy jesteś pewien, że chcesz wziąć tę pożyczkę?
            </p>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeModal} disabled={loading}>
                Anuluj
              </button>
              <button className={styles.acceptBtn} onClick={handleConfirm} disabled={loading}>
                {loading ? "Przetwarzanie..." : "Tak, chcę wziąć pożyczkę"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
