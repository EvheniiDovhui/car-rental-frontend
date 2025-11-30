import { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Паролі не співпадають");
      return;
    }

    const res = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();
    console.log(data);

    if (data.status === "success") {
      alert("Реєстрація успішна!");
      navigate("/login"); // <-- тепер правильно
    } else {
      alert("Помилка: " + (data.error ?? "Сталася невідома помилка"));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Реєстрація</h2>

        <input name="name" type="text" placeholder="Ваше ім'я"
               value={form.name} onChange={handleChange} required />

        <input name="email" type="email" placeholder="Електронна пошта"
               value={form.email} onChange={handleChange} required />

        <input name="password" type="password" placeholder="Пароль"
               value={form.password} onChange={handleChange} required />

        <input name="confirm" type="password" placeholder="Повторіть пароль"
               value={form.confirm} onChange={handleChange} required />

        <button className={styles.button} type="submit">
          Створити акаунт
        </button>
      </form>
    </div>
  );
}
