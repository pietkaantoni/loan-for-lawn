import styles from "./Header.module.scss";
import { Link } from "react-router";

export default function Header() {
  return (
      <div className={styles.Header}>
    <div className={styles.header_inner}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="#" alt="logo" />
        </Link>
      </div>
      <div className={styles.navbar}>
        <ul>
          <li>
            <Link to="/about-us">O nas</Link>
          </li>
          <li>
            <Link to="/loan">Weź pożyczkę</Link>
          </li>
          <li>
            <Link to="/contact">Kontakt</Link>
          </li>
        </ul>
      </div>
      <div className={styles.login}>
        <div className={styles.signin}>
            <Link to="/login">Zaloguj się</Link>
        </div>
        <div className={styles.signup}>
            <Link to="/login/register">Zarejestruj się</Link>
        </div>
      </div>
    </div>
      </div>
  );
}
