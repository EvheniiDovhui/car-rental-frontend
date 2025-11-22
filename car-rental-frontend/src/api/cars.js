export async function getCars() {
    const res = await fetch("http://localhost:8080/api/cars");
    return res.json();
  }
  