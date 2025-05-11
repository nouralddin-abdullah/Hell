import styles from "../../styles/posts/Post.module.css";

interface Attachment {
  url: string;
  name: string;
  size: number;
}

interface PostAttachmentsProps {
  attachments?: Attachment[];
}

const PostAttachments = ({ attachments }: PostAttachmentsProps) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className={styles.attachments}>
      <h3 className={styles.attachmentsTitle}>Attachments</h3>
      <ul className={styles.attachmentsList}>
        {attachments.map((attachment, index) => (
          <li key={`attachment-${index}`} className={styles.attachmentItem}>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attachmentLink}
            >
              {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostAttachments;
