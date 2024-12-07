import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import "../../styles/home/style.css";
import SubjectsDetails from "../../components/home/SubjectsDetails";
import ScheduleContainer from "../../components/home/ScheduleContainer";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="home">
          <div className="container">
            <SubjectsDetails />
            <ScheduleContainer />
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
}