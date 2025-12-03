import { Link } from "react-router-dom";
import "./register.css";

function Register() {
  return (
    <div className="login-container">

      <div className="login-content">
        <h1>Sign Up</h1>

        <form>
          <input type="text" id="username" placeholder="Nombre de Usuario"/>
          <input type="password" id="password" placeholder="Contraseña"/>
          <input type="password" id="password" placeholder="Repetir Contraseña"/>
          <button type="submit">Crear Cuenta</button>
          <div className="login-links">
            <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
          </div>
        </form>
      </div>

      <div className="login-image">
        <img src="src\assets\register.jpg" alt="gato"/>
      </div>

    </div>
  );
}

export default Register;