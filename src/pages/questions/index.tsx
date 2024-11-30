import { TailSpin } from "react-loader-spinner";

const QuestionsPage = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <h1>in Progress</h1>
      <TailSpin
        visible={true}
        height="50"
        width="50"
        color="#6366f1"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default QuestionsPage;
