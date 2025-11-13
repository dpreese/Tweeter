import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";

interface UserInfoActions {
  updateUser: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
  clearUser: () => void,
  setDisplayed: (user: User) => void,
}

export const useUserInfoActions = (): UserInfoActions => {
  const { updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(UserInfoActionsContext);
  return {
    updateUser: (currentUser, displayedUser, authToken, remember) => updateUserInfo(currentUser, displayedUser, authToken, remember),
    clearUser: clearUserInfo,
    setDisplayed: (user) => setDisplayedUser(user),
  };
};

export const useUserInfo = () => useContext(UserInfoContext);

const normalizeAlias = (raw: string) => {
  const t = raw.trim();
  return t.startsWith("@") ? t : `@${t}`;
};

export const useNavigateToUser = (featurePath: string) => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayed } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const userSvc = new UserService();

  const goToUser = async (aliasRaw: string) => {
    try {
      const alias = normalizeAlias(aliasRaw);
      const token = authToken!;
      const toUser = await userSvc.getUser(token, alias);

      if (toUser && (!displayedUser || !toUser.equals(displayedUser))) {
        setDisplayed(toUser);
      }
      if (toUser) {
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const aliasLinkProps = (alias: string) => ({
    href: `${featurePath}/${alias}`,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      void goToUser(alias);
    },
  });

  return { goToUser, aliasLinkProps };
};
