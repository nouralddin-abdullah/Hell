import { useNavigate } from "react-router-dom";
import { useDeleteNote } from "../../hooks/notes/useDeleteNote";
import Button from "../common/button/Button";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface Props {
  postId: string;
  closeModal: () => void;
}

const DeletePostButton = ({ postId, closeModal }: Props) => {
  const { data: currentUser } = useGetCurrentUser();
  const { mutateAsync: deleteNote, isPending } = useDeleteNote();

  const navigate = useNavigate();

  const handleDeleteNote = async () => {
    await deleteNote(postId);
    closeModal();
    navigate(`/profile/${currentUser?.user.username}`);
  };

  return (
    <Button onClick={() => handleDeleteNote()} isLoading={isPending}>
      Delete
    </Button>
  );
};

export default DeletePostButton;
