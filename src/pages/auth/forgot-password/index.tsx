import { logoIcon } from "../../../assets";
import "../../../styles/auth/login.css";
import ForgotPasswordFormComponent from "../../../components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="form-bg sign-up-page">
      <section className="sign-up-container">
        <img src={logoIcon} alt="logo" />
        <p style={{ color: "#000" }}>Forgot Password</p>
        <ForgotPasswordFormComponent />
      </section>
    </main>
  );
}
