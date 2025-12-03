import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-content">
        <h1>Log In</h1>

        <form>
          <input type="text" id="username" placeholder="Nombre de Usuario"/>
          <input type="password" id="password" placeholder="Contraseña"/>
          <div className="login-message">
            <h5>hola</h5>
          </div>
          <button type="submit">Iniciar Sesión</button> 
          <div className="login-links">
            <Link to="/register">¿No tienes cuenta? Crea una</Link>
          </div>
        </form>
      </div>

      <div className="login-image">
        <img src="src\assets\login.jpg" alt="gato"/>
      </div>

    </div>
  );
}

export default Login;