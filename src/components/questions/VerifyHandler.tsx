import VerifyAnswerButton from "./VerifyAnswerButton";
import UnverifyAnswerButton from "./UnverifyAnswerButton";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface Props {
  isVerified: boolean;
  commentId: string;
  questionId: string;
  accessible: boolean;
}

const VerifyHandler = ({
  isVerified,
  accessible = false,
  commentId,
  questionId,
}: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  if (currentUser?.user.role === "student" && accessible === false) {
    return null;
  }

  if (isVerified === false) {
    return <VerifyAnswerButton commentId={commentId} questionId={questionId} />;
  }

  return <UnverifyAnswerButton questionId={questionId} />;
};

export default VerifyHandler;