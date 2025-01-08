import "../../styles/questions/chosen-question.css";
import { useGetQuestion } from "../../hooks/questions/useGetQuestion";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { TailSpin } from "react-loader-spinner";
import QuestionContent from "../../components/questions/QuestionContent";
import AddCommentForm from "../../components/questions/AddCommentForm";
import Modal from "../../components/common/modal/Modal";
import Button from "../../components/common/button/Button";
import { useDeleteQuestionsComment } from "../../hooks/questions/useDeleteQuetionsComment";
import { useState } from "react";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import CommentSection from "../../components/questions/CommentSection";

const ChosenQuestionPage = () => {
  const { id } = useParams();
  const { data: currentUser } = useGetCurrentUser();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending } =
    useGetQuestion(id);

  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);
  const [selectedComment, setSelectedComment] = useState("");

  const { mutateAsync, isPending: isDeleting } = useDeleteQuestionsComment(
    // @ts-ignore
    id,
    selectedComment
  );

  const handleDeleteComment = async () => {
    try {
      await mutateAsync();
      setIsDeleteCommentModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isPending) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
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
    );
  }

  const question = data?.pages[0]?.data.question;

  return (
    <PageWrapper>
      <section className="questions-main">
        <div className="container">
          <div className="questions-container">
            <div className="posted-questions-container">
              {question && (
                <QuestionContent
                  attachment={question?.attachment}
                  content={question?.content}
                  id={question?.id}
                  stats={question?.stats}
                  user={question?.user}
                  timestamps={question?.timestamps}
                  // @ts-ignore
                  verifiedAnswer={question.verifiedAnswer}
                />
              )}
              <div className="all-comments-section">
                {/* <div className="see-more-comments">See more comments</div> */}
                {question && (
                  <CommentSection
                    question={question}
                    setIsDeleteCommentModalOpen={setIsDeleteCommentModalOpen}
                    setSelectedComment={setSelectedComment}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    data={data}
                  />
                )}
              </div>
              {currentUser && <AddCommentForm />}
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isDeleteCommentModalOpen}
        onClose={() => setIsDeleteCommentModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Comment?
        </h3>
        <Button
          isLoading={isDeleting}
          onClick={handleDeleteComment}
          style={{ margin: "2rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </PageWrapper>
  );
};

export default ChosenQuestionPage;
