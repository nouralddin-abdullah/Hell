import "../../styles/assignments/assignment-doctor-view-two.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { pdfIcon } from "../../assets";
import { profileImage } from "../../assets";
import ProtectedRoute from "../../components/common/protected Route/ProtectedRoute";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";

const SubmissionInstructorView = () => {
  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="assignment2-page">
          <div className="assignment2-container">
            <div className="assignment2-details-and-filtering">
              <div className="assignment2-details">
                <h3 className="assignment2-title">Statistics Issue 3.44</h3>
                <p className="assignment2-desc">
                  Solve Issue 3.44 from the book in a paper and send it.
                </p>
              </div>
              <div className="assignment2-filtering">
                <div className="assignment2-delete">
                  <FontAwesomeIcon icon={faTrashCan} />
                  <p>Delete</p>
                </div>
                <div className="assignment2-group-status-filter">
                  <select className="assignment2-group-filter">
                    <option value="" hidden selected>
                      Filter by Group
                    </option>
                    <option value="all">All</option>
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                  <select className="assignment2-status-filter">
                    <option value="" hidden selected>
                      Filter by Status
                    </option>
                    <option value="all">All</option>
                    <option value="finished">Finished</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="assignment2-table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Group</th>
                    <th>Submitted At</th>
                    <th>Attachment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status pending">● Pending</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status pending">● Pending</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status pending">● Pending</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status pending">● Pending</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="assignment2-student-name">
                      <img
                        style={{ width: "40px", borderRadius: "50%" }}
                        src={profileImage}
                        alt=""
                      />
                      <p>Youssef Ahmed Kassab</p>
                    </td>
                    <td>D</td>
                    <td>Friday</td>
                    <td>
                      <div className="student-attachment">
                        <img width={22} src={pdfIcon} alt="PDF" />
                        <a href="#">View Attachment</a>
                      </div>
                    </td>
                    <td>
                      <div className="status finished">● Finished</div>
                    </td>
                  </tr>
                  {/* Add more rows here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
};

export default SubmissionInstructorView;
