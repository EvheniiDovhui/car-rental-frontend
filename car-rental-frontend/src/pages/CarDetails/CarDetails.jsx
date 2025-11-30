import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext"; // 1. Імпортуємо контекст
import styles from "./CarDetails.module.css";

// 2. Компонент іконки (той самий, що і в CarCard)
const HeartIcon = ({ filled }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 3. Дістаємо юзера та функцію оновлення з контексту
  const { user, setUser } = useContext(UserContext);
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/cars/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Авто не знайдено");
        return res.json();
      })
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        navigate("/cars");
      });
  }, [id, navigate]);

  // 4. Перевіряємо, чи є це авто в улюблених
  const isFavorite = user?.favorites?.includes(Number(id));

  // 5. Функція додавання/видалення з улюблених
  async function handleToggleFavorite() {
    if (!user) {
      toast.warning("Будь ласка, увійдіть у систему!"); // Або alert()
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, carId: Number(id) })
      });
      const data = await res.json();
      
      if (data.status === "success") {
        const updatedUser = { ...user, favorites: data.favorites };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Показуємо повідомлення
        if (updatedUser.favorites.includes(Number(id))) {
            toast.success("Додано до улюблених!");
        } else {
            toast.info("Видалено з улюблених.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Помилка з'єднання");
    }
  }

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (!car) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        <div className={styles.imageBlock}>
          {car.image ? (
            <img src={car.image} alt={car.model} className={styles.carImage} />
          ) : (
            <div className={styles.placeholderImg}>Немає фото</div>
          )}
        </div>

        <div className={styles.infoBlock}>
          {/* 6. Заголовок і кнопка сердечка в один рядок */}
          <div className={styles.titleHeader}>
            <h1 className={styles.title}>{car.brand} {car.model}</h1>
            <button className={styles.favBtnDetails} onClick={handleToggleFavorite}>
                 <HeartIcon filled={isFavorite} />
            </button>
          </div>

          <p className={styles.description}>{car.description}</p>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span>Рік</span><strong>{car.year}</strong>
            </div>
            <div className={styles.specItem}>
              <span>Двигун</span><strong>{car.engine || "-"}</strong>
            </div>
            <div className={styles.specItem}>
              <span>Паливо</span><strong>{car.fuel || "-"}</strong>
            </div>
            <div className={styles.specItem}>
              <span>КПП</span><strong>{car.transmission || "-"}</strong>
            </div>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>Ціна за добу:</span>
            <span className={styles.priceValue}>${car.pricePerDay}</span>
          </div>

          <div className={styles.buttons}>
            <Link to={`/booking/${car.id}`} className={styles.bookBtn}>
              Забронювати зараз
            </Link>
            <Link to="/cars" className={styles.backBtn}>
              ← Назад до списку
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}