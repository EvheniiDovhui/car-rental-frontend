import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cars from "./pages/Cars/Cars";
import Header from "./components/Header/Header";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Booking from "./pages/Booking/Booking"; // 1. Імпортуємо сторінку бронювання
import CarDetails from "./pages/CarDetails/CarDetails";

export default function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          
          {/* 👇 НОВИЙ МАРШРУТ */}
          <Route path="/cars/:id" element={<CarDetails />} />
          
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}