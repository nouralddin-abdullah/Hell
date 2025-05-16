import React, { useState } from "react";
import { useGetQuestionsList } from "../../hooks/questions/useGetQuestionsList";
import Question from "../questions/Question";
import { TailSpin } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";

const BookmarksList = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const {
    data: questionsList,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetQuestionsList("sort=-createdAt", true);

  // @ts-ignore
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // @ts-ignore
  const [selectedQuestion, setSelectedQuestion] = useState("");

  // Trigger next page fetch when the loader comes into view
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="questions-main" style={{ padding: "2rem 0" }}>
      <div
        className="questions-container"
        style={{
          background: "var(--background)",
          borderRadius: "1rem",
          padding: "0.5rem",
        }}
      >
        {isPending && (
          <div className="loading-container">
            <TailSpin
              visible={true}
              height="200"
              width="200"
              color="#6366f1"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </div>
        )}

        {questionsList?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.questions.map((question) => (
              <Question
                key={question.id}
                {...question}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setSelectedQuestion={setSelectedQuestion}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Loader reference for intersection observer */}
        {(hasNextPage || isFetchingNextPage) && (
          <div
            ref={ref}
            className="loading-more-container"
            style={{ padding: "1rem", textAlign: "center" }}
          >
            {isFetchingNextPage && (
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#6366f1"
                ariaLabel="tail-spin-loading"
                radius="1"
              />
            )}
          </div>
        )}

        {!hasNextPage &&
          questionsList?.pages &&
          questionsList.pages[0]?.questions &&
          questionsList.pages[0].questions.length > 0 && (
            <div
              className="no-more-questions"
              style={{
                padding: "1rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              No more bookmarks to load
            </div>
          )}

        {!isPending &&
          questionsList?.pages &&
          questionsList.pages[0]?.questions &&
          questionsList.pages[0].questions.length === 0 && (
            <div
              className="no-bookmarks"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              You don't have any bookmarked questions yet
            </div>
          )}
      </div>
    </div>
  );
};

export default BookmarksList;
