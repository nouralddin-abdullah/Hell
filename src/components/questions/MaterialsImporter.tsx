import { useGetAllCourseMaterial } from "../../hooks/materials/useGetCourseMaterial";
import { useEffect, useState } from "react";
import "../../styles/materials/style.css";
import FolderComponent from "../../components/materials/FolderComponent";
import FileComponent from "../../components/materials/FileComponent";
import BackButton from "../../components/common/button/BackButton";
import Skeleton from "../../components/common/skeleton/Skeleton";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { noMaterialsIcon } from "../../assets";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";
import { baseURL } from "../../constants/baseURL";
import { Import, Check } from "lucide-react";
import useMaterialStore from "../../store/materialStore";

const MaterialsImporter = () => {
  const { data: coursesList } = useGetAllCourses();
  const { setSelectedMaterial: setStoreSelectedMaterial, setIsImporterOpen } =
    useMaterialStore();

  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [parentPath, setParentPath] = useState("");
  const [localSelectedMaterial, setLocalSelectedMaterial] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const { data: materials, isLoading } = useGetAllCourseMaterial(
    selectedMaterialId || "",
    parentPath
  );

  const handleBackButton = () => {
    if (parentPath) {
      const paths = parentPath.split("/");
      const prevPath = paths.slice(0, -1).join("/");
      setParentPath(prevPath);
    } else {
      setSelectedMaterialId("");
    }
  };

  const [url, setUrl] = useState(`${baseURL}/materials`);

  useEffect(() => {
    setUrl(
      `${baseURL}/materials${
        selectedMaterialId ? `/${selectedMaterialId}` : ""
      }${selectedMaterialId && parentPath ? `/${parentPath}` : ""}`
    );
  }, [selectedMaterialId, parentPath]);

  const handleSelect = (
    materialName: string,
    isFile: boolean,
    materialId?: string
  ) => {
    if (isFile && materialId) {
      const fileUrl = `${baseURL}/api/materials/download/${materialId}`;
      setLocalSelectedMaterial({ url: fileUrl, name: materialName });
    } else {
      setParentPath((prevState) =>
        prevState === "" ? materialName : `${prevState}/${materialName}`
      );
    }
  };

  const handleImport = () => {
    if (localSelectedMaterial) {
      setStoreSelectedMaterial(localSelectedMaterial);
      setIsImporterOpen(false);
    }
  };

  return (
    <PageWrapper>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3>Select Material</h3>
          <button
            onClick={() => setIsImporterOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {selectedMaterialId && (
          <BackButton
            style={{ margin: "1rem 0" }}
            onClick={() => handleBackButton()}
          />
        )}

        {!selectedMaterialId &&
          coursesList?.map((course) => (
            <div
              key={course._id}
              style={{ display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <span onClick={() => setSelectedMaterialId(course._id)}>
                <FolderComponent title={course.courseName} />
              </span>
            </div>
          ))}

        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <Skeleton height="3.5rem" borderRadius="1rem" key={index} />
          ))
        ) : materials && materials.length === 0 && selectedMaterialId ? (
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
          selectedMaterialId &&
          materials?.map((material) =>
            material.type === "folder" ? (
              <div
                key={material._id}
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span onClick={() => handleSelect(material.name, false)}>
                  <FolderComponent title={material.name} />
                </span>
              </div>
            ) : (
              <div
                key={material._id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  backgroundColor:
                    localSelectedMaterial?.url ===
                    `${baseURL}/api/materials/download/${material._id}`
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => handleSelect(material.name, true, material._id)}
              >
                <FileComponent
                  title={material.name}
                  type={
                    material.name.split(".")[
                      material.name.split(".").length - 1
                    ]
                  }
                />
                {localSelectedMaterial?.url ===
                  `${baseURL}/api/materials/download/${material._id}` && (
                  <Check size={18} color="#6366f1" />
                )}
              </div>
            )
          )
        )}

        <div
          style={{
            position: "sticky",
            bottom: -20,
            left: 0,
            width: "100%",
            padding: "1rem",
            backgroundColor: "var(--secondary-background)",
            borderRadius: "1rem",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              {localSelectedMaterial && (
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  Selected: {localSelectedMaterial.name}
                </div>
              )}
            </div>
            <button
              onClick={handleImport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: localSelectedMaterial ? "#6366f1" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: localSelectedMaterial ? "pointer" : "not-allowed",
              }}
              disabled={!localSelectedMaterial}
            >
              <Import size={16} />
              Import
            </button>
          </div>

          <div style={{ fontSize: "0.8rem", color: "#666" }}>
            URL: {localSelectedMaterial?.url || url}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MaterialsImporter;
