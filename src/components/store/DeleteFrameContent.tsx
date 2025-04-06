import Button from "../common/button/Button";
import Avatar from "../common/avatar/Avatar";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { baseURL } from "../../constants/baseURL";
import { profileImage } from "../../assets";
import { useDeleteFrame } from "../../hooks/store/useDeleteFrame";

interface Props {
  id: string;
  name: string;
  price: number;
  URL: string;
  currency: string;
  canAfford: boolean;
}

const DeleteFrameContent = (frame: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  const { mutateAsync, isPending } = useDeleteFrame();

  const handleDelete = async () => {
    try {
      await mutateAsync(frame.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 style={{ margin: "1rem 0 3rem" }}>Delete {frame.name} ?</h3>

      <div
        className="image-and-frame"
        style={{
          margin: "1rem auto 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          photo={
            currentUser?.user?.photo
              ? `${baseURL}/profilePics/${currentUser.user.photo}`
              : profileImage
          }
          userFrame={frame.URL}
          animated={true}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Button style={{ background: "gray" }}>Cancel</Button>

        <Button isLoading={isPending} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteFrameContent;
