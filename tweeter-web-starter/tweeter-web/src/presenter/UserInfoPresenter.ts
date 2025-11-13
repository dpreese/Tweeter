import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";

export interface UserInfoView {
  setBusy(busy: boolean): void;
  setIsFollower(isFollower: boolean): void;
  setCounts(followers: number, followees: number): void;
  showInfo(msg: string, sticky?: boolean): string;   // returns message id
  dismissMessage(id: string): void;
  showError(msg: string): void;
}

export class UserInfoPresenter {
  private readonly view: UserInfoView;
  private readonly followSvc: FollowService;
  private readonly userSvc: UserService;

  constructor(view: UserInfoView, followSvc = new FollowService(), userSvc = new UserService()) {
    this.view = view;
    this.followSvc = followSvc;
    this.userSvc = userSvc;
  }

  public async init(auth: AuthToken, currentUser: User, displayedUser: User): Promise<void> {
    this.view.setBusy(true);
    try {
      // isFollower
      const isFollower =
        currentUser.equals(displayedUser)
          ? false
          : await this.followSvc.isFollower(auth, currentUser, displayedUser);
      this.view.setIsFollower(isFollower);

      // counts
      const [followers, followees] = await Promise.all([
        this.userSvc.getFollowerCount(auth, displayedUser),
        this.userSvc.getFolloweeCount(auth, displayedUser),
      ]);
      this.view.setCounts(followers, followees);
    } catch (e) {
      this.view.showError(`Failed to initialize user info: ${e}`);
    } finally {
      this.view.setBusy(false);
    }
  }

  public async follow(auth: AuthToken, currentUser: User, displayedUser: User): Promise<void> {
    let msgId = "";
    this.view.setBusy(true);
    try {
      msgId = this.view.showInfo(`Following ${displayedUser.name}...`, true);
      await this.followSvc.follow(auth, displayedUser);

      const [followers, followees] = await Promise.all([
        this.userSvc.getFollowerCount(auth, displayedUser),
        this.userSvc.getFolloweeCount(auth, displayedUser),
      ]);
      this.view.setIsFollower(true);
      this.view.setCounts(followers, followees);
    } catch (e) {
      this.view.showError(`Failed to follow user because of exception: ${e}`);
    } finally {
      if (msgId) this.view.dismissMessage(msgId);
      this.view.setBusy(false);
    }
  }

  public async unfollow(auth: AuthToken, currentUser: User, displayedUser: User): Promise<void> {
    let msgId = "";
    this.view.setBusy(true);
    try {
      msgId = this.view.showInfo(`Unfollowing ${displayedUser.name}...`, true);
      await this.followSvc.unfollow(auth, displayedUser);

      const [followers, followees] = await Promise.all([
        this.userSvc.getFollowerCount(auth, displayedUser),
        this.userSvc.getFolloweeCount(auth, displayedUser),
      ]);
      this.view.setIsFollower(false);
      this.view.setCounts(followers, followees);
    } catch (e) {
      this.view.showError(`Failed to unfollow user because of exception: ${e}`);
    } finally {
      if (msgId) this.view.dismissMessage(msgId);
      this.view.setBusy(false);
    }
  }
}
