import "../../styles/questions/chosen-question.css";
import { profileImage } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import Question from "../../components/questions/Question";

const ChosenQuestionPage = () => {
  return (
    <section className="questions-main">
      <div className="container">
        <div className="questions-container">
          <div className="posted-questions-container">
            <Question isVerified={true} />
            <div className="all-comments-section">
              <div className="see-more-comments">See more comments</div>
              <div className="question-comments-and-replies">
                <div className="comment-section">
                  <div className="question-comment">
                    <img src={profileImage} alt="profileImage" />
                    <div className="question-comment-content">
                      <div className="comment-time">1:00 PM</div>
                      <div className="comment-user-fullname">
                        Youssef Kassab
                      </div>
                      <div className="comment-text">
                        Digital marketing has revolutionized the relationship
                        between businesses and consumers by enabling more
                        personalized, immediate, and interactive engagement.
                        Unlike traditional marketing
                      </div>
                      <div className="comment-info">
                        <div className="comment-date">12/6/2024</div>
                        <div className="comment-likes-and-comments">
                          <div className="comment-likes">
                            <FontAwesomeIcon
                              className="like-icon"
                              icon={faHeart}
                            />
                            <span>12</span>
                          </div>
                          <div className="comment-replies">
                            <FontAwesomeIcon
                              className="comment-icon"
                              icon={faMessage}
                            />
                            <span>12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="comment-replies-section">
                    <div className="question-comment">
                      <img src={profileImage} alt="profileImage" />
                      <div className="question-comment-content">
                        <div className="comment-time">1:00 PM</div>
                        <div className="comment-user-fullname">
                          Youssef Kassab
                        </div>
                        <div className="comment-text">
                          Digital marketing has revolutionized the relationship
                          between businesses and consumers by enabling more
                          personalized, immediate, and interactive engagement.
                          Unlike traditional marketing
                        </div>
                        <div className="comment-info">
                          <div className="comment-date">12/6/2024</div>
                          <div className="comment-likes-and-comments">
                            <div className="comment-likes">
                              <FontAwesomeIcon
                                className="like-icon"
                                icon={faHeart}
                              />
                              <span>12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="post-comment">
              <img src={profileImage} alt="profileImage" />
              <div className="textarea-wrapper">
                <textarea
                  name="comment"
                  id="comment"
                  placeholder="Add a comment"
                ></textarea>
                <FontAwesomeIcon className="upload-image" icon={faFileImage} />
              </div>
              <button className="posting-comment-btn">Post</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChosenQuestionPage;
