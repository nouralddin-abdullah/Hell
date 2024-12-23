import "../../styles/landing/style.css";
import { aboElEla, basselHafiz, universityLogo } from "../../assets";
import { profileImage } from "../../assets";
import { adora } from "../../assets";
import { hassany } from "../../assets";
import { hany } from "../../assets";
import { ghossam } from "../../assets";
import { nour } from "../../assets";
import { mohamedAbdullah } from "../../assets";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="introduction-page">
      <div className="intro-wrapper">
        <div className="container">
          <div className="intro-content">
            <div className="intro-text">
              <p>Welcome to BIS Platform for students</p>
              <p>
                We extend our deepest gratitude to <span>Dr. Basil</span>, our
                project supervisor, for his invaluable guidance and support. We
                are also grateful to <span>Dr. Abu Al-Ela</span> and{" "}
                <span>Dr. Mohamed Abdullah</span> for their encouragement and
                assistance
              </p>
              <img src={universityLogo} alt="" />

              <div>
                <Link
                  style={{
                    background: "var(--secondary)",
                    padding: "0.5rem 1rem",
                    margin: "0 1rem",
                    borderRadius: "1rem",
                    textDecoration: "none",
                    color: "white",
                  }}
                  to={"/login"}
                >
                  Login
                </Link>

                <Link
                  style={{
                    background: "var(--secondary)",
                    padding: "0.5rem 1rem",
                    margin: "0 1rem",
                    borderRadius: "1rem",
                    textDecoration: "none",
                    color: "white",
                  }}
                  to={"/home"}
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="intro-doctors-wrapper">
          <div className="intro-card">
            <img src={basselHafiz} alt="" />
            <div className="intro-doc-name">Dr. Basil</div>
            <div className="intro-doc-position">Doctor at Faculty Of CS</div>
          </div>
          <div className="intro-card">
            <img src={aboElEla} alt="" />
            <div className="intro-doc-name">Dr. Abu Al-Ela</div>
            <div className="intro-doc-position">BIS Program Coordinator</div>
          </div>
          <div className="intro-card">
            <img src={mohamedAbdullah} alt="" />
            <div className="intro-doc-name">Dr. Mohamed Abdullah</div>
            <div className="intro-doc-position">Doctor at Faculty Of CS</div>
          </div>
          <div className="intro-card">
            <img src={hany} alt="" />
            <div className="intro-doc-name">Hany Ashraf</div>
            <div className="intro-doc-position">
              Frontend Developer @BISHell
            </div>
          </div>
          <div className="intro-card">
            <img src={adora} alt="" />
            <div className="intro-doc-name">Youssef Qadry</div>
            <div className="intro-doc-position">
              Frontend Developer @BISHell
            </div>
          </div>
          <div className="intro-card">
            <img src={profileImage} alt="" />
            <div className="intro-doc-name">Youssef Kassab</div>
            <div className="intro-doc-position">
              Frontend Developer @BISHell
            </div>
          </div>
          <div className="intro-card">
            <img src={nour} alt="" />
            <div className="intro-doc-name">Nouralddin Abdullah</div>
            <div className="intro-doc-position">
              Fullstack Developer @BISHell
            </div>
          </div>
          <div className="intro-card">
            <img src={ghossam} alt="" />
            <div className="intro-doc-name">Mohamed Ghossam</div>
            <div className="intro-doc-position">Backend Developer @BISHell</div>
          </div>
          <div className="intro-card">
            <img src={hassany} alt="" />
            <div className="intro-doc-name">Youssef Hassany</div>
            <div className="intro-doc-position">
              Frontend Developer @BISHell
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
