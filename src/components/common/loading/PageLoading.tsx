import { TailSpin } from "react-loader-spinner";

const PageLoading = () => {
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

export default PageLoading;
