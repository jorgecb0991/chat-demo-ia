import { redirect } from "next/navigation";

export default function Home() {
  // Aquí validas si hay sesión o no
  const isLoggedIn = false; // reemplaza por lógica real

  if (!isLoggedIn) {
    redirect("/login");
  }

  redirect("/dashboard");
}
