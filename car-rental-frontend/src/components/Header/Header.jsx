import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          CarRental
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>Головна</Link>
          <Link to="/cars" className={styles.link}>Авто</Link>
          <Link to="/about" className={styles.link}>Про нас</Link>
          <Link to="/contact" className={styles.link}>Контакти</Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn}>Увійти</Link>
          <Link to="/register" className={styles.primaryBtn}>Зареєструватися</Link>
        </div>
      </div>
    </header>
  );
}
