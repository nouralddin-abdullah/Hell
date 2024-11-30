import "./editProfileForm.css";
import React, { FormEvent, useState } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import ImageCropper from "../common/image cropper/ImageCropper";
import Input from "../common/input/Input";
import Textarea from "../common/input/Textarea";
import Button from "../common/button/Button";
import { useUpdateUserData } from "../../hooks/users/useUpdateUserData";

const EditProfileForm = ({
  setIsEditingMode,
}: {
  setIsEditingMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: currentUser } = useGetCurrentUser();
  const { mutateAsync, isPending } = useUpdateUserData();

  const [currentData, setCurrentData] = useState({
    fullName: currentUser?.user.fullName,
    photo: currentUser?.user.photo,
    caption: currentUser?.user.caption,
  });

  const handleInputChange = (field: string, value: string) => {
    setCurrentData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleImageChange = (imgAttr: string, file: File) => {
    setCurrentData((prevState) => ({
      ...prevState,
      [imgAttr]: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (currentData.fullName !== currentUser?.user.fullName)
      // @ts-ignore
      formData.append("fullName", currentData.fullName);
    if (currentData.caption !== currentUser?.user.caption)
      // @ts-ignore
      formData.append("caption", currentData.caption);
    if (currentData.photo !== currentUser?.user.photo)
      // @ts-ignore
      formData.append("photo", currentData.photo);

    try {
      const data = await mutateAsync(formData);
      console.log(data);
      setIsEditingMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ overflowY: "scroll" }}>
      <ImageCropper
        imgState={currentData.photo}
        imgAttr="photo"
        submitFunction={handleImageChange}
        defaultImgSrc={currentUser?.user.photo}
        imgStyle="edit-profile-image"
      />
      <Input
        style={{ width: "100%" }}
        labelText="Full Name"
        value={currentData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
      />
      <Textarea
        style={{ width: "100%" }}
        labelText="Caption"
        value={currentData.caption}
        onChange={(e) => handleInputChange("caption", e.target.value)}
      />

      <Button style={{ margin: "0 auto" }} isLoading={isPending}>
        Submit
      </Button>
    </form>
  );
};

export default EditProfileForm;
