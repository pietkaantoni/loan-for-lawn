import { useEffect, useState } from "react";
import { getAvailableCurrencies, getRates } from "../../services/api";
import type { RateCurrency, Rate } from "../../types";
import styles from "./Rates.module.scss";

export default function Rates() {
  const [popular, setPopular] = useState<RateCurrency[]>([]);
  const [others, setOthers] = useState<RateCurrency[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const data = await getAvailableCurrencies();
        setPopular(data.popular);
        setOthers(data.others);
        const defaultCodes = data.popular.slice(0, 5).map((c: RateCurrency) => c.code);
        setSelectedCodes(defaultCodes);
      } catch {
        setError("Nie udało się pobrać listy walut.");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (selectedCodes.length === 0) return;

    async function fetchRates() {
      try {
        const data = await getRates(selectedCodes);
        setRates(data.rates);
        setDate(data.date);
      } catch {
        setError("Nie udało się pobrać kursów walut.");
      }
    }

    fetchRates();
  }, [selectedCodes]);

  function toggleCurrency(code: string) {
    setSelectedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  }

  function formatRate(rate: number) {
    return rate.toFixed(4);
  }

  if (loading) {
    return (
      <div className={styles.ratesPage}>
        <p className={styles.loading}>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className={styles.ratesPage}>
      <div className={styles.ratesContent}>
        <h1>Kursy walut</h1>
        <p className={styles.subtitle}>
          Aktualne kursy średnie walut względem PLN (NBP)
          {date && <span className={styles.date}> — {date}</span>}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.currencySelector}>
          <h2>Popularne waluty</h2>
          <div className={styles.chips}>
            {popular.map((c) => (
              <button
                key={c.code}
                className={`${styles.chip} ${
                  selectedCodes.includes(c.code) ? styles.chipActive : ""
                }`}
                onClick={() => toggleCurrency(c.code)}
              >
                {c.code} - {c.currency}
              </button>
            ))}
          </div>

          <h2>Pozostałe waluty</h2>
          <div className={styles.chips}>
            {others.map((c) => (
              <button
                key={c.code}
                className={`${styles.chip} ${
                  selectedCodes.includes(c.code) ? styles.chipActive : ""
                }`}
                onClick={() => toggleCurrency(c.code)}
              >
                {c.code} - {c.currency}
              </button>
            ))}
          </div>
        </div>

        {rates.length > 0 && (
          <div className={styles.ratesTable}>
            <table>
              <thead>
                <tr>
                  <th>Waluta</th>
                  <th>Kod</th>
                  <th>Kurs (PLN)</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.code}>
                    <td>{r.currency}</td>
                    <td className={styles.code}>{r.code}</td>
                    <td className={styles.rate}>{formatRate(r.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
