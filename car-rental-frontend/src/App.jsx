import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cars from "./pages/Cars/Cars";
import Header from "./components/Header/Header";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
      </Routes>
    </>
  );
}
