import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import "../../styles/home/style.css";
import SubjectsDetails from "../../components/home/SubjectsDetails";
import ScheduleContainer from "../../components/home/ScheduleContainer";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import InstructorDashboard from "../../components/common/instructor-dashboard/InstructorDashboard";
import PageLoading from "../../components/common/loading/PageLoading";

export default function HomePage() {
  const { data: currentUser, isPending: isLoading } = useGetCurrentUser();

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="home">
          <>
            {isLoading ? (
              <PageLoading />
            ) : currentUser?.user.role === "instructor" ? (
              <InstructorDashboard />
            ) : (
              <div className="container">
                <SubjectsDetails />
                <ScheduleContainer />
              </div>
            )}
          </>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
}
