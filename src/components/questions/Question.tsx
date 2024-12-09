import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { profileImage } from "../../assets";

const Question = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <div className="posted-question">
      {isVerified && <div className="verified-answer">Verified Answer</div>}
      <div className="question-publisher">
        <img src={profileImage} alt="image" />
        <div className="question-publisher-fullname">Youssef Kassab</div>
      </div>
      <div className="question-content">
        How has digital marketing transformed the way businesses engage with
        consumers, and what strategies are most effective in building long-term
        customer relationships?
      </div>
      <div className="question-info">
        <div className="question-date">12/5/2024</div>
        <div className="question-likes-and-comments">
          <div className="question-likes">
            <FontAwesomeIcon className="like-icon" icon={faHeart} />
            <span className="likes-count">5</span>
          </div>
          <div className="question-comments">
            <FontAwesomeIcon className="comment-icon" icon={faMessage} />
            <span className="comments-count">5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
