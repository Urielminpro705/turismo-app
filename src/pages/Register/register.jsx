import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("\u00A0");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("\u00A0");

    try {
      const res = await fetch("http://3.138.174.15:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          username: username,
          password: password,
        }),
      });

      if (res.status == 201) {
        alert("Cuenta creada exitosamente");
        navigate("/login");
        return;
      }

      if (res.status === 400) {
        setMessage("Faltan atributos obligatorios");
      } else if (res.status === 409) {
        setMessage("El nombre de usuario ya está ocupado");
      } else {
        setMessage("Error inesperado")
      }
    } catch (err) {
      console.error(err);
      setMessage("No se puede conectar al servidor.")
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Sign Up</h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            id="name"
            placeholder="Nombre"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("\u00A0");
            }}/>

          <input
            type="text"
            id="username"
            placeholder="Nombre de Usuario"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setMessage("\u00A0");
            }}/>

          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage("\u00A0");
            }}/>
          
          <div className="login-message">
            <h5>{message}</h5>
          </div>

          <button type="submit">Crear Cuenta</button>
          
          <div className="login-links">
            <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
          </div>
        </form>
      </div>

      <div className="login-image">
        <img src="register.jpg" alt="gato"/>
      </div>

    </div>
  );
}

export default Register;