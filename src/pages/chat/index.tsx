// import { TailSpin } from "react-loader-spinner";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import ReusableChat from "../../components/chat/ReusableChat";

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <ReusableChat />
    </ProtectedRoute>
  );
};

export default ChatPage;
