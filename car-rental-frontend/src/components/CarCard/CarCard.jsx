import styles from "./CarCard.module.css";

export default function CarCard({ car }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {car.brand} {car.model}
      </h2>

      <p className={styles.year}>Рік: {car.year}</p>

      <p className={styles.price}>
        {car.pricePerDay}$/доба
      </p>

      <button className={styles.button}>Бронювати</button>
    </div>
  );
}
