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
import { useDownloadMaterialFolders } from "../../hooks/materials/useDownloadMaterialsFolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { TailSpin } from "react-loader-spinner";
import AddMaterialForm from "../../components/materials/AddMaterialForm";
import Modal from "../../components/common/modal/Modal";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import DeleteMaterialButton from "../../components/materials/DeleteMaterialButton";
import { MaterialType } from "../../types/Material";
import Button from "../../components/common/button/Button";

const MaterialsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser();

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

  const { mutateAsync } = useDownloadMaterialFolders();
  const [isDownloading, setIsDownloading] = useState("");

  const downloadFolder = async (materialId: string) => {
    try {
      setIsDownloading(materialId);
      await mutateAsync(materialId);
    } catch (error) {
      console.error(error);
    }

    setIsDownloading("");
  };

  const [showUploadModal, setShowUploadModal] = useState(false);

  // delete modal states
  const [selectedMaterial, setSelectedMaterial] =
    useState<null | MaterialType>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <PageWrapper>
      {currentUser?.user.role !== "student" && (
        <div
          style={{
            margin: "1rem 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // gap: "1rem",
          }}
        >
          <h3>Add File To This Folder</h3>
          <button
            onClick={() => setShowUploadModal(true)}
            className="add-content-btn"
          >
            +
          </button>
        </div>
      )}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <AddMaterialForm
          parentPath={parentPath}
          onClose={() => setShowUploadModal(false)}
        />
      </Modal>
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
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span
                  key={material._id}
                  onClick={() => {
                    setParentPath((prevState) =>
                      prevState === ""
                        ? material.name
                        : `${prevState}/${material.name}`
                    );
                  }}
                >
                  <FolderComponent title={material.name} />
                </span>

                <button
                  className="download-material-button"
                  onClick={() => downloadFolder(material._id)}
                >
                  {isDownloading === material._id ? (
                    <TailSpin
                      visible={true}
                      height="10"
                      width="10"
                      color="#6366f1"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} />
                  )}
                </button>

                {currentUser?.user.role !== "student" && (
                  <button
                    className="download-material-button"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <FileComponent
                  title={material.name}
                  type={
                    material.name.split(".")[
                      material.name.split(".").length - 1
                    ]
                  }
                />
                <a
                  href={`${baseURL}/api/materials/download/${material._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={material._id}
                  className="download-material-button"
                >
                  {isDownloading === material._id ? (
                    <TailSpin
                      visible={true}
                      height="10"
                      width="10"
                      color="#6366f1"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} />
                  )}
                </a>

                {currentUser?.user.role !== "student" && (
                  <button
                    className="download-material-button"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            )
          )
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete ({selectedMaterial?.name}) ?
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            margin: "1rem",
          }}
        >
          <Button
            style={{ background: "gray" }}
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <DeleteMaterialButton
            closeModal={() => setIsDeleteModalOpen(false)}
            // @ts-ignore
            materialId={selectedMaterial?._id}
          />
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default MaterialsPage;
