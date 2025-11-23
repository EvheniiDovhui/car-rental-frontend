import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, setUser, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);
  
  // Заповнюємо форму значеннями юзера
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: ""
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
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

  const text = await res.text();
  console.log("RAW BACKEND RESPONSE:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    alert("Сервер повернув не JSON!");
    return;
  }

  if (data.status === "success") {
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Дані оновлено!");
  } else {
    alert("Помилка: " + data.error);
  }
}
  if (!user) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Профіль</h2>

      <div className={styles.card}>
        <label>Імʼя</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Новий пароль</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <button className={styles.saveBtn} onClick={handleSave}>
          Зберегти зміни
        </button>

        <button className={styles.logoutBtn} onClick={logout}>
          Вийти
        </button>
      </div>
    </div>
  );
}
