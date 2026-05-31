import { useState } from "react";
import styles from "./Contact.module.scss";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Nie udało się wysłać wiadomości. Spróbuj ponownie później.");
    }
  }

  return (
    <div className={styles.contact}>
      <div className={styles.content}>
        <h1>Kontakt</h1>
        <p className={styles.lead}>
          Masz pytania? Skontaktuj się z nami!
        </p>

        <div className={styles.grid}>
          <div className={styles.info}>
            <h2>Dane kontaktowe</h2>
            <p>
              <strong>Email:</strong> kontakt@loanforlawn.pl
            </p>
            <p>
              <strong>Telefon:</strong> +48 123 456 789
            </p>
            <p>
              <strong>Adres:</strong> ul. Przykładowa 1, 00-001 Warszawa
            </p>
            <p>
              <strong>Godziny otwarcia:</strong>
            </p>
            <p>Pon-Pt: 8:00 - 18:00</p>
            <p>Sb: 9:00 - 14:00</p>
          </div>

          <div className={styles.formSection}>
            <h2>Napisz do nas</h2>
            {sent ? (
              <div className={styles.success}>
                Wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.field}>
                  <label htmlFor="name">Imię i nazwisko</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jan Kowalski"
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
                  <label htmlFor="message">Wiadomość</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Treść wiadomości..."
                  />
                </div>
                <button type="submit" className={styles.btn}>
                  Wyślij wiadomość
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
