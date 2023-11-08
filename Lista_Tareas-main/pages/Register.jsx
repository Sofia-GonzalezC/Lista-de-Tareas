import Link from "next/link";
import { React, useState, useEffect } from "react";

function Register() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`registro ${isVisible ? "active" : ""}`}>
      <nav>
        <Link href="/" className="link3">Inicio</Link>
      </nav>
      <h2 className="titulo-registro">
        <b>Registro</b>
      </h2>
      <Link href="http://127.0.0.1:8000/aplicacion/registro/" className="linkDjango">
        Ir a la página de registro de Django
      </Link>
    </div>
  );
}

export default Register;
