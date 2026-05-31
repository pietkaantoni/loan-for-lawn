import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>&copy; {new Date().getFullYear()} Loan for Lawn. Wszelkie prawa zastrzeżone.</p>
        <p className={styles.disclaimer}>
          To jest projekt edukacyjny. Nie świadczymy rzeczywistych usług finansowych.
        </p>
      </div>
    </footer>
  );
}
