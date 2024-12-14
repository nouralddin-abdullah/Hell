import "../../styles/questions/style.css";
import Question from "../../components/questions/Question";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetQuestionsList } from "../../hooks/questions/useGetQuestionsList";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { useState } from "react";
import QuestionsListSkeletons from "../../components/questions/QuestionsListSkeletons";
import Modal from "../../components/common/modal/Modal";
import AddQuestionForm from "../../components/questions/AddQuestionForm";
import Button from "../../components/common/button/Button";
import { useDeleteQuestion } from "../../hooks/questions/useDeleteQuestion";
import toast from "react-hot-toast";

const QuestionsPage = () => {
  const [sort, setSort] = useState("-createdAt");

  const { data: currentUser } = useGetCurrentUser();
  const { data: questions, isPending } = useGetQuestionsList(sort);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // delete logic
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const { mutateAsync, isPending: isDeleting } = useDeleteQuestion();

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await mutateAsync(questionId);
      setIsDeleteModalOpen(false);
      toast("Question Deleted");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <PageWrapper>
      <section className="questions-main">
        <div className="container">
          <div className="questions-container">
            {/* asking questions start  */}
            <div
              className="ask-question-container"
              onClick={() => setIsModalOpen(true)}
            >
              <img src={currentUser?.user.photo} alt="image" />
              <div>Ask a question...</div>
            </div>
            {/* asking questions end  */}

            {/* posted questions start  */}
            <div className="posted-questions-container">
              <div className="questions-select">
                <div>Recent Posts</div>
                <div className="sorting-filtering">
                  <select
                    onChange={(e) => setSort(e.target.value)}
                    className="questions-sorting"
                  >
                    <option value="-createdAt">Recent</option>
                    <option value="createdAt">Oldest</option>
                    <option value="likes">Most Liked</option>
                  </select>
                  <select className="questions-filtering">
                    <option value="all">All</option>
                    <option value="verified">Verified</option>
                    <option value="notVerified">Not Verified</option>
                  </select>
                </div>
              </div>

              {/* handle loading */}
              {isPending && <QuestionsListSkeletons />}

              {/* posted questions start  */}
              {questions?.map((question) => (
                <Question
                  attachment={question.attachment}
                  content={question.content}
                  stats={question.stats}
                  timestamps={question.timestamps}
                  user={question.user}
                  verifiedAnswer={question.verifiedAnswer}
                  key={question.id}
                  id={question.id}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  setSelectedQuestion={setSelectedQuestion}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddQuestionForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h3 style={{ textAlign: "center" }}>
          Are You Sure You Want To Delete This Post ?
        </h3>
        <Button
          isLoading={isDeleting}
          onClick={() => handleDeleteQuestion(selectedQuestion)}
          style={{ margin: "3rem auto 0.5rem" }}
        >
          Confirm
        </Button>
      </Modal>
    </PageWrapper>
  );
};

export default QuestionsPage;
