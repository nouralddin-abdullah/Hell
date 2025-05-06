import { useNavigate } from "react-router-dom";
import styles from "../../styles/preview/style.module.css";
import { useEffect } from "react";
import usePreviewToken from "../../hooks/common/usePreviewToken";

const PreviewPage = () => {
  const navigate = useNavigate();
  const { error, isSuccess } = usePreviewToken();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess) {
      timer = setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess, navigate]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>⚠️ Error</h1>
          <p className={styles.subtitle}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎉 Welcome To BISHell!</h1>
        <p className={styles.subtitle}>
          We're glad to have you here. Please hold on while we redirect you...
        </p>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
};

export default PreviewPage;
