import { Attachment } from "../../types/Question";
import FileAttachment from "../common/File/File";
import ImageComponent from "../common/ImageComponent/ImageComponent";
import VideoPlayer from "../common/VideoPlayer/VideoPlayer";

const QuestionAttachment = (attachment: Attachment) => {
  if (attachment.mimeType.includes("image")) {
    return (
      <ImageComponent
        style={{ maxWidth: "300px" }}
        defaultHeight="300px"
        defaultWidth="100%"
        src={attachment.url}
      />
    );
  }

  if (attachment.mimeType.includes("video")) {
    return <VideoPlayer videoUrl={attachment.url} />;
  }

  return <FileAttachment file={attachment} />;
};

export default QuestionAttachment;
