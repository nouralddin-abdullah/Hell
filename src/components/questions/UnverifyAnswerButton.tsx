import { useUnverifyAnswer } from "../../hooks/questions/useUnverifyAnswer";

interface Props {
  questionId: string;
}

const UnverifyAnswerButton = ({ questionId = "" }: Props) => {
  const { mutateAsync, isPending } = useUnverifyAnswer(questionId);

  const handleClick = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={() => handleClick()} className="unverify-button">
      {isPending ? "Unverifying..." : "Unverify"}
    </button>
  );
};

export default UnverifyAnswerButton;
