import { useEffect, useState } from "react";
import CarCard from "../../components/CarCard/CarCard";
import styles from "./Cars.module.css";

export default function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cars")
      .then(res => res.json())
      .then(setCars);
  }, []);

  return (
    <div className={styles.grid}>
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
