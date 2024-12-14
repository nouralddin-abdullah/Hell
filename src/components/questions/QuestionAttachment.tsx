import { Attachment } from "../../types/Question";
import FileAttachment from "../common/File/File";

const QuestionAttachment = (attachment: Attachment) => {
  if (attachment.mimeType.includes("image")) {
    return <img style={{ maxWidth: "300px" }} src={attachment.url} />;
  }

  return <FileAttachment file={attachment} />;
};

export default QuestionAttachment;
