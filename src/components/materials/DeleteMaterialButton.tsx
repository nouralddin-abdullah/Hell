import { useDeleteMaterial } from "../../hooks/materials/useDeleteMaterial";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import Button from "../common/button/Button";

interface Props {
  materialId: string;
  closeModal: () => void;
}

const DeleteMaterialButton = ({ materialId, closeModal }: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  const { mutateAsync: deleteMaterial, isPending } = useDeleteMaterial();

  const handleDeleteMaterial = async () => {
    await deleteMaterial(materialId);
    closeModal();
  };

  if (currentUser?.user.role === "student") {
    return;
  }

  return (
    <Button onClick={() => handleDeleteMaterial()} isLoading={isPending}>
      Delete
    </Button>
  );
};

export default DeleteMaterialButton;
