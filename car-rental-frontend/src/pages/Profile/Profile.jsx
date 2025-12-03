import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import CarCard from "../../components/CarCard/CarCard";
import styles from "./Profile.module.css";
// import { toast } from "react-toastify"; // Якщо використовуєш toast

export default function Profile() {
  const { user, setUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // 1. Перевірка авторизації
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: ""
      });
    }
  }, [user, navigate]);

  // 2. Завантаження улюблених авто
  useEffect(() => {
    // Завантажуємо всі авто один раз для використання у різних місцях
    fetch("http://localhost:8080/api/cars")
      .then((res) => res.json())
      .then((cars) => {
        setAllCars(cars);
        
        if (user && user.favorites && user.favorites.length > 0) {
          const favs = cars.filter((car) => user.favorites.includes(car.id));
          setFavoriteCars(favs);
        }
      })
      .catch((err) => console.error("Не вдалося завантажити авто:", err));
  }, [user]);

  // 3. Завантаження бронювань користувача
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/api/user-reservations?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setReservations(data.reservations || []);
        } else {
          console.error("Не вдалося завантажити бронювання:", data.error);
        }
      })
      .catch((err) => console.error("Помилка завантаження бронювань:", err));
  }, [user]);

  // Обробка полів вводу
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Збереження змін профілю
  async function handleSave() {
    try {
      const res = await fetch("http://localhost:8080/api/profile", { // Переконайся, що такий роут є на бекенді, або використовуй /api/users
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          email: form.email,
          password: form.password // Якщо пустий, бекенд має ігнорувати
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        // Зберігаємо оновленого юзера (не гублячи favorites)
        const updatedUser = { ...data.user, favorites: user.favorites };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Виводимо повідомлення (alert або toast)
        alert("Дані успішно оновлено!");
      } else {
        alert("Помилка: " + (data.error || "Не вдалося оновити профіль"));
      }
    } catch (err) {
      console.error(err);
      alert("Помилка з'єднання з сервером");
    }
  }

  if (!user) return null;

  // Функція для отримання назви авто за ID
  const getCarName = (carId) => {
    const car = allCars.find((c) => c.id === carId);
    return car ? `${car.brand} ${car.model}` : `Авто ID: ${carId}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Особистий кабінет</h2>

      <div className={styles.contentWrapper}>
        {/* ЛІВА КОЛОНКА: Форма редагування */}
        <div className={styles.profileCard}>
          <h3 className={styles.sectionTitle}>Мої дані</h3>
          
          <div className={styles.formGroup}>
            <label>Ім'я</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Новий пароль (необов'язково)</label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="••••••"
            />
          </div>

          <div className={styles.buttons}>
            <button className={styles.saveBtn} onClick={handleSave}>
              Зберегти зміни
            </button>
            <button className={styles.logoutBtn} onClick={logout}>
              Вийти
            </button>
          </div>
        </div>

        {/* ПРАВА/НИЖНЯ КОЛОНКА: Улюблені авто */}
        <div className={styles.favoritesSection}>
          <h3 className={styles.sectionTitle}>❤️ Улюблені авто</h3>
          
          {favoriteCars.length > 0 ? (
            <div className={styles.grid}>
              {favoriteCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Ви ще не додали жодного авто до улюблених.</p>
              <button onClick={() => navigate("/cars")} className={styles.linkBtn}>
                Перейти до каталогу →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}