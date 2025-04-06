import React, { useState } from "react";
import { useGetQuestionsList } from "../../hooks/questions/useGetQuestionsList";
import Question from "../questions/Question";
import { TailSpin } from "react-loader-spinner";

const BookmarksList = () => {
  const { data: questionsList, isPending } = useGetQuestionsList(
    "sort=-createdAt",
    true
  );

  // @ts-ignore
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // @ts-ignore
  const [selectedQuestion, setSelectedQuestion] = useState("");

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
      </div>
    </div>
  );
};

export default BookmarksList;
