import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import SubmissionStudentView from "../../components/submissions/SubmissionStudentView";
import SubmissionInstructorView from "../../components/submissions/SubmissionInstructorView";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { TailSpin } from "react-loader-spinner";

const SubmissionsPage = () => {
  const { data: currentUser, isPending } = useGetCurrentUser();

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
  } else if (currentUser?.user.role === "instructor") {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <SubmissionInstructorView />
        </PageWrapper>
      </ProtectedRoute>
    );
  } else {
    return (
      <ProtectedRoute>
        <PageWrapper>
          <SubmissionStudentView />
        </PageWrapper>
      </ProtectedRoute>
    );
  }
};

export default SubmissionsPage;
