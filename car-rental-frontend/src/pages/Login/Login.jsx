import { useState, useContext } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.js";



export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log(data);

    if (data.status === "success") {
      // Зберігаємо токен (поки фейковий)
      localStorage.setItem("token", data.token);

      // 🔥 Зберігаємо юзера
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user); // оновлюємо глобальний стан
      }

      
      navigate("/");
    } else {
      alert("Помилка: " + (data.error ?? "Невірні дані"));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Вхід</h2>

        <input
          name="email"
          type="email"
          placeholder="Електронна пошта"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className={styles.button} type="submit">
          Увійти
        </button>
      </form>
    </div>
  );
}
