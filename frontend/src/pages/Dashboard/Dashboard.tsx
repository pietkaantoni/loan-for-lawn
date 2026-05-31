import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { getMe, getLoans, repayLoan } from "../../services/api";
import type { User, Loan } from "../../types";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [repayingId, setRepayingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [meData, loansData] = await Promise.all([getMe(), getLoans()]);
        setUser(meData.user);
        setLoans(loansData.loans);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  async function handleRepay(id: string) {
    setRepayingId(id);
    try {
      await repayLoan(id);
      setLoans((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "paid" } : l))
      );
    } catch {
      // ignore
    } finally {
      setRepayingId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pl-PL");
  }

  function formatAmount(amount: string) {
    return `${parseFloat(amount).toFixed(2)} PLN`;
  }

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <p className={styles.loading}>Ładowanie...</p>
      </div>
    );
  }

  const activeLoans = loans.filter((l) => l.status === "active");
  const paidLoans = loans.filter((l) => l.status === "paid");

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Witaj, {user?.username}!</h1>
        <Link to="/loan" className={styles.newLoanBtn}>
          Nowa pożyczka
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{loans.length}</span>
          <span className={styles.statLabel}>Wszystkie pożyczki</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{activeLoans.length}</span>
          <span className={styles.statLabel}>Aktywne</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{paidLoans.length}</span>
          <span className={styles.statLabel}>Spłacone</span>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className={styles.empty}>
          <p>Nie masz jeszcze żadnych pożyczek.</p>
          <Link to="/loan" className={styles.firstLoanBtn}>
            Weź pierwszą pożyczkę
          </Link>
        </div>
      ) : (
        <div className={styles.loansList}>
          <h2>Twoje pożyczki</h2>
          {loans.map((loan) => (
            <div key={loan.id} className={styles.loanCard}>
              <div className={styles.loanInfo}>
                <span className={styles.loanAmount}>
                  {formatAmount(loan.amount)}
                </span>
                <span className={styles.loanRate}>
                  Oprocentowanie: {loan.interest_rate}%
                </span>
                <span className={styles.loanDate}>
                  Data ważności: {formatDate(loan.due_date)}
                </span>
              </div>
              <div className={styles.loanActions}>
                <span
                  className={`${styles.status} ${
                    loan.status === "active" ? styles.active : styles.paid
                  }`}
                >
                  {loan.status === "active" ? "Aktywna" : "Spłacona"}
                </span>
                {loan.status === "active" && (
                  <button
                    className={styles.repayBtn}
                    onClick={() => handleRepay(loan.id)}
                    disabled={repayingId === loan.id}
                  >
                    {repayingId === loan.id ? "..." : "Spłać"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
