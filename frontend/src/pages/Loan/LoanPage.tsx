import { useState } from "react";
import { createLoan } from "../../services/api";
import styles from "./LoanPage.module.scss";

export default function LoanPage() {
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5.0");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 30);
  const minDateStr = minDate.toISOString().split("T")[0];

  function calculateTotal() {
    const principal = parseFloat(amount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const totalMonths = 12;
    const monthlyRate = rate / 100 / totalMonths;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return (payment * totalMonths).toFixed(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await createLoan(
        parseFloat(amount),
        parseFloat(interestRate),
        dueDate
      );
      setSuccess(
        `Pożyczka w wysokości ${parseFloat(data.loan.amount).toFixed(2)} PLN została przyznana!`
      );
      setAmount("");
      setDueDate("");
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
          Wypełnij formularz, aby otrzymać pożyczkę dopasowaną do Twoich potrzeb
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="amount">Kwota pożyczki (PLN)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="100"
              max="100000"
              step="0.01"
              placeholder="5000"
            />
            <span className={styles.hint}>Min: 100 PLN, Max: 100 000 PLN</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="interestRate">Oprocentowanie roczne (%)</label>
            <input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              required
              min="0.1"
              max="100"
              step="0.1"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dueDate">Data spłaty</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              min={minDateStr}
            />
          </div>

          {amount && interestRate && dueDate && (
            <div className={styles.summary}>
              <p>
                Szacowana całkowita kwota do spłaty:{" "}
                <strong>{calculateTotal()} PLN</strong>
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Przetwarzanie..." : "Weź pożyczkę"}
          </button>
        </form>
      </div>
    </div>
  );
}
