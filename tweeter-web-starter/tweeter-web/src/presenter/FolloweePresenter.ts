import { AuthToken, User, FakeData } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";

export interface FolloweeView {

}

export class FolloweePresenter {
    private service: FollowService;
    private view: FolloweeView;
    private userService: UserService;

    public constructor(view: FolloweeView) {
        this.service = new FollowService();
        this.view = view
        this.userService = new UserService();
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };
}