import { Link } from "react-router-dom";
import { logoIcon } from "../../../assets";
import SignUpFormComponent from "../../../components/auth/SignUpForm";
import "../../../styles/auth/signup.css";

export default function SignUpPage() {
  return (
    <main className="form-bg sign-up-page">
      <section className="sign-up-container">
        <img src={logoIcon} alt="logo" className="signup-logo" />
        <p style={{ color: "#000" }}>Join Us</p>
        <SignUpFormComponent />
        <Link to="/login" style={{ margin: "1rem" }}>
          Have a account already? Login.
        </Link>
      </section>
    </main>
  );
}
