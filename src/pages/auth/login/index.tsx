import { Link } from "react-router-dom";
import { logoIcon } from "../../../assets";
import LoginFormComponent from "../../../components/auth/LoginForm";
import "../../../styles/auth/login.css";

export default function LoginPage() {
  return (
    <main className="form-bg sign-up-page">
      <section className="sign-up-container">
        <img src={logoIcon} alt="logo" />
        <p>Join Us</p>
        <LoginFormComponent />
        <Link to="/sign-up" style={{ margin: "1rem" }}>
          Don't have an account? Sign up.
        </Link>
      </section>
    </main>
  );
}
