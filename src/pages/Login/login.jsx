import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("\u00A0");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(" ");

    try {
      const res = await fetch("http://3.138.174.15:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (res.status === 200) {
        alert("Inicio de sesión exitoso");
        const json = await res.json();
        localStorage.setItem("userId", json.data.id);
        navigate("/main");
        return;
      }

      if (res.status === 400) {
        setMessage("Campos incompletos");
      } else if (res.status === 401) {
        setMessage("Contraseña incorrecta");
      } else if (res.status === 404) {
        setMessage("Usuario no encontrado");
      } else {
        setMessage("Error inesperado");
      }
    } catch (err) {
      console.error(err);
      setMessage("No se puede conectar al servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Log In</h1>

        <form onSubmit={handleLogin}>

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

          <button type="submit">Iniciar Sesión</button> 
          <div className="login-links">
            <Link to="/register">¿No tienes cuenta? Crea una aquí</Link>
          </div>
        </form>
      </div>

      <div className="login-image">
        <img src="login.jpg" alt="gato"/>
      </div>

    </div>
  );
}

export default Login;