import { folderIcon } from "../../assets";

const FolderComponent = ({ title }: { title: string }) => {
  return (
    <div className="material-item">
      <img src={folderIcon} alt="" />
      <p>{title.replace("-", " ")}</p>
    </div>
  );
};

export default FolderComponent;
