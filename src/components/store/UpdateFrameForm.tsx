import React, { useState } from "react";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import { useUpdateFrame } from "../../hooks/store/useUpdateFrame";
import Avatar from "../common/avatar/Avatar";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { baseURL } from "../../constants/baseURL";
import { profileImage } from "../../assets";

interface Props {
  id: string;
  name: string;
  price: number;
  URL: string;
  currency: string;
  canAfford: boolean;
  onClose: () => void;
}

const UpdateFrameForm = (frame: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  const [inputFields, setInputFields] = useState({
    frameName: frame.name,
    frameURL: frame.URL,
    framePrice: frame.price,
  });

  const handleChange = (field: string, value: string) => {
    setInputFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const { mutateAsync, isPending } = useUpdateFrame(frame.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (inputFields.frameName !== frame.name) {
      formData.append("name", inputFields.frameName);
    }
    if (inputFields.framePrice !== frame.price) {
      formData.append("price", inputFields.framePrice.toString());
    }
    if (inputFields.frameURL !== frame.URL) {
      formData.append("URL", inputFields.frameURL);
    }

    try {
      await mutateAsync(formData);
      frame.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ margin: "1rem 0 3rem" }}>Update {frame.name}</h3>

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

      <Input
        required
        labelText="Name"
        value={inputFields.frameName}
        onChange={(e) => handleChange("frameName", e.target.value)}
      />
      <Input
        required
        labelText="URL"
        value={inputFields.frameURL}
        onChange={(e) => handleChange("frameURL", e.target.value)}
      />
      <Input
        required
        labelText="Price"
        value={inputFields.framePrice}
        onChange={(e) => handleChange("framePrice", e.target.value)}
        type="number"
      />

      <Button
        type="submit"
        style={{ margin: "1rem auto" }}
        isLoading={isPending}
      >
        Edit Frame
      </Button>
    </form>
  );
};

export default UpdateFrameForm;
