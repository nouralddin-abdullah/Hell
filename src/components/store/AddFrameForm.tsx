import React, { useState } from "react";
import Input from "../common/input/Input";
import Button from "../common/button/Button";
import { useAddFrame } from "../../hooks/store/useAddFrame";

const AddFrameForm = ({ onClose }: { onClose: () => void }) => {
  const [inputFields, setInputFields] = useState({
    frameName: "",
    frameURL: "",
    framePrice: "",
  });

  const handleChange = (field: string, value: string) => {
    setInputFields((prevState) => ({ ...prevState, [field]: value }));
  };

  const { mutateAsync, isPending } = useAddFrame();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", inputFields.frameName);
    formData.append("price", inputFields.framePrice);
    formData.append("URL", inputFields.frameURL);
    formData.append("currency", "coins");

    try {
      await mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ margin: "1rem 0 3rem" }}>Add New Frame</h3>

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
        Add Frame
      </Button>
    </form>
  );
};

export default AddFrameForm;
