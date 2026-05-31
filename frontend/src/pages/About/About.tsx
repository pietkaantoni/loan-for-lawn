import styles from "./About.module.scss";

export default function About() {
  return (
    <div className={styles.about}>
      <div className={styles.content}>
        <h1>O nas</h1>
        <p className={styles.lead}>
          Loan for Lawn to nowoczesna platforma pożyczkowa, która umożliwia
          szybkie i bezpieczne uzyskanie finansowania online.
        </p>

        <section className={styles.section}>
          <h2>Nasza misja</h2>
          <p>
            Ułatwiamy dostęp do finansowania poprzez w pełni cyfrowy proces,
            eliminując zbędną biurokrację i skracając czas oczekiwania na
            decyzję kredytową.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Jak działamy?</h2>
          <ol>
            <li>Załóż darmowe konto na naszej platformie</li>
            <li>Wypełnij wniosek o pożyczkę online</li>
            <li>Otrzymaj decyzję w ciągu kilku minut</li>
            <li>Środki trafiają na Twoje konto</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Bezpieczeństwo</h2>
          <p>
            Korzystamy z najnowszych technologii szyfrowania i standardów
            bezpieczeństwa, aby chronić Twoje dane osobowe i finansowe.
            Wszystkie transakcje są realizowane z zachowaniem najwyższych
            standardów bezpieczeństwa.
          </p>
        </section>
      </div>
    </div>
  );
}
