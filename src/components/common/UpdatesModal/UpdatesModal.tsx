import "./style.css";
import { useState, useEffect, useRef } from "react";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import {
  attachMaterialsToComments,
  postGhassam,
  postsList,
  voiceRecorder,
} from "../../../assets";
import useAuthStore from "../../../store/authTokenStore";

interface UpdateContent {
  image: string;
  title: string;
  description: string;
}

const updateContents: UpdateContent[] = [
  {
    image: postsList,
    title: "New Post Page.",
    description: `Introducing our brand-new Posts Page!
Enjoy a more organized experience with all your posts neatly gathered in one place
completely separate from questions.`,
  },
  {
    image: postGhassam,
    title: "No Limits!",
    description: `Unleash your creativity with our powerful rich text editor
    designed to give you complete freedom of expression.`,
  },
  {
    image: voiceRecorder,
    title: "Voice Notes",
    description: "You can now comment/reply with a voice note",
  },
  {
    image: attachMaterialsToComments,
    title: "Attach Material",
    description: `You can now add any files from the website's materials in just few seconds`,
  },
];

const UpdatesModal = () => {
  const { token } = useAuthStore();

  const [hasSeenUpdates, setHasSeenUpdates] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [_, setAnimationDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLastContent = currentIndex === updateContents.length - 1;

  useEffect(() => {
    // Check if user has already seen the updates
    const hasSeenUpdatesStorage = localStorage.getItem(
      "BISHell-11-may-update-2025"
    );
    if (hasSeenUpdatesStorage === "true") {
      setHasSeenUpdates(true);
    }
  }, []);

  const handleNext = () => {
    if (isLastContent) {
      // If we're on the last content, mark as seen and close
      localStorage.setItem("BISHell-11-may-update-2025", "true");
      setHasSeenUpdates(true);
    } else if (!isAnimating) {
      // Start animation
      setIsAnimating(true);
      setAnimationDirection("right");

      // Apply animation class
      if (contentRef.current) {
        contentRef.current.className = "content-slide slide-out-to-left";
      }

      // Wait for animation to complete before changing content
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // Apply entrance animation
        if (contentRef.current) {
          contentRef.current.className = "content-slide slide-in-from-right";
        }

        // End animation state
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.className = "content-slide";
          }
          setIsAnimating(false);
        }, 400);
      }, 400);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== 0 && !isAnimating) {
      // Start animation
      setIsAnimating(true);
      setAnimationDirection("left");

      // Apply animation class
      if (contentRef.current) {
        contentRef.current.className = "content-slide slide-out-to-right";
      }

      // Wait for animation to complete before changing content
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex - 1);

        // Apply entrance animation
        if (contentRef.current) {
          contentRef.current.className = "content-slide slide-in-from-left";
        }

        // End animation state
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.className = "content-slide";
          }
          setIsAnimating(false);
        }, 400);
      }, 400);
    }
  };

  const handleClose = () => {
    localStorage.setItem("BISHell-11-may-update-2025", "true");
    setHasSeenUpdates(true);
  };

  if (hasSeenUpdates || !token) return null; // Don't show if already seen

  const currentContent = updateContents[currentIndex];

  return (
    <Modal isOpen={!hasSeenUpdates} onClose={handleClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          padding: "1rem",
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            New Update!
          </h1>
        </div>

        <div className="content-container">
          <div ref={contentRef} className="content-slide">
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                }}
              >
                {currentContent.title}
              </h2>
              <p style={{ fontSize: "1rem", whiteSpace: "pre-line" }}>
                {currentContent.description}
              </p>
            </div>

            <img
              src={currentContent.image}
              alt={currentContent.title}
              style={{
                width: "350px",
                height: "auto",
                margin: "2rem 0",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* Progress indicators */}
          <div style={{ display: "flex", gap: "0.5rem", marginRight: "1rem" }}>
            {updateContents.map((_, index) => (
              <div
                key={index}
                className="dot"
                style={{
                  backgroundColor:
                    index === currentIndex ? "#4CAF50" : "#E0E0E0",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              className="nav-button"
              style={{
                background: "gray",
                color: "#fff",
                opacity: currentIndex === 0 || isAnimating ? 0.5 : 1,
                cursor:
                  currentIndex === 0 || isAnimating ? "not-allowed" : "pointer",
              }}
              onClick={handlePrev}
              disabled={currentIndex === 0 || isAnimating}
            >
              Prev
            </Button>

            <Button
              className="nav-button"
              onClick={handleNext}
              disabled={isAnimating}
              style={{
                opacity: isAnimating ? 0.7 : 1,
                cursor: isAnimating ? "not-allowed" : "pointer",
              }}
            >
              {isLastContent ? "Dismiss" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdatesModal;
