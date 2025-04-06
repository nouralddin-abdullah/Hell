// import { TailSpin } from "react-loader-spinner";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import ReusableChat from "../../components/chat/ReusableChat";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <PageWrapper>
        <ReusableChat />
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default ChatPage;
