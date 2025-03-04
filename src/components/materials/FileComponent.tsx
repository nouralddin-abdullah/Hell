import { useEffect, useState } from "react";
import { docIcon, pdfIcon, pptIcon, txtIcon, xlsIcon } from "../../assets";

interface Props {
  title: string;
  type: string;
}

const FileComponent = ({ title, type }: Props) => {
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (type === "pdf") {
      setIcon(pdfIcon);
    }
    if (type === "pptx" || type === "ppt") {
      setIcon(pptIcon);
    }
    if (type === "docx" || type === "doc") {
      setIcon(docIcon);
    }
    if (type === "xlsx") {
      setIcon(xlsIcon);
    }
    if (type === "txt") {
      setIcon(txtIcon);
    }
  }, [type]);

  return (
    <div className="material-item">
      <img src={icon} alt="" />
      <p>{title.replace("-", " ")}</p>
    </div>
  );
};

export default FileComponent;
