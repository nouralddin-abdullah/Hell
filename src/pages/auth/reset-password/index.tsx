import { logoIcon } from "../../../assets";
import "../../../styles/auth/login.css";
import ResetPasswordFormComponent from "../../../components/auth/ResetPasswordComponent";

export default function ResetPasswordPage() {
  return (
    <main className="form-bg sign-up-page">
      <section className="sign-up-container">
        <img src={logoIcon} alt="logo" />
        <p style={{ color: "#000" }}>Reset Password</p>
        <ResetPasswordFormComponent />
      </section>
    </main>
  );
}
