import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { Buffer } from "buffer";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "../../../presenter/AuthPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const view: AuthView = useMemo(() => ({
    setBusy: setIsLoading,
    showError: (msg) => displayErrorMessage(msg),
    onLoggedIn: () => {}, // not used here
    onRegistered: (user: User, token: AuthToken, remember: boolean) => {
      updateUser(user, user, token, remember);
      navigate(`/feed/${user.alias}`);
    }
  }), [displayErrorMessage, navigate, updateUser]);

  const presenter = useMemo(() => new AuthPresenter(view), [view]);

  const checkSubmitButtonStatus = (): boolean =>
    !firstName || !lastName || !alias || !password || !imageUrl || !imageFileExtension;

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | undefined) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];
        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");
        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = getFileExtension(file);
      if (fileExtension) setImageFileExtension(fileExtension);
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  };

  const getFileExtension = (file: File): string | undefined =>
    file.name.split(".").pop();

  const doRegister = async () => {
    await presenter.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe
    );
  };

  const inputFieldFactory = () => (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="firstNameInput"
          placeholder="First Name"
          onKeyDown={registerOnEnter}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="firstNameInput">First Name</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="lastNameInput"
          placeholder="Last Name"
          onKeyDown={registerOnEnter}
          onChange={(event) => setLastName(event.target.value)}
        />
        <label htmlFor="lastNameInput">Last Name</label>
      </div>
      <AuthenticationFields
        mode="register"
        originalURL=""
        alias={alias}
        password={password}
        setAlias={setAlias}
        setPassword={setPassword}
        onEnter={registerOnEnter}
      />
      <div className="form-floating mb-3">
        <input
          type="file"
          className="d-inline-block py-5 px-4 form-control bottom"
          id="imageFileInput"
          onKeyDown={registerOnEnter}
          onChange={handleFileChange}
        />
        {imageUrl.length > 0 && (
          <>
            <label htmlFor="imageFileInput">User Image</label>
            <img src={imageUrl} className="img-thumbnail" alt="" />
          </>
        )}
      </div>
    </>
  );

  const switchAuthenticationMethodFactory = () => (
    <div className="mb-3">
      Algready registered? <Link to="/login">Sign in</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
