import { pdfIcon } from "../../assets";

const FileComponent = ({ title }: { title: string }) => {
  return (
    <div className="material-item">
      <img src={pdfIcon} alt="" />
      <p>{title.replace("-", " ")}</p>
    </div>
  );
};

export default FileComponent;
