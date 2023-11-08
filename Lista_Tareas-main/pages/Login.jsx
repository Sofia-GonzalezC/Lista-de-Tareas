import Link from "next/link";
import { React, useEffect, useState } from "react";

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`iniciar-sesion ${isVisible ? "active" : ""}`}>
      <nav>
        <Link href="/" className="link4">Inicio</Link>
      </nav>
      <h2 className="titulo-iniciar-sesion">
        <b>Iniciar Sesión</b>
      </h2>
      <Link href="http://127.0.0.1:8000/aplicacion/iniciar_sesion/" className="linkDjango2">
        Ir a la página de inicio de sesión de Django
      </Link>
    </div>
  );
}

export default Login;
