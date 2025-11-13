import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "../../../presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: AuthView = useMemo(() => ({
    setBusy: setIsLoading,
    showError: (msg) => displayErrorMessage(msg),
    onLoggedIn: (user: User, token: AuthToken, remember: boolean, originalUrl?: string) => {
      updateUser(user, user, token, remember);
      if (originalUrl) navigate(originalUrl);
      else navigate(`/feed/${user.alias}`);
    },
    onRegistered: () => {} // not used here
  }), [displayErrorMessage, navigate, updateUser]);

  const presenter = useMemo(() => new AuthPresenter(view), [view]);

  const checkSubmitButtonStatus = (): boolean => !alias || !password;

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    await presenter.login(alias, password, rememberMe, props.originalUrl);
  };

  const inputFieldFactory = () => (
    <>
      <AuthenticationFields
        mode="login"
        originalURL={props.originalUrl}
        alias={alias}
        password={password}
        setAlias={setAlias}
        setPassword={setPassword}
        onEnter={loginOnEnter}
      />
    </>
  );

  const switchAuthenticationMethodFactory = () => (
    <div className="mb-3">
      Not registered? <Link to="/register">Register</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
