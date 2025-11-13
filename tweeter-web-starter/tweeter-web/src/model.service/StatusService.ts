import { AuthToken, User, FakeData, Status } from "tweeter-shared";

export class StatusService {
    public async loadMoreStoryItems (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };
    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };
    public async postStatus (
      authToken: AuthToken, 
      newStatus: Status
    ): Promise<void> {
      // M2A: simulate server latency so the spinner/message is visible
      await new Promise((f) => setTimeout(f, 2000));
      // TODO (Milestone 3): replace with real server call
  }
}