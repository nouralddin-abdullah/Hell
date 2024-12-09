import "../../styles/questions/style.css";
import { profileImage } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Question from "../../components/questions/Question";

const QuestionsPage = () => {
  return (
    <section className="questions-main">
      <div className="container">
        <div className="questions-container">
          {/* asking questions start  */}
          <div className="ask-question-container">
            <img src={profileImage} alt="image" />
            <div>Ask a question...</div>
          </div>
          {/* asking questions end  */}
          {/* posted questions start  */}
          <div className="posted-questions-container">
            <div className="questions-select">
              <div>Recent Posts</div>
              <div className="sorting-filtering">
                <select className="questions-sorting">
                  <option value="recent">Recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="mostLiked">Most Liked</option>
                </select>
                <select className="questions-filtering">
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="notVerified">Not Verified</option>
                </select>
              </div>
            </div>
            <Question isVerified={true} />
            <div className="posted-question">
              <div className="verified-answer">Verified Answer</div>
              <div className="question-publisher">
                <img src={profileImage} alt="image" />
                <div className="question-publisher-fullname">
                  Youssef Kassab
                </div>
              </div>
              <div className="question-content">
                How has digital marketing transformed the way businesses engage
                with consumers, and what strategies are most effective in
                building long-term customer relationships?
              </div>
              <div className="question-info">
                <div className="question-date">12/5/2024</div>
                <div className="question-likes-and-comments">
                  <div className="question-likes">
                    <FontAwesomeIcon className="like-icon" icon={faHeart} />
                    <span className="likes-count">5</span>
                  </div>
                  <div className="question-comments">
                    <FontAwesomeIcon
                      className="comment-icon"
                      icon={faMessage}
                    />
                    <span className="comments-count">5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="posted-question">
              <div className="question-publisher">
                <img src={profileImage} alt="image" />
                <div className="question-publisher-fullname">
                  Youssef Kassab
                </div>
              </div>
              <div className="question-content">
                How has digital marketing transformed the way businesses engage
                with consumers, and what strategies are most effective in
                building long-term customer relationships?
              </div>
              <div className="question-info">
                <div className="question-date">12/5/2024</div>
                <div className="question-likes-and-comments">
                  <div className="question-likes">
                    <FontAwesomeIcon className="like-icon" icon={faHeart} />
                    <span className="likes-count">5</span>
                  </div>
                  <div className="question-comments">
                    <FontAwesomeIcon
                      className="comment-icon"
                      icon={faMessage}
                    />
                    <span className="comments-count">5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="posted-question">
              <div className="question-publisher">
                <img src={profileImage} alt="image" />
                <div className="question-publisher-fullname">
                  Youssef Kassab
                </div>
              </div>
              <div className="question-content">
                How has digital marketing transformed the way businesses engage
                with consumers, and what strategies are most effective in
                building long-term customer relationships?
              </div>
              <div className="question-info">
                <div className="question-date">12/5/2024</div>
                <div className="question-likes-and-comments">
                  <div className="question-likes">
                    <FontAwesomeIcon className="like-icon" icon={faHeart} />
                    <span className="likes-count">5</span>
                  </div>
                  <div className="question-comments">
                    <FontAwesomeIcon
                      className="comment-icon"
                      icon={faMessage}
                    />
                    <span className="comments-count">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* posted questions start  */}
        </div>
      </div>
    </section>
  );
};

export default QuestionsPage;
