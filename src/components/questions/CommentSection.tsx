import React, { useEffect, useRef } from "react";
import Comment from "./Comment";
import { motion } from "framer-motion";
import { ChosenQuestion } from "../../types/Question";
import { TailSpin } from "react-loader-spinner";

interface Props {
  question: ChosenQuestion;
  setIsDeleteCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedComment: React.Dispatch<React.SetStateAction<string>>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  data: any;
}

const CommentSection = ({
  question,
  setIsDeleteCommentModalOpen,
  setSelectedComment,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  data,
}: Props) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="question-comments-and-replies">
      <div className="comment-section">
        {question?.verifiedAnswer && (
          <div>
            <Comment
              key={question?.verifiedAnswer?.id}
              attachment={question?.verifiedAnswer?.attachment}
              content={question?.verifiedAnswer?.content}
              createdAt={question?.verifiedAnswer?.createdAt}
              stats={question?.verifiedAnswer?.stats}
              user={question?.verifiedAnswer?.user}
              id={question?.verifiedAnswer?.id}
              replies={question?.verifiedAnswer?.replies}
              openDeleteComment={() => setIsDeleteCommentModalOpen(true)}
              setSelectedComment={setSelectedComment}
              isVerified={true}
              asker={question.user.username}
            />
          </div>
        )}

        {
          // @ts-ignore

          data?.pages?.map((page, pageIndex) =>
            page.data.question.comments.data.map(
              (comment: any, idx: number) => (
                <motion.span
                  key={comment.id}
                  transition={{ duration: 0.3, delay: idx * 0.3 }}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                >
                  <Comment
                    attachment={comment.attachment}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    stats={comment.stats}
                    user={comment.user}
                    id={comment.id}
                    replies={comment.replies}
                    openDeleteComment={() => setIsDeleteCommentModalOpen(true)}
                    setSelectedComment={setSelectedComment}
                    isVerified={false}
                    asker={question.user.username}
                  />
                </motion.span>
              )
            )
          )
        }

        <div ref={loaderRef} className="h-10" />
        {isFetchingNextPage && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <h1></h1>
            <TailSpin
              visible={true}
              height="50"
              width="50"
              color="#6366f1"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
