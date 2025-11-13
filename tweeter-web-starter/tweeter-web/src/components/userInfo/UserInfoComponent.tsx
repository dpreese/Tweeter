import "./UserInfoComponent.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { UserInfoView, UserInfoPresenter } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayed } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  // if (!displayedUser && currentUser) {
  //   setDisplayed(currentUser);
  // }
  useEffect(() => {
    if (!displayedUser && currentUser) {
      setDisplayed(currentUser);
    }
  }, [displayedUser, currentUser, setDisplayed]);

  // View adapter for presenter
  const view: UserInfoView = useMemo(() => ({
    setBusy: setIsLoading,
    setIsFollower: setIsFollower,
    setCounts: (followers, followees) => { setFollowerCount(followers); setFolloweeCount(followees); },
    showInfo: (msg, sticky) => displayInfoMessage(msg, sticky ? 0 : 3), // return id
    dismissMessage: (id) => deleteMessage(id),
    showError: (msg) => displayErrorMessage(msg),
  }), [displayErrorMessage, displayInfoMessage, deleteMessage]);

  const presenter = useMemo(() => new UserInfoPresenter(view), [view]);

  // Initialize whenever displayed user changes
  useEffect(() => {
    if (authToken && currentUser && displayedUser) {
      void presenter.init(authToken as AuthToken, currentUser as User, displayedUser as User);
    }
  }, [presenter, authToken, currentUser, displayedUser]);

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    if (!currentUser) return;
    setDisplayed(currentUser);
    navigate(`${getBaseUrl()}/${currentUser.alias}`);
  };

  const onFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (authToken && currentUser && displayedUser) {
      await presenter.follow(authToken, currentUser, displayedUser);
    }
  };

  const onUnfollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (authToken && currentUser && displayedUser) {
      await presenter.unfollow(authToken, currentUser, displayedUser);
    }
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link to={`./${currentUser.alias}`} onClick={switchToLoggedInUser}>
                    logged in user
                  </Link>
                </p>
              )}
              <h2><b>{displayedUser.name}</b></h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>Followees: {followeeCount} Followers: {followerCount}</div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={onUnfollow}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={onFollow}
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
