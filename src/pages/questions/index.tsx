import "../../styles/questions/style.css";
import Question from "../../components/questions/Question";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useGetQuestionsList } from "../../hooks/questions/useGetQuestionsList";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import React, { useEffect, useState } from "react";
import QuestionsListSkeletons from "../../components/questions/QuestionsListSkeletons";
import Modal from "../../components/common/modal/Modal";
import AddQuestionForm from "../../components/questions/AddQuestionForm";
import Button from "../../components/common/button/Button";
import { useDeleteQuestion } from "../../hooks/questions/useDeleteQuestion";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import { useGetAllCourses } from "../../hooks/course/useGetAllCourses";

interface Props {
  bookmarks?: boolean;
  userId?: string;
}

const QuestionsPage = ({ bookmarks = false, userId = "" }: Props) => {
  const { data: coursesList } = useGetAllCourses();

  const [sort, setSort] = useState("-createdAt");
  const [answered, setAnswered] = useState("");
  const [category, setCategory] = useState("");
  const [params, setParams] = useState("sort=-createdAt");
  const { ref, inView } = useInView({
    threshold: 0.5, // Trigger when element is 50% visible
  });

  useEffect(() => {
    setParams(
      `sort=${sort}${answered && `&answered=${answered}`}${
        category && `&category=${category}`
      }`
    );
  }, [sort, answered, category]);

  const { data: currentUser } = useGetCurrentUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetQuestionsList(params, bookmarks, userId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    <ProtectedRoute>
      <PageWrapper>
        <section className="questions-main">
          <div className="container">
            <div className="questions-container">
              {/* Ask question section */}
              {currentUser && !bookmarks && !userId && (
                <div
                  className="ask-question-container"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img src={currentUser?.user.photo} alt="image" />
                  <div>Ask a question...</div>
                </div>
              )}

              <div className="posted-questions-container">
                {/* Sorting/filtering section */}
                {!bookmarks && !userId && (
                  <div className="questions-select">
                    <div className="hide-on-small">Recent Posts</div>
                    <div className="sorting-filtering">
                      <select
                        onChange={(e) => setSort(e.target.value)}
                        className="questions-sorting"
                      >
                        <option value="-createdAt">Recent</option>
                        <option value="createdAt">Oldest</option>
                        <option value="-likes">Most Liked</option>
                      </select>

                      <select
                        onChange={(e) => setAnswered(e.target.value)}
                        className="questions-filtering"
                      >
                        <option value="">All</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                      </select>

                      {currentUser?.user.role !== "instructor" && (
                        <select
                          style={{ maxWidth: "150px" }}
                          onChange={(e) => setCategory(e.target.value)}
                          className="questions-filtering"
                        >
                          <option value="">All Courses</option>
                          <option value="General">General</option>
                          {coursesList?.map((course) => (
                            <option value={course._id}>
                              {course.courseName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {isPending && <QuestionsListSkeletons />}

                {/* Error state */}
                {isError && (
                  <div className="text-center text-red-500">
                    Error loading questions. Please try again.
                  </div>
                )}

                {/* Questions list */}
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.questions.map((question) => (
                      <Question
                        key={question.id}
                        {...question}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        setSelectedQuestion={setSelectedQuestion}
                        verifiedBy={question.verifiedBy}
                      />
                    ))}
                  </React.Fragment>
                ))}

                {isFetchingNextPage && <QuestionsListSkeletons />}

                {/* Infinite scroll trigger */}
                <div
                  ref={ref}
                  style={{ height: "20px", margin: "20px 0" }}
                ></div>
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
    </ProtectedRoute>
  );
};

export default QuestionsPage;
