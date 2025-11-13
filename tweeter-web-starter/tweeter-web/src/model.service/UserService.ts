import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    async getFollowerCount (
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return FakeData.instance.getFollowerCount(user.alias);
    }

    async getFolloweeCount (
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    }
}