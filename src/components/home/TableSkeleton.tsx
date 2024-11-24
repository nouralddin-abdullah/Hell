import Skeleton from "../common/skeleton/Skeleton";

const TableSkeleton = () => {
  return (
    <div
      style={{
        width: "100%",
        // height: "100%",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
      <Skeleton style={{ padding: "1rem", width: "600px" }} />
    </div>
  );
};

export default TableSkeleton;
