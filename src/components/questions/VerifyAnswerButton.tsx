import { useVerifyAnswer } from "../../hooks/questions/useVerifyAnswer";

interface Props {
  commentId: string;
  questionId: string;
}

const VerifyAnswerButton = ({ commentId = "", questionId = "" }: Props) => {
  const { mutateAsync, isPending } = useVerifyAnswer(questionId, commentId);

  const handleClick = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={() => handleClick()} className="verify-button">
      {isPending ? "Verifying..." : "Verify"}
    </button>
  );
};

export default VerifyAnswerButton;
