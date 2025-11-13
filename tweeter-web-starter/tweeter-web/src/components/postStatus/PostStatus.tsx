import "./PostStatus.css";
import { useMemo, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusView, PostStatusPresenter } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayInfoMessage, deleteMessage, displayErrorMessage } = useMessageActions();
  const { currentUser, authToken } = useUserInfo();

  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const view: PostStatusView = useMemo(() => ({
    setBusy: setIsLoading,
    showInfo: (msg, sticky) => displayInfoMessage(msg, sticky ? 0 : 2000),
    dismissMessage: (id) => deleteMessage(id),
    showError: (msg) => displayErrorMessage(msg),
    clearInput: () => setPost(""),
  }), [displayInfoMessage, deleteMessage, displayErrorMessage]);

  const presenter = useMemo(() => new PostStatusPresenter(view), [view]);

  const submitPost = async (e: React.MouseEvent) => {
    e.preventDefault();
    await presenter.post(post, currentUser, authToken);
  };

  const clearPost = (e: React.MouseEvent) => {
    e.preventDefault();
    setPost("");
  };

  const checkButtonDisabled = () =>
    !post.trim() || !authToken || !currentUser;

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => setPost(event.target.value)}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonDisabled()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonDisabled()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
