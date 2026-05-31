import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../../services/api";
import styles from "./Register.module.scss";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne.");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    setLoading(true);

    try {
      const data = await register(username, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>
        <h1>Zarejestruj się</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username">Nazwa użytkownika</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="jan_kowalski"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jan@example.com"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimum 6 znaków"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Potwierdź hasło</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Powtórz hasło"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>
        <p className={styles.link}>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
