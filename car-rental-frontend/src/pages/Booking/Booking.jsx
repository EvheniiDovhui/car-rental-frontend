import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import styles from "./Booking.module.css";

export default function Booking() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [totalPrice, setTotalPrice] = useState(0);

  // 1. Завантаження авто
  useEffect(() => {
    fetch(`http://localhost:8080/api/cars/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Помилка завантаження");
        return res.json();
      })
      .then((data) => setCar(data))
      .catch(() => alert("Авто не знайдено"));
  }, [id]);

  // 2. Розрахунок ціни (ВИПРАВЛЕНО)
  useEffect(() => {
    if (dates.start && dates.end && car) {
      const start = new Date(dates.start);
      const end = new Date(dates.end);
      
      const diffTime = end - start; // різниця в мілісекундах
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 0) {
        // 🔥 ТУТ БУЛА ПОМИЛКА: car.price -> car.pricePerDay
        setTotalPrice(diffDays * car.pricePerDay); 
      } else {
        setTotalPrice(0);
      }
    }
  }, [dates, car]);

  function handleChange(e) {
    setDates({ ...dates, [e.target.name]: e.target.value });
  }

  async function handleReserve(e) {
    e.preventDefault();
    if (!user) {
      alert("Спершу увійдіть в акаунт!");
      navigate("/login");
      return;
    }

    // Перевірка перед відправкою
    if (totalPrice <= 0) {
        alert("Некоректні дати або ціна");
        return;
    }

    const res = await fetch("http://localhost:8080/api/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        carId: car.id,
        startDate: dates.start,
        endDate: dates.end,
        totalPrice: totalPrice // Тепер тут буде число, а не null
      })
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("Авто успішно заброньовано!");
      navigate("/cars");
    } else {
      alert("Помилка бронювання: " + (data.error || "Невідома помилка"));
    }
  }

  if (!car) return <div className={styles.container}>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleReserve}>
        <h2 className={styles.title}>Бронювання {car.brand} {car.model}</h2>
        
        <div className={styles.info}>
           {/* Якщо у вас нема фото, можна прибрати img */}
          <p>Ціна за добу: <b>${car.pricePerDay}</b></p>
        </div>

        <label>Дата початку:</label>
        <input 
          type="date" 
          name="start" 
          onChange={handleChange} 
          required 
          className={styles.input}
        />

        <label>Дата повернення:</label>
        <input 
          type="date" 
          name="end" 
          onChange={handleChange} 
          required 
          className={styles.input}
        />

        <div className={styles.total}>
          До сплати: <span>${totalPrice}</span>
        </div>

        <button className={styles.button} type="submit" disabled={totalPrice <= 0}>
          Підтвердити бронювання
        </button>
      </form>
    </div>
  );
}