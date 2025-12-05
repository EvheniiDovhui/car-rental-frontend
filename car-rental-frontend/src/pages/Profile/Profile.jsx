import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import CarCard from "../../components/CarCard/CarCard";
import styles from "./Profile.module.css";

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

  useEffect(() => {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    try {
      const res = await fetch("http://localhost:8080/api/profile", { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        const updatedUser = { ...data.user, favorites: user.favorites };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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

        {/* ПРАВА/НИЖНЯ КОЛОНКА: Бронювання та Улюблені */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
          
          {/* СЕКЦІЯ: МОЇ БРОНЮВАННЯ */}
          <div className={styles.favoritesSection}>
            <h3 className={styles.sectionTitle}>🔑 Мої орендовані авто</h3>
            
            {reservations.length > 0 && allCars.length > 0 ? (
              <div className={styles.grid}>
                {reservations.map((res) => {
                  const car = allCars.find((c) => c.id === res.carId);
                  if (car) {
                    return (
                      <div key={res.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ 
                          background: '#f0f9ff', 
                          padding: '10px', 
                          borderRadius: '8px', 
                          fontSize: '0.9rem', 
                          border: '1px solid #bae6fd',
                          color: '#0369a1'
                        }}>
                          <strong>Період:</strong> <br/> {res.startDate} — {res.endDate}
                          <div style={{ marginTop: '5px', fontWeight: 'bold' }}>Сума: {res.totalPrice}$</div>
                        </div>
                        <CarCard car={car} />
                      </div>
                    );
                  }
                  return null; 
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>У вас поки немає активних бронювань.</p>
                <button onClick={() => navigate("/cars")} className={styles.linkBtn}>
                  Перейти до каталогу →
                </button>
              </div>
            )}
          </div>

          {/* СЕКЦІЯ: УЛЮБЛЕНІ АВТО */}
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
    </div>
  );
}