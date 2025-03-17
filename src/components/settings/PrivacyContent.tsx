import Toggle from "react-toggle";
import { useGetCurrentUser } from "../../hooks/auth/useGetCurrentUser";
import { useState, useEffect } from "react";
import { useUpdateUserData } from "../../hooks/users/useUpdateUserData";
import PasswordChangeForm from "../auth/PasswordChangeForm";

const PrivacyContent = () => {
  const { data: currentUser } = useGetCurrentUser();

  // Initialize state only once when component mounts
  const [isUserPrivate, setIsUserPrivate] = useState(
    currentUser?.user.isPrivate
  );

  useEffect(() => {
    if (currentUser) {
      setIsUserPrivate(currentUser.user.isPrivate);
    }
  }, [currentUser?.user.id]);

  const { mutateAsync } = useUpdateUserData();

  const toggleUserPrivacy = async () => {
    const newState = !isUserPrivate;
    setIsUserPrivate(newState);

    const formData = new FormData();
    formData.append("isPrivate", newState ? "true" : "false");

    try {
      await mutateAsync(formData);
    } catch (error) {
      // Revert on error
      setIsUserPrivate(!newState);
      console.error("Failed to update privacy setting", error);
    }
  };

  return (
    <div>
      <div className="settings-privacy-item">
        <div className="privacy-text">
          <h3>Private Account</h3>
          <span>
            By enabling this your account data such as (profile picture,
            followers, following) will be unaccessable to users you don't follow
          </span>
        </div>

        <Toggle checked={isUserPrivate} onChange={toggleUserPrivacy} />
      </div>

      <div style={{ marginTop: "2rem", width: "60%" }}>
        <div className="privacy-text">
          <h3 style={{ marginBottom: "1rem" }}>Change Password</h3>
        </div>

        <PasswordChangeForm />
      </div>
    </div>
  );
};

export default PrivacyContent;
