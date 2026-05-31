import styles from "./Home.module.scss";
import { Link } from "react-router";

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Loan for Lawn</h1>
          <p>Szybkie i bezpieczne pożyczki online na każdą potrzebę</p>
          <div className={styles.cta}>
            <Link to="/loan" className={styles.btnPrimary}>
              Weź pożyczkę
            </Link>
            <Link to="/register" className={styles.btnSecondary}>
              Załóż konto
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Dlaczego my?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>Niskie oprocentowanie</h3>
            <p>Konkurencyjne stawki już od 4.2% rocznie</p>
          </div>
          <div className={styles.feature}>
            <h3>Szybka decyzja</h3>
            <p>Decyzję kredytową otrzymasz w kilka minut</p>
          </div>
          <div className={styles.feature}>
            <h3>W pełni online</h3>
            <p>Wniosek, podpis i wypłata - wszystko przez internet</p>
          </div>
          <div className={styles.feature}>
            <h3>Bezpieczeństwo</h3>
            <p>Twoje dane są chronione najwyższymi standardami</p>
          </div>
        </div>
      </section>
    </main>
  );
}
