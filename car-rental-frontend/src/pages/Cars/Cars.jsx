import { useEffect, useState } from "react";
import CarCard from "../../components/CarCard/CarCard";
import styles from "./Cars.module.css";

export default function Cars() {
  const [cars, setCars] = useState([]);
  
  // Стан для фільтрів
  const [filters, setFilters] = useState({
    brand: "",
    maxPrice: ""
  });

  // Функція завантаження (приймає параметри)
  const fetchCars = async () => {
    // Будуємо URL з параметрами
    const params = new URLSearchParams();
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    try {
      const res = await fetch(`http://localhost:8080/api/cars?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error(err);
      alert("Не вдалося завантажити авто");
    }
  };

  // Завантажуємо всі авто при першому вході
  useEffect(() => {
    fetchCars();
  }, []);

  // Обробка зміни полів вводу
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Обробка кнопки пошуку
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className={styles.container}>
      {/* ПАНЕЛЬ ФІЛЬТРІВ */}
      <form className={styles.filters} onSubmit={handleSearch}>
        <input 
          name="brand" 
          placeholder="Марка (напр. BMW)" 
          value={filters.brand}
          onChange={handleChange}
          className={styles.input}
        />
        <input 
          name="maxPrice" 
          type="number" 
          placeholder="Макс. ціна ($)" 
          value={filters.maxPrice}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.searchBtn}>Пошук</button>
      </form>

      {/* СІТКА АВТО */}
      {cars.length > 0 ? (
        <div className={styles.grid}>
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <p className={styles.noCars}>Автомобілів за вашим запитом не знайдено.</p>
      )}
    </div>
  );
}