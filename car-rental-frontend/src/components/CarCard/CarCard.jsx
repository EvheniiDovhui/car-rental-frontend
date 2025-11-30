import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext"; // Перевір шлях
import styles from "./CarCard.module.css";

// Компонент іконки
const HeartIcon = ({ filled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export default function CarCard({ car }) {
  const { user, setUser } = useContext(UserContext);

  // Перевіряємо, чи є ID авто в масиві favorites користувача
  const isFavorite = user?.favorites?.includes(car.id);

  async function toggleFavorite(e) {
    e.preventDefault(); // Щоб не переходило за посиланням
    
    if (!user) {
        alert("Увійдіть, щоб додавати в улюблене!"); 
        return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, carId: car.id })
      });
      const data = await res.json();
      
      if (data.status === "success") {
        // Оновлюємо глобальний стан користувача
        const updatedUser = { ...user, favorites: data.favorites };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.card}>
      {/* Обгортка для позиціонування сердечка */}
      <div style={{ position: 'relative' }}>
        <button className={styles.favBtn} onClick={toggleFavorite}>
            <HeartIcon filled={isFavorite} />
        </button>
      </div>

      <h2 className={styles.title}>
        {car.brand} {car.model}
      </h2>

      <div className={styles.info}>
        <p className={styles.year}>{car.year} рік</p>
        <p className={styles.price}>{car.pricePerDay}$/доба</p>
      </div>

      <div className={styles.actions}>
        <Link to={`/cars/${car.id}`} className={styles.detailsBtn}>Детальніше</Link>
        <Link to={`/booking/${car.id}`} className={styles.bookBtn}>Бронювати</Link>
      </div>
    </div>
  );
}