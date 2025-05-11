import React from "react";
import styles from "../../styles/posts/Post.module.css";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import ImageComponent from "../../components/common/ImageComponent/ImageComponent";

// Define comprehensive interfaces for Quill Delta format
interface DeltaAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  link?: string;
  header?: number;
  list?: string;
  indent?: number;
  align?: string;
  direction?: 'rtl' | 'ltr'; 
  [key: string]: any; // Allow for any other attributes Quill might use
}

interface QuillContentOp {
  insert: string | { image: string } | { [key: string]: any };
  attributes?: DeltaAttributes;
}

interface PostContentProps {
  content?: string;
  quillContent?: {
    ops?: QuillContentOp[];
  };
}

const PostContent = ({ content, quillContent }: PostContentProps) => {
  // If no Quill content is provided, fallback to HTML content
  if (!quillContent?.ops) {
    return (
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: content || "" }} />
      </div>
    );
  }

  // Helper function to render text with attributes
  const renderFormattedText = (text: string, attributes?: DeltaAttributes) => {
    if (!attributes) return text;

    let formattedText = <>{text}</>;

    // Apply each attribute in sequence
    if (attributes.bold) {
      formattedText = <strong>{formattedText}</strong>;
    }
    if (attributes.italic) {
      formattedText = <em>{formattedText}</em>;
    }
    if (attributes.underline) {
      formattedText = <u>{formattedText}</u>;
    }
    if (attributes.strike) {
      formattedText = <s>{formattedText}</s>;
    }
    if (attributes.link) {
      formattedText = (
        <a
          href={attributes.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quillLink}
        >
          {formattedText}
        </a>
      );
    }

    return formattedText;
  };

  // Group ops by block to handle paragraphs, lists, etc.
  const renderQuillContent = () => {
    const renderedContent: JSX.Element[] = [];
    let currentBlock: {
      content: JSX.Element[];
      attributes?: DeltaAttributes;
      listItems?: JSX.Element[];
      listType?: string;
    } = { content: [] };

    quillContent?.ops?.forEach((op, index) => {
      const isLastOp = index === quillContent.ops!.length - 1;

      // Handle image inserts
      if (typeof op.insert === "object" && op.insert.image) {
        currentBlock.content.push(
          <div key={`img-${index}`} className={styles.quillImageContainer}>
            <ImageComponent
              src={op.insert.image}
              alt="Post content"
              className={styles.quillImage}
            />
          </div>
        );
      }
      // Handle text inserts
      else if (typeof op.insert === "string") {
        // Check for newlines to determine block breaks
        if (op.insert.includes("\n")) {
          const parts = op.insert.split("\n");

          parts.forEach((part, i) => {
            const isNewline =
              // @ts-ignore
              i < parts.length - 1 || (isLastOp && op.insert.endsWith("\n"));

            // Add current part to the block
            if (part) {
              currentBlock.content.push(
                <React.Fragment key={`text-${index}-${i}`}>
                  {renderFormattedText(part, op.attributes)}
                </React.Fragment>
              );
            }

            // If this is a newline, finalize the current block
            if (isNewline) {
              // Add the current block to rendered content
              if (currentBlock.content.length > 0 || currentBlock.listItems) {
                const blockAttributes =
                  op.attributes || currentBlock.attributes;

                // Handle list items
                if (blockAttributes?.list) {
                  // Start or continue a list
                  if (!currentBlock.listItems) {
                    currentBlock.listItems = [];
                    currentBlock.listType = blockAttributes.list;
                  }

                  // Add current content as a list item
                  if (currentBlock.content.length > 0) {
                    currentBlock.listItems.push(
                      <li
                        key={`list-item-${renderedContent.length}-${currentBlock.listItems.length}`}
                        className={styles.quillListItem}
                      >
                        {currentBlock.content}
                      </li>
                    );
                    currentBlock.content = [];
                  }

                  // If next op doesn't continue the list, render the list
                  const nextOp = quillContent.ops![index + 1];
                  const isEndOfList =
                    !nextOp ||
                    typeof nextOp.insert !== "string" ||
                    !nextOp.attributes?.list ||
                    nextOp.attributes.list !== currentBlock.listType;

                  if (isEndOfList && currentBlock.listItems.length > 0) {
                    const ListTag =
                      currentBlock.listType === "ordered" ? "ol" : "ul";
                    renderedContent.push(
                      <ListTag
                        key={`list-${renderedContent.length}`}
                        className={styles.quillList}
                      >
                        {currentBlock.listItems}
                      </ListTag>
                    );
                    currentBlock = { content: [] };
                  }
                }
                // Handle headers
                else if (blockAttributes?.header) {
                  const HeaderTag =
                    `h${blockAttributes.header}` as keyof JSX.IntrinsicElements;
                  renderedContent.push(
                    <HeaderTag
                      key={`header-${renderedContent.length}`}
                      className={styles.quillHeader}
                    >
                      {currentBlock.content}
                    </HeaderTag>
                  );
                  currentBlock = { content: [] };
                }
                // Handle alignment and direction
                else if (blockAttributes?.align || blockAttributes?.direction === 'rtl') {
                  const style: React.CSSProperties = {};
                  
                  if (blockAttributes.align) {
                    style.textAlign = blockAttributes.align as any;
                  }
                  
                  renderedContent.push(
                    <div
                      key={`align-${renderedContent.length}`}
                      className={styles.quillParagraph}
                      style={style}
                      dir={blockAttributes.direction}
                    >
                      {currentBlock.content}
                    </div>
                  );
                  currentBlock = { content: [] };
                }
                // Handle regular paragraphs
                else if (currentBlock.content.length > 0) {
                  renderedContent.push(
                    <div
                      key={`p-${renderedContent.length}`}
                      className={styles.quillParagraph}
                    >
                      {currentBlock.content}
                    </div>
                  );
                  currentBlock = { content: [] };
                }
              }

              // Store attributes for the next block
              currentBlock.attributes = op.attributes;
            }
          });
        }
        // Handle inline text without newlines
        else {
          currentBlock.content.push(
            <React.Fragment key={`inline-${index}`}>
              {renderFormattedText(op.insert, op.attributes)}
            </React.Fragment>
          );
        }
      }
      // Handle other embeds like video, formulas, etc.
      else if (typeof op.insert === "object") {
        // Could extend for other embed types like video, formula, etc.
        currentBlock.content.push(
          <div key={`embed-${index}`} className={styles.quillEmbed}>
            [Embedded content]
          </div>
        );
      }

      // Add any remaining content as a paragraph at the end
      if (isLastOp && currentBlock.content.length > 0) {
        const style: React.CSSProperties = {};
        const dir = currentBlock.attributes?.direction;
        
        if (currentBlock.attributes?.align) {
          style.textAlign = currentBlock.attributes.align as any;
        }

        renderedContent.push(
          <div
            key={`final-p-${renderedContent.length}`}
            className={styles.quillParagraph}
            style={style}
            dir={dir}
          >
            {currentBlock.content}
          </div>
        );
      }
    });

    return renderedContent;
  };

  return (
    <div className={styles.content}>
      <ProtectedRoute>
        <div className={styles.quillContent}>{renderQuillContent()}</div>
      </ProtectedRoute>
    </div>
  );
};

export default PostContent;
