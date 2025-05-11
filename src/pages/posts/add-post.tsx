import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/posts/AddPost.module.css";
import { File, Image, Trash } from "lucide-react";
import { useUploadMedia } from "../../hooks/posts/useUploadMedia";
import { useAddPost } from "../../hooks/posts/useAddPost";
import toast from "react-hot-toast";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

interface PostFormProps {
  category?: string;
}

interface AttachmentFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

// Define Delta interfaces for Quill content
interface DeltaOperation {
  insert: string | { [key: string]: any };
  attributes?: { [key: string]: any };
}

interface DeltaContent {
  ops: DeltaOperation[];
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const AddPost: React.FC<PostFormProps> = ({ category = "" }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  const quillRef = useRef<ReactQuill>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const uploadMediaMutation = useUploadMedia();
  const { mutate: addPost, isPending } = useAddPost(category);

  // Quill editor configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          [{ direction: "rtl" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "direction",
  ];

  // Image upload handler
  function handleImageUpload() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      if (input.files?.[0]) {
        await uploadAndInsertImage(input.files[0]);
      }
    };

    input.click();
  }

  // Image upload and insertion logic
  async function uploadAndInsertImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setIsImageUploading(true);
      const editor = quillRef.current?.getEditor();
      const range = editor?.getSelection(true);

      if (!editor || !range) return;

      const tempId = `temp-img-${Date.now()}`;
      const placeholderUrl = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;

      editor.insertEmbed(range.index, "image", placeholderUrl);

      setTimeout(() => {
        const images = document.querySelectorAll(".ql-editor img");
        const placeholderImage = images[images.length - 1];
        if (placeholderImage) {
          placeholderImage.classList.add(styles.uploadingImage);
          placeholderImage.setAttribute("data-temp-id", tempId);
        }
      }, 0);

      // @ts-ignore
      editor.setSelection(range.index + 1);

      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadMediaMutation.mutateAsync(formData);

      const placeholderImage = document.querySelector(
        `img[data-temp-id="${tempId}"]`
      );

      if (placeholderImage) {
        placeholderImage.setAttribute("src", response.url);
        placeholderImage.classList.remove(styles.uploadingImage);
        placeholderImage.classList.add(styles.uploadedImage);
        placeholderImage.removeAttribute("data-temp-id");
        placeholderImage.setAttribute("data-image-id", generateId());
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsImageUploading(false);
    }
  }

  // Handle image clicks for removal
  const handleImageClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && target.closest(".ql-editor")) {
      if (confirm("Do you want to remove this image?")) {
        removeImage(target as HTMLImageElement);
      }
    }
  };

  // Remove image from editor
  const removeImage = (imageElement: HTMLImageElement) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const delta = editor.getContents();
    let currentIndex = 0;

    // @ts-ignore
    for (const op of delta.ops) {
      if (op.insert?.image === imageElement.src) {
        editor.deleteText(currentIndex, 1);
        return;
      }
      currentIndex += typeof op.insert === "string" ? op.insert.length : 1;
    }
  };

  // File attachment handling
  const handleAttachmentUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);

      if (attachments.length + fileList.length > 5) {
        toast.error("Maximum 5 attachments allowed");
        return;
      }

      const oversizedFiles = fileList.filter(
        (file) => file.size > 10 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        toast.error("Files must be smaller than 10MB");
        return;
      }

      const newAttachments: AttachmentFile[] = fileList.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    }
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // Get the contents as Delta format rather than HTML
  const getQuillContents = (): DeltaContent => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return { ops: [] };
    // @ts-ignore
    return editor.getContents();
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";

    // Get the Delta content and check if it's empty
    const deltaContent = getQuillContents();
    const isContentEmpty =
      !deltaContent.ops ||
      deltaContent.ops.length === 0 ||
      (deltaContent.ops.length === 1 &&
        typeof deltaContent.ops[0].insert === "string" &&
        deltaContent.ops[0].insert.trim() === "\n");

    if (isContentEmpty) newErrors.content = "Content is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isImageUploading) {
        toast.error("Please wait for images to finish uploading");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);

      // Add quill content as JSON string
      formData.append("quillContent", JSON.stringify(deltaContent));

      // If your API also needs the HTML version for some reason
      formData.append("content", content);

      attachments.forEach((attachment) => {
        formData.append("attachments", attachment.file);
      });

      addPost(formData, {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setAttachments([]);
        },
      });
    }
  };

  // Image hover tooltip effect
  useEffect(() => {
    const tooltip = document.createElement("div");
    tooltip.className = styles.imageTooltip;
    tooltip.textContent = "Click to remove image";
    document.body.appendChild(tooltip);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" && target.closest(".ql-editor")) {
        const rect = target.getBoundingClientRect();
        tooltip.style.display = "block";
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
      }
    };

    const handleMouseOut = () => {
      tooltip.style.display = "none";
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.removeChild(tooltip);
    };
  }, []);

  // Image click handling
  useEffect(() => {
    const editorElement = document.querySelector(".ql-editor");
    const handleClick = (e: Event) => handleImageClick(e);

    editorElement?.addEventListener("click", handleClick);
    return () => editorElement?.removeEventListener("click", handleClick);
  }, []);

  // Image hover styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .ql-editor img.${styles.uploadedImage} {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .ql-editor img.${styles.uploadedImage}:hover {
        box-shadow: 0 0 0 2px #3182ce;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Paste handling
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (e.clipboardData?.items) {
        const items = Array.from(e.clipboardData.items);
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) await uploadAndInsertImage(file);
            break;
          }
        }
      }
    };

    const editorElement = document.querySelector(".ql-editor");
    // @ts-ignore
    editorElement?.addEventListener("paste", handlePaste);
    // @ts-ignore
    return () => editorElement?.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className={styles.createPostForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="post-title" className={styles.label}>
                Title
              </label>
              <input
                id="post-title"
                type="text"
                className={`${styles.input} ${
                  errors.title ? styles.inputError : ""
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className={styles.errorText}>{errors.title}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="post-content" className={styles.label}>
                Content
              </label>
              <div
                className={`${styles.editorContainer} ${
                  errors.content ? styles.editorError : ""
                }`}
              >
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your post content here..."
                  className={styles.editor}
                />
                <div className={styles.editorInfo}>
                  <small>Tip: Click on an image to remove it</small>
                </div>
              </div>
              {errors.content && (
                <p className={styles.errorText}>{errors.content}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Attachments</label>
              <div className={styles.attachmentControls}>
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  className={styles.addFilesButton}
                  disabled={attachments.length >= 5}
                >
                  Add Files ({attachments.length}/5)
                </button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                  className={styles.fileInput}
                  accept="*"
                />
                <small className={styles.fileLimitText}>
                  Max 5 files, 10MB each
                </small>
              </div>

              {attachments.length > 0 && (
                <div className={styles.attachmentsList}>
                  {attachments.map((file) => (
                    <div key={file.id} className={styles.attachmentItem}>
                      <div className={styles.attachmentIcon}>
                        {file.type.startsWith("image/") ? (
                          <Image className={styles.fileTypeIcon} />
                        ) : (
                          <File className={styles.fileTypeIcon} />
                        )}
                      </div>
                      <div className={styles.attachmentInfo}>
                        <p className={styles.attachmentName}>{file.name}</p>
                        <p className={styles.attachmentSize}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id)}
                        className={styles.removeButton}
                      >
                        <Trash className={styles.trashIcon} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                disabled={isPending || isImageUploading}
                className={`${styles.submitButton} ${
                  isPending || isImageUploading ? styles.buttonDisabled : ""
                }`}
              >
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default AddPost;
