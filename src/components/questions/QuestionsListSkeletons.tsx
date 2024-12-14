import Skeleton from "../common/skeleton/Skeleton";

const QuestionsListSkeletons = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
      <Skeleton
        style={{ width: "100%", height: "250px", borderRadius: "1rem" }}
      />
    </div>
  );
};

export default QuestionsListSkeletons;
