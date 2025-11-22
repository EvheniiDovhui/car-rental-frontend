import styles from "./Home.module.css";
import { Link } from "react-router-dom";



export default function Home() {

  return (
    <div className={styles.wrapper}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Оренда авто онлайн</h1>
          <p className={styles.subtitle}>
            Обирайте, бронюйте та керуйте авто швидко, зручно та без проблем.
          </p>

          <div className={styles.buttons}>
            <Link to="/cars" className={styles.primaryBtn}>Переглянути авто</Link>
            <Link to="/login" className={styles.secondaryBtn}>Увійти</Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefits}>
        <h2>Чому ми?</h2>
        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <h3>🚗 Великий вибір</h3>
            <p>Від економ-класу до преміуму — авто на будь-який випадок.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>⏱ Швидке бронювання</h3>
            <p>Оформлення всього за кілька кліків без зайвих дзвінків.</p>
          </div>

          <div className={styles.benefitCard}>
            <h3>💳 Прозорі ціни</h3>
            <p>Жодних прихованих платежів — бачиш ціну одразу.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Car Rental — Всі права захищені.
      </footer>
    </div>
  );
}
