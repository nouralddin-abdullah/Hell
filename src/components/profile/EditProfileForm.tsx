import "./editProfileForm.css";
import React, { FormEvent, useEffect, useState } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import ImageCropper from "../common/image cropper/ImageCropper";
import Input from "../common/input/Input";
import Textarea from "../common/input/Textarea";
import Button from "../common/button/Button";
import { useUpdateUserData } from "../../hooks/users/useUpdateUserData";
import { useDebounce } from "../../hooks/common/useDebounce";
import { baseURL } from "../../constants/baseURL";

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
    email: currentUser?.user.email,
    username: currentUser?.user.username,
  });

  // @ts-ignore
  const usernameDebounce = useDebounce(currentData.username);

  const [usernameState, setUsernameState] = useState<
    "" | "taken" | "loading" | "available"
  >("");

  const handleInputChange = (field: string, value: string) => {
    setCurrentData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleImageChange = (imgAttr: string, file: File) => {
    setCurrentData((prevState) => ({
      ...prevState,
      [imgAttr]: file,
    }));
  };

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (currentData.username === currentUser?.user.username) {
        setUsernameState("");
        return;
      }

      try {
        const response = await fetch(
          `${baseURL}/api/users/checkUsername/${currentData.username}`
        );
        const data = await response.json();

        if (data.status === "fail") setUsernameState("taken");
        if (data.status === "success") setUsernameState("available");
      } catch (error) {
        console.error(error);
      }
    };

    checkUsernameAvailability();
  }, [usernameDebounce]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (usernameState === "taken") return;

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
    if (currentData.email !== currentUser?.user.email)
      // @ts-ignore
      formData.append("email", currentData.email);
    if (currentData.username !== currentUser?.user.username)
      // @ts-ignore
      formData.append("username", currentData.username);

    try {
      await mutateAsync(formData);
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
      <Input
        style={{ width: "100%" }}
        labelText="Email"
        value={currentData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        <Input
          style={{ width: "100%" }}
          labelText="Username"
          value={currentData.username}
          onChange={(e) => {
            setUsernameState("loading");
            handleInputChange("username", e.target.value);
          }}
        />

        {usernameState === "available" && (
          <p style={{ color: "#4caf50", transform: "translateY(-1rem)" }}>
            Valid username
          </p>
        )}
        {usernameState === "loading" && (
          <p style={{ color: "gray", transform: "translateY(-1rem)" }}>
            Checking usernamce availability...
          </p>
        )}
        {usernameState === "taken" && (
          <p style={{ color: "red", transform: "translateY(-1rem)" }}>
            username is taken
          </p>
        )}
      </div>

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
