import Modal from "../modal/Modal";
import JoinUsPage from "../../../pages/auth/join";
import useJoinUsStore from "../../../store/joinModaStore";

const JoinUsPopup = () => {
  const isOpen = useJoinUsStore((state) => state.isOpen);
  const changeOpenState = useJoinUsStore((state) => state.changeOpenState);

  return (
    <Modal isOpen={isOpen} onClose={() => changeOpenState(false)}>
      <JoinUsPage />
    </Modal>
  );
};

export default JoinUsPopup;
