import { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import "./style.css";

interface UploadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
}

const randomFacts = [
  "The idea of building BISHell actually came up two years ago.",
  "Youssef Kassab is the team's oldest member (born in December 2002).",
  "The BISHell team consists of 6 members: 4 frontend (one of them does a shitty ui ux work), 1 backend & 1 fullstack",
  "While being academically impressive, Nouraldin and Ghassam also managed to be even more successful in their professional lives.",
  "While being liked by users, BISHell is still disliked by some organizers in the BIS management department (no one cares cry more).",
  "BISHell actually supports notification you just have to enable it from the browser settings unless you use safari",
  "Youssef Qadry's Dumbbell bench press PR is 35KG each.",
  "Despite being from a university located at ismailia, onlytwo out of six members are from ismailia.",
  "It is expected to have the chance to get instructors to use BISHell in the future.",
  "We almost gave up on BISHell to build a website that lets students share who they have a crush on (Hassany's GF said no).",
  "BISHell might be stressful at times, but your support keeps us working with the biggest smile.",
  "Nouraldin is actually crazy, he's either not studying at all or studying for so long that he forgets to eat.",
  "We actully broke the questions page 10 minutes before graduation project presentation (we fixed it tho).",
  "Ghassam actually made an impressive achevment by losing 20+KG's in the span of 3-4 months",
  "Hany is actually dangerous if you're not on his side.",
];

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Change fact every 5 seconds
    const interval = setInterval(() => {
      setCurrentFactIndex(() => Math.floor(Math.random() * randomFacts.length));
    }, 7000);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="upload-progress-modal">
        <h2 style={{ paddingTop: "1rem" }}>Uploading Question</h2>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        <div className="random-fact-container">
          <h3>Did you know?</h3>
          <p>{randomFacts[currentFactIndex]}</p>
        </div>
      </div>
    </Modal>
  );
};

export default UploadProgressModal;
