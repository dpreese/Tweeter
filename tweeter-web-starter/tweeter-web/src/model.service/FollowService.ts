import { AuthToken, User, FakeData, Status } from "tweeter-shared";

export class FollowService {
    public async loadMoreFollowees (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: User | null
  ): Promise<[User[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };
  public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  };
  public async isFollower(
    authToken: AuthToken,
    currentUser: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO (M3): real server call
    return FakeData.instance.isFollower();
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<void> {
    // TODO (M3): server call; FakeData may not expose a follow mutation; no-op here
    return;
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<void> {
    // TODO (M3): server call; no-op for M2A
    return;
  }
}
