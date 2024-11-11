import { useNavigate, useParams } from "react-router-dom";
import { useGetAllCourseMaterial } from "../../hooks/materials/useGetCourseMaterial";
import { useState } from "react";
import "../../styles/materials/style.css";
import FolderComponent from "../../components/materials/FolderComponent";
import FileComponent from "../../components/materials/FileComponent";
import BackButton from "../../components/common/button/BackButton";
import Skeleton from "../../components/common/skeleton/Skeleton";
import { baseURL } from "../../constants/baseURL";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { noMaterialsIcon } from "../../assets";

const MaterialsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parentPath, setParentPath] = useState("");

  const { data: materials, isLoading } = useGetAllCourseMaterial(
    id || "",
    parentPath
  );
  const handleBackButton = () => {
    if (parentPath) {
      const paths = parentPath.split("/");
      const prevPath = paths.slice(0, -1).join("/");
      setParentPath(prevPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <PageWrapper>
      <div className="materials-container container">
        <BackButton
          style={{ margin: "1rem 0" }}
          onClick={() => handleBackButton()}
        />

        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <Skeleton height="3.5rem" borderRadius="1rem" key={index} />
          ))
        ) : materials && materials.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gridColumn: "span 3",
              gap: "1rem",
            }}
          >
            <img style={{ width: "120px" }} src={noMaterialsIcon} alt="" />
            <h1>No Materials Available</h1>
          </div>
        ) : (
          materials?.map((material) =>
            material.type === "folder" ? (
              <span
                key={material._id}
                onClick={() =>
                  setParentPath((prevState) =>
                    prevState === ""
                      ? material.name
                      : `${prevState}/${material.name}`
                  )
                }
              >
                <FolderComponent title={material.name} />
              </span>
            ) : (
              <a
                href={`${baseURL}/api/materials/download/${material._id}`}
                target="_blank"
                rel="noopener noreferrer"
                key={material._id}
              >
                <FileComponent title={material.name} />
              </a>
            )
          )
        )}
      </div>
    </PageWrapper>
  );
};

export default MaterialsPage;
