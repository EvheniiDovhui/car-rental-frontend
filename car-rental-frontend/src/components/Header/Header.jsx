import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";



export default function Header() {
  const { user, logout } = useContext(UserContext);

  console.log("USER FROM CONTEXT =", user);

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
          {user ? (
            <>
              <span className={styles.userName}>👤 {user.name}</span>
              <Link to="/profile" className={styles.link}>Профіль</Link>
              <button onClick={logout} className={styles.logoutBtn}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Увійти</Link>
              <Link to="/register" className={styles.primaryBtn}>Зареєструватися</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
