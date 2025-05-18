import VerifyAnswerButton from "./VerifyAnswerButton";
import UnverifyAnswerButton from "./UnverifyAnswerButton";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";

interface Props {
  isVerified: boolean;
  commentId: string;
  questionId: string;
  accessible: boolean;
  verifiedBy?: "instructor" | "author" | "group-leader";
}

const VerifyHandler = ({
  isVerified,
  accessible = false,
  commentId,
  questionId,
  verifiedBy,
}: Props) => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser) {
    return null;
  }

  const isInstructor = currentUser.user.role === "instructor";
  const isGroupLeader = currentUser.user.role === "group-leader";
  const isQuestionAuthor = accessible;

  // Determine if user can verify answers
  const canVerify = isInstructor || isGroupLeader || isQuestionAuthor;

  // If user has no verification privileges, don't show any buttons
  if (!canVerify) {
    return null;
  }

  // Handle unverify permissions
  if (isVerified) {
    // If verified by instructor, only instructors can unverify
    if (verifiedBy === "instructor" && !isInstructor) {
      return null;
    }

    return <UnverifyAnswerButton questionId={questionId} />;
  }

  // Show verify button to eligible users
  return <VerifyAnswerButton commentId={commentId} questionId={questionId} />;
};

export default VerifyHandler;
