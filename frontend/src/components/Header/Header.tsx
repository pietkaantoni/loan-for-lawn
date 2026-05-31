import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logo}>
          <Link to="/">Loan for Lawn</Link>
        </div>
        <nav className={styles.navbar}>
          <ul>
            <li>
              <Link to="/about-us">O nas</Link>
            </li>
            <li>
              <Link to="/loan">Weź pożyczkę</Link>
            </li>
            <li>
              <Link to="/rates">Kursy walut</Link>
            </li>
            <li>
              <Link to="/contact">Kontakt</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.login}>
          {token && user ? (
            <>
              <Link to="/dashboard" className={styles.username}>
                {user.username}
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.signin}>
                Zaloguj się
              </Link>
              <Link to="/register" className={styles.signup}>
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
