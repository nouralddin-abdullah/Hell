import "../../styles/scoreboard/style.css";
import { scoreboardCrown } from "../../assets";
import { useGetLeaderboard } from "../../hooks/leaderboard/useGetLeaderboard";
import { Link } from "react-router-dom";
import { baseURL } from "../../constants/baseURL";
import PageWrapper from "../../components/common/page wrapper/PageWrapper";
import { TailSpin } from "react-loader-spinner";
import Avatar from "../../components/common/avatar/Avatar";

const ScoreboardPage = () => {
  const { data: leaderboardList, isPending } = useGetLeaderboard();

  if (isPending) {
    return (
      <section
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TailSpin
          visible={true}
          height="200"
          width="200"
          color="#6366f1"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </section>
    );
  }

  // @ts-ignore
  if (leaderboardList?.length < 4) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>No Data</h1>
      </div>
    );
  }

  return (
    <PageWrapper>
      <section className="scoreboard-main bg-scoreboard">
        {/* start top three ranking */}
        <div className="scoreboard-top-three">
          <div className="container">
            <div className="scoreboard-topThree-container">
              {leaderboardList && (
                <>
                  {/* Rank 2 */}
                  <div className="user-rank2-container">
                    <div className="scoreboard-image-container">
                      <img
                        src={`${baseURL}/profilePics/${leaderboardList[1].photo}`}
                        alt="Rank2"
                        className="scoreboard-user-image"
                      />
                    </div>
                    <div className="scoreboard-userinfo">
                      <p className="scoreboard-userFullname">
                        {leaderboardList[1].fullName}
                      </p>
                      <p className="scoreboard-user-points">
                        {leaderboardList[1].points}
                      </p>
                      <Link
                        to={`/profile/${leaderboardList[1].username}`}
                        className="scoreboard-username"
                      >
                        @{leaderboardList[1].username}
                      </Link>
                    </div>
                  </div>

                  {/* Rank 1 */}
                  <div className="user-rank1-container">
                    <div className="scoreboard-image-container">
                      <img
                        src={scoreboardCrown}
                        alt="crown"
                        className="crown-image"
                      />
                      <img
                        src={`${baseURL}/profilePics/${leaderboardList[0].photo}`}
                        alt="Rank1"
                        className="scoreboard-user-image"
                      />
                    </div>
                    <div className="scoreboard-userinfo">
                      <p className="scoreboard-userFullname">
                        {leaderboardList[0].fullName}
                      </p>
                      <p className="scoreboard-user-points">
                        {leaderboardList[0].points}
                      </p>
                      <Link
                        to={`/profile/${leaderboardList[0].username}`}
                        className="scoreboard-username"
                      >
                        @{leaderboardList[0].username}
                      </Link>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="user-rank3-container">
                    <div className="scoreboard-image-container">
                      <img
                        src={`${baseURL}/profilePics/${leaderboardList[2].photo}`}
                        alt="Rank3"
                        className="scoreboard-user-image"
                      />
                    </div>
                    <div className="scoreboard-userinfo">
                      <p className="scoreboard-userFullname">
                        {leaderboardList[2].fullName}
                      </p>
                      <p className="scoreboard-user-points">
                        {leaderboardList[2].points}
                      </p>
                      <Link
                        to={`/profile/${leaderboardList[2].username}`}
                        className="scoreboard-username"
                      >
                        @{leaderboardList[2].username}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* start top three ranking */}
        {/* start the rest of the ranking */}

        <div className="scoreboard-rest-of-ranks">
          <div className="container">
            <div className="rest-of-ranks-container">
              {leaderboardList
                ?.slice(3, leaderboardList.length)
                .map((user, idx) => (
                  <div className="scoreboard-rank">
                    <div className="regular-rank-userinfo">
                      {/* <img
                        src={`${baseURL}/profilePics/${user.photo}`}
                        alt=""
                      /> */}
                      <Avatar
                        photo={`${baseURL}/profilePics/${user.photo}`}
                        userFrame={user.userFrame || "null"}
                        animated
                      />
                      <div className="regular-rank-name-and-user">
                        <p className="regular-rank-userFullname">
                          {user.fullName}
                        </p>
                        <Link
                          style={{ color: "#fff" }}
                          to={`/profile/${user.username}`}
                          className="regular-rank-username"
                        >
                          @{user.username}
                        </Link>
                      </div>
                    </div>
                    <div className="regular-rank-points">
                      <p className="regular-rank-user-points">{user.points}</p>
                      <p className="regular-rank-user-rank">{idx + 4}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* end the rest of the ranking */}
      </section>
    </PageWrapper>
  );
};

export default ScoreboardPage;
