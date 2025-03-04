import Modal from "../modal/Modal";
import { useGreetingStore } from "../../../store/ramadanStore";
import { useGetCurrentUser } from "../../../hooks/auth/useGetCurrentUser";
import { lamp } from "../../../assets";
import Button from "../button/Button";

const RamadanModal = () => {
  const { hasSeenGreeting, markAsSeen } = useGreetingStore();

  const { data: currentUser } = useGetCurrentUser();

  if (hasSeenGreeting || !currentUser?.user) return null; // Don't show if already seen or user not logged in
  return (
    <Modal isOpen={!hasSeenGreeting} onClose={markAsSeen}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <img src={lamp} style={{ width: "150px" }} />
        <div>
          <p dir="rtl" style={{ textAlign: "center" }}>
            رمضان كريم 🌙
          </p>
          <p dir="rtl" style={{ textAlign: "center" }}>
            تيم BISHell يهنئكم بحلول شهر رمضان المبارك و كل عام وأنتم بخير. ✨
          </p>
        </div>
        <Button
          onClick={markAsSeen}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Dismiss
        </Button>
      </div>
    </Modal>
  );
};

export default RamadanModal;
